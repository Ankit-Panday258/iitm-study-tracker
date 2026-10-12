import crypto from 'node:crypto';
import db from './db.js';
import { authQuery, databaseReady, isMySQLConnected } from './mysql.js';
import { AuthSession, DailyNote, Subject, Task, User, connectMongoDB, isMongoConnected } from './mongodb.js';

function plain(row) { return row && typeof row.toObject === 'function' ? row.toObject() : row; }

async function mongoQuery(sql, params) {
  const text = sql.trim().replace(/\s+/g, ' ').toLowerCase();
  if (text.startsWith('create table if not exists auth_sessions')) return [];

  if (text.startsWith('select ') && text.includes(' from auth_sessions')) {
    const filter = {};
    if (text.includes('token_hash = ?')) filter.token_hash = params[0];
    if (text.includes('expires_at > ?')) filter.expires_at = { $gt: params.at(-1) };
    return (await AuthSession.find(filter).lean()).map(plain);
  }
  if (text.startsWith('delete from auth_sessions')) {
    if (text.includes('token_hash = ?')) return AuthSession.deleteOne({ token_hash: params[0] });
    if (text.includes('expires_at < ?')) return AuthSession.deleteMany({ expires_at: { $lt: params[0] } });
    return { deletedCount: 0 };
  }
  if (text.startsWith('insert into auth_sessions')) {
    await AuthSession.create({ token_hash: params[0], user_id: params[1], expires_at: params[2] });
    return { inserted: true };
  }
  if (text.startsWith('select ') && text.includes(' from users')) {
    const match = /where (email|google_id|id) = \?/i.exec(sql);
    if (!match) return [];
    const field = match[1].toLowerCase();
    const rows = await User.find({ [field]: params[0] }).lean();
    return rows.map(plain);
  }
  if (text.startsWith('insert into users')) {
    await User.create({
      id: params[0], email: params[1], name: params[2], picture: params[3] || '',
      password_hash: params[4] || null, google_id: params[5] || null,
      auth_provider: params[6] || 'email', created_at: params[7]
    });
    return { inserted: true };
  }
  if (text.startsWith('select ') && text.includes(' from tasks') && text.includes('where id = ?')) {
    const task = await Task.findOne({ id: params[0] }).select('userEmail').lean();
    return task ? [{ user_email: task.userEmail }] : [];
  }
  throw new Error('Unsupported MongoDB auth query');
}

export async function query(sql, params = []) {
  if (process.env.DATABASE_DRIVER === 'mongodb') {
    if (!isMongoConnected()) await connectMongoDB();
    if (!isMongoConnected()) throw new Error('MongoDB is unavailable');
    return mongoQuery(sql, params);
  }
  await databaseReady;
  if (isMySQLConnected()) return authQuery(sql, params);
  const statement = db.prepare(sql);
  return /^SELECT/i.test(sql.trim()) ? statement.all(...params) : statement.run(...params);
}
let initialized;
export function ready() {
  if (!initialized) {
    initialized = (async () => {
    if (process.env.DATABASE_DRIVER === 'mongodb') {
      if (!isMongoConnected()) await connectMongoDB();
      if (!isMongoConnected()) throw new Error('MongoDB is unavailable');
      await Promise.all([User.init(), AuthSession.init(), Task.init(), DailyNote.init(), Subject.init()]);
      return;
    }
    await databaseReady;
    await query(`CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash VARCHAR(64) PRIMARY KEY, user_id VARCHAR(255) NOT NULL,
      expires_at BIGINT NOT NULL)`);
    })();
    initialized.catch(() => { initialized = null; });
  }
  return initialized;
}
export const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
export const publicUser = row => ({ id: row.id, email: row.email, name: row.name,
  picture: row.picture || '', authProvider: row.auth_provider || row.authProvider, createdAt: row.created_at || row.createdAt });
export async function findUser(email) { return (await query('SELECT * FROM users WHERE email = ?', [email]))[0]; }
export async function createUser({email, name, passwordHash = null, googleId = null, picture = ''}) {
  const id = crypto.randomUUID();
  await query(`INSERT INTO users (id,email,name,picture,password_hash,google_id,auth_provider,created_at)
    VALUES (?,?,?,?,?,?,?,?)`, [id,email,name,picture,passwordHash,googleId,googleId ? 'google' : 'email',new Date().toISOString()]);
  return findUser(email);
}
