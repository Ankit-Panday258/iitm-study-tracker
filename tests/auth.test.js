import 'dotenv/config';
import mysql from 'mysql2/promise';
import crypto from 'node:crypto';
import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import express from 'express';
import {OAuth2Client} from 'google-auth-library';
const temp=mkdtempSync(path.join(tmpdir(),'iitm-auth-'));
const mysqlTest=process.env.AUTH_TEST_MYSQL==='1';
const testDatabase='iitm_auth_test_'+crypto.randomBytes(6).toString('hex');
process.env.DATABASE_DRIVER=mysqlTest ? 'mysql' : 'sqlite';
if(mysqlTest) process.env.MYSQL_DATABASE=testDatabase;
process.env.SQLITE_PATH=path.join(temp,'test.db');
process.env.APP_ORIGIN='http://localhost:3000';process.env.GOOGLE_CLIENT_ID='test-client';
const {handleApiRequest}=await import('../server/apiHandler.js');
const {default:db}=await import('../server/db.js');
const {query}=await import('../server/authStore.js');
const {closeMySQL}=await import('../server/mysql.js');
const app=express();app.use(express.json());app.use(handleApiRequest);
const server=await new Promise(resolve=>{const s=app.listen(0,()=>resolve(s));});
const base=`http://localhost:${server.address().port}`;
async function request(route,method='GET',body,cookie='') {
  const res=await fetch(base+route,{method,headers:{'Content-Type':'application/json',Cookie:cookie},body:body ? JSON.stringify(body) : undefined});
  return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};
}
after(async()=>{
 await new Promise(resolve=>server.close(resolve));
 if(mysqlTest) {
  await closeMySQL();
  const cleanup=await mysql.createConnection({host:process.env.MYSQL_HOST || '127.0.0.1',port:Number(process.env.MYSQL_PORT || 3306),user:process.env.MYSQL_USER,password:process.env.MYSQL_PASSWORD});
  try {await cleanup.query(`DROP DATABASE IF EXISTS \`${testDatabase}\``);} finally {await cleanup.end();}
 } else db.close();
 rmSync(temp,{recursive:true,force:true});
});
test('Registration, session persistence, ownership, logout and rejected impersonation',async()=>{
  const account={name:'Test Student',email:'Student@example.com',password:'strong-password'};
  assert.equal((await request('/api/tasks')).status,401);
  assert.equal((await request('/api/auth/login','POST',{email:account.email})).status,400);
  assert.equal((await request('/api/auth/register','POST',{...account,password:'123'})).status,400);
  const registered=await request('/api/auth/register','POST',account);
  assert.equal(registered.status,201);assert.equal(registered.data.user.email,'student@example.com');assert.ok(registered.cookie);
  const stored=(await query('SELECT * FROM users WHERE email = ?', ['student@example.com']))[0];assert.ok(stored.password_hash.includes(':'));assert.notEqual(stored.password_hash,account.password);
  assert.equal((await request('/api/auth/register','POST',account)).status,409);
  assert.equal((await request('/api/auth/login','POST',{...account,password:'wrong'})).status,401);
  const logged=await request('/api/auth/login','POST',account);assert.equal(logged.status,200);
  const cookie=logged.cookie;
  assert.equal((await request('/api/auth/me','GET',null,cookie)).data.user.id,stored.id);
  // Session is stored in database, not memory, and only a hash is stored.
  assert.ok((await query('SELECT * FROM auth_sessions')).length);assert.ok(!JSON.stringify((await query('SELECT * FROM auth_sessions'))).includes(cookie.split('=')[1]));
  const created=await request('/api/tasks','POST',{date:'2026-10-09',subject:'Python',topic:'Test task',userEmail:'victim@example.com'},cookie);
  assert.equal(created.status,201);assert.equal(created.data.userEmail,'student@example.com');
  const other=await request('/api/auth/register','POST',{...account,email:'other@example.com'});
  const otherTasks=await request('/api/tasks?all_users=true&user_email=student@example.com','GET',null,other.cookie);
  assert.equal(otherTasks.data.length,0);
  for(const [route,method] of [[`/api/tasks/${created.data.id}`,'PUT'],[`/api/tasks/${created.data.id}/toggle`,'PATCH'],[`/api/tasks/${created.data.id}`,'DELETE']]) assert.equal((await request(route,method,{},other.cookie)).status,404);
  assert.equal((await request('/api/notes/2026-10-09','PUT',{noteText:'My note',userEmail:'other@example.com'},cookie)).status,200);
  assert.equal((await request('/api/notes/2026-10-09','PUT',{noteText:'Other note'},other.cookie)).status,200);
  assert.equal((await request('/api/notes/2026-10-09','GET',null,cookie)).data.noteText,'My note');
  assert.equal((await request('/api/tasks/'+created.data.id+'/toggle','PATCH',{},cookie)).data.completed,true);
  assert.equal((await request('/api/auth/google','POST',{email:'fake@example.com',googleId:'fake'})).status,400);
  assert.equal((await request('/api/auth/google','POST',{credential:'fake-token'})).status,401);
  assert.equal((await request('/api/auth/logout','POST',{},cookie)).status,200);
  assert.equal((await request('/api/auth/me','GET',null,cookie)).status,401);
});

test('Verified Google identity is persisted and reuses the same account',async()=>{
  const original=OAuth2Client.prototype.verifyIdToken;
  OAuth2Client.prototype.verifyIdToken=async function(options) {
    assert.equal(options.audience,'test-client');assert.equal(options.idToken,'verified-test-token');
    return {getPayload:()=>({sub:'google-subject-123',email:'google@gmail.com',email_verified:true,name:'Google Student'})};
  };
  try {
    const first=await request('/api/auth/google','POST',{credential:'verified-test-token',email:'attacker@example.com'});
    assert.equal(first.status,200);assert.equal(first.data.user.email,'google@gmail.com');
    const second=await request('/api/auth/google','POST',{credential:'verified-test-token'});
    assert.equal(first.data.user.id,second.data.user.id);
    assert.equal((await query('SELECT google_id FROM users WHERE id = ?', [first.data.user.id]))[0].google_id,'google-subject-123');
    assert.equal((await request('/api/auth/me','GET',null,second.cookie)).data.user.id,first.data.user.id);
    OAuth2Client.prototype.verifyIdToken=async()=>({getPayload:()=>({sub:'other-google-id',email:'student@example.com',email_verified:true})});
    assert.equal((await request('/api/auth/google','POST',{credential:'verified-test-token'})).status,409);
  } finally {OAuth2Client.prototype.verifyIdToken=original;}
});

test('Origin checks normalize a configured URL and reject cross-origin requests', async () => {
  const prior=process.env.APP_ORIGIN;
  process.env.APP_ORIGIN='http://localhost:3000/';
  try {
    const body=JSON.stringify({email:'student@example.com',password:'strong-password'});
    const matching=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body});
    assert.equal(matching.status,200);
    const foreign=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://untrusted.example'},body});
    assert.equal(foreign.status,403);
  } finally { process.env.APP_ORIGIN=prior; }
});
