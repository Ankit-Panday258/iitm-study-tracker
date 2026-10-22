import crypto from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { hashPassword, verifyPassword } from './authUtils.js';
import { query, ready, tokenHash, publicUser, findUser, createUser, listUsers } from './authStore.js';
import { getMySQLStatus } from './mysql.js';
import { connectMongoDB, getMongoStatus, isMongoConnected } from './mongodb.js';
import { IITM_CURRICULUM, IITM_STUDY_GOALS } from '../src/data/iitmCurriculum.js';
const google = new OAuth2Client();
const cookieName = 'iitm_session';
const maxAge = 7 * 24 * 60 * 60;
const attempts = new Map();
function limitAttempts(req) {
  const now = Date.now(), key = req.socket.remoteAddress || 'unknown';
  for (const [address, entry] of attempts) if (entry.until <= now) attempts.delete(address);
  const entry = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
  if (++entry.count > 30) throw fail(429, 'Too many sign-in attempts. Please try again in 15 minutes.');
  attempts.set(key, entry);
}

function send(res, status, data) { res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data)); }
function fail(status, message) { return Object.assign(new Error(message), {status}); }
function validateStudySelection(body) {
  const studyGoal=IITM_STUDY_GOALS.find(goal=>goal.id===body.studyGoal);
  if(!studyGoal) throw fail(400,'Choose your IITM study level or degree goal.');
  if(!Array.isArray(body.selectedSubjects) || body.selectedSubjects.length===0 || body.selectedSubjects.length>50) throw fail(400,'Choose at least one subject.');
  const availableCodes=new Set(IITM_CURRICULUM.filter(course=>course.level===studyGoal.curriculumLevel).map(course=>course.code));
  const selectedSubjects=[...new Set(body.selectedSubjects)];
  if(selectedSubjects.length!==body.selectedSubjects.length || selectedSubjects.some(code=>typeof code!=='string' || !availableCodes.has(code))) throw fail(400,'The selected subjects do not match the chosen study level.');
  return {studyGoal:studyGoal.id,selectedSubjects};
}
function cookie(token, age=maxAge) { return `${cookieName}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${age}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`; }
function sessionToken(req) { return (req.headers.cookie || '').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1); }
async function readBody(req) {
  if(req.body) return req.body;
  let data='';for await(const chunk of req) { data+=chunk; if(data.length>20000) throw fail(413,'Request too large.'); }
  try {return JSON.parse(data || '{}');} catch {throw fail(400,'Invalid JSON.');}
}
async function signIn(req,res,row,status=200) {
  const old=sessionToken(req);if(old) await query('DELETE FROM auth_sessions WHERE token_hash = ?', [tokenHash(old)]);
  const token=crypto.randomBytes(32).toString('hex');
  await query('DELETE FROM auth_sessions WHERE expires_at < ?', [Date.now()]);
  await query('INSERT INTO auth_sessions (token_hash,user_id,expires_at) VALUES (?,?,?)',[tokenHash(token),row.id,Date.now()+maxAge*1000]);
  res.setHeader('Set-Cookie',cookie(token));send(res,status,{success:true,user:publicUser(row)});
}
export async function authMiddleware(req,res,next) {
  const path=new URL(req.url,'http://localhost').pathname;
  if(!path.startsWith('/api/')) return next();
  try {
    // Browser requests must originate on the configured app (works behind reverse proxies).
    if(!['GET','HEAD','OPTIONS'].includes(req.method) && req.headers.origin) {
      const allowed=new URL(req.appOrigin || process.env.APP_ORIGIN || `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`).origin;
      if(req.headers.origin!==allowed) throw fail(403,'Request origin is not allowed.');
    }
    // Keep a sanitized health check available when database startup itself fails.
    // Do not expose the configured host, database, username, or raw driver error.
    if(path==='/api/db-status' && req.method==='GET') {
      const mysql = getMySQLStatus();
      const configuredDriver = ['mysql','sqlite','mongodb'].includes(process.env.DATABASE_DRIVER) ? process.env.DATABASE_DRIVER : 'unknown';
      if(configuredDriver==='mongodb' && !isMongoConnected()) await connectMongoDB();
      const mongo = getMongoStatus();
      const connected = configuredDriver === 'mongodb' ? mongo.connected : mysql.connected;
      return send(res,200,{
        activeDatabase: connected ? (configuredDriver === 'mongodb' ? 'MongoDB' : 'MySQL') : configuredDriver === 'sqlite' ? 'SQLite' : 'unavailable',
        driver: configuredDriver,
        mysql: { connected: mysql.connected, errorCode: mysql.errorCode, hostFormat: mysql.hostFormat },
        mongo: { connected: mongo.connected, errorCode: mongo.errorCode, database: mongo.database }
      });
    }
    await ready();
    if(path==='/api/auth/config' && req.method==='GET') return send(res,200,{googleClientId:process.env.GOOGLE_CLIENT_ID || ''});
    if(['/api/auth/register','/api/auth/login','/api/auth/google'].includes(path) && req.method==='POST') {
      limitAttempts(req);
      const body=await readBody(req);
      let row;
      if(path.endsWith('/google')) {
        if(!body.credential || typeof body.credential!=='string') throw fail(400,'A Google ID token is required.');
        if(!process.env.GOOGLE_CLIENT_ID) throw fail(503,'Google sign-in has not been configured.');
        let payload;
        try { const ticket=await google.verifyIdToken({idToken:body.credential,audience:process.env.GOOGLE_CLIENT_ID});payload=ticket.getPayload(); }
        catch {throw fail(401,'Google identity could not be verified.');}
        if(!payload?.sub || !payload.email || !payload.email_verified) throw fail(401,'Google email must be verified.');
        const linked=(await query('SELECT * FROM users WHERE google_id = ?',[payload.sub]))[0];
        row=linked || await findUser(payload.email.toLowerCase().trim());
        if(row && row.google_id!==payload.sub) throw fail(409,'This email already has an account. Sign in with its existing method.');
        if(!row) {
          if(!body.studyGoal || !Array.isArray(body.selectedSubjects)) throw fail(404,'No account found. Create an account first and choose your study goal and subjects.');
          const study=validateStudySelection(body);
          row=await createUser({email:payload.email.toLowerCase().trim(),name:payload.name || payload.email.split('@')[0],googleId:payload.sub,picture:payload.picture || '',...study});
        }
      } else {
        const email=typeof body.email==='string' ? body.email.trim().toLowerCase() : '';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) throw fail(400,'A valid email address is required.');
        if(typeof body.password!=='string' || !body.password || body.password.length>128) throw fail(400,'A password is required (maximum 128 characters).');
        row=await findUser(email);
        if(path.endsWith('/register')) {
          if(body.password.length<8) throw fail(400,'Password must be at least 8 characters.');
          if(typeof body.name!=='string' || !body.name.trim() || body.name.trim().length>100) throw fail(400,'Your full name is required (maximum 100 characters).');
          const study=validateStudySelection(body);
          if(row) throw fail(409,'An account already exists with this email. Please sign in.');
          row=await createUser({email,name:body.name.trim(),passwordHash:hashPassword(body.password),...study});
        } else if(!row || !verifyPassword(body.password,row.password_hash)) throw fail(401,'Incorrect email or password.');
      }
      return await signIn(req,res,row,path.endsWith('/register') ? 201 : 200);
    }
    const token=sessionToken(req);
    const session=token && (await query('SELECT * FROM auth_sessions WHERE token_hash = ? AND expires_at > ?',[tokenHash(token),Date.now()]))[0];
    const row=session && (await query('SELECT * FROM users WHERE id = ?',[session.user_id]))[0];
    if(path==='/api/auth/logout' && req.method==='POST') {
      if(token) await query('DELETE FROM auth_sessions WHERE token_hash = ?',[tokenHash(token)]);
      res.setHeader('Set-Cookie',cookie('',0));return send(res,200,{success:true});
    }
    if(path==='/api/auth/me' && req.method==='GET') return send(res,row ? 200 : 401,row ? {user:publicUser(row)} : {error:'Please sign in.'});
    if(!row) throw fail(401,'Please sign in to access your study records.');
    req.user=publicUser(row);
    if(path.startsWith('/api/admin/')) {
      if(!req.user.isAdmin) throw fail(403,'Admin access is required.');
      if(path==='/api/admin/users' && req.method==='GET') {
        const users=await listUsers();
        return send(res,200,users.map(publicUser));
      }
      if(path==='/api/admin/users' && req.method==='POST') {
        const body=await readBody(req);
        const email=typeof body.email==='string' ? body.email.trim().toLowerCase() : '';
        const name=typeof body.name==='string' ? body.name.trim() : '';
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254) throw fail(400,'A valid email address is required.');
        if(!name || name.length>100) throw fail(400,'A name is required (maximum 100 characters).');
        if(typeof body.password!=='string' || body.password.length<8 || body.password.length>128) throw fail(400,'Password must be between 8 and 128 characters.');
        if(await findUser(email)) throw fail(409,'An account already exists with this email.');
        const created=await createUser({email,name,passwordHash:hashPassword(body.password)});
        return send(res,201,{user:publicUser(created)});
      }
      throw fail(404,'Not found.');
    }
    // Legacy handlers receive identity only from the verified session.
    req.headers['x-user-email']=row.email;
    if(req.query) {req.query.user_email=row.email;delete req.query.all_users;}
    const parsed=new URL(req.url,'http://localhost');parsed.searchParams.set('user_email',row.email);parsed.searchParams.delete('all_users');req.url=parsed.pathname+parsed.search;
    if(path==='/api/users') return send(res,200,[publicUser(row)]);
    if(/^\/api\/auth\//.test(path)) throw fail(404,'Not found.');
    // Check ownership before existing CRUD handlers; never accept a caller-selected owner.
    const taskId=/^\/api\/tasks\/([^/]+)/.exec(path)?.[1];
    if(taskId && ['PUT','PATCH','DELETE'].includes(req.method)) {
      const task=(await query('SELECT user_email FROM tasks WHERE id = ?',[decodeURIComponent(taskId)]))[0];
      if(!task || task.user_email!==row.email) throw fail(404,'Task not found.');
    }
    // Parse once so duplicate IDs cannot overwrite another user's task.
    if(path==='/api/tasks' && req.method==='POST') {
      req.body=await readBody(req);req.body.id=crypto.randomUUID();req.body.userEmail=row.email;
    }
    return next();
  } catch(error) {
    const duplicate=error.code==='ER_DUP_ENTRY' || error.code==='SQLITE_CONSTRAINT_UNIQUE' || error.code===11000;
    const status=error.status || (duplicate ? 409 : 503);
    send(res,status,{error:error.status ? error.message : duplicate ? 'An account already exists.' : 'Database unavailable. Please try again later.'});
  }
}
