import crypto from 'node:crypto';
import db from './db.js';
import { authQuery, databaseReady } from './mysql.js';
export const databaseType = process.env.DATABASE_DRIVER || 'mysql';
export async function query(sql, params = []) {
  await databaseReady;
  if (databaseType === 'mysql') return authQuery(sql, params);
  const statement = db.prepare(sql);
  return /^SELECT/i.test(sql.trim()) ? statement.all(...params) : statement.run(...params);
}
let initialized;
export function ready() {
  return initialized ||= (async () => {
    await databaseReady;
    await query(`CREATE TABLE IF NOT EXISTS auth_sessions (
      token_hash VARCHAR(64) PRIMARY KEY, user_id VARCHAR(255) NOT NULL,
      expires_at BIGINT NOT NULL)`);
  })();
}
export const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');
export const publicUser = row => ({ id: row.id, email: row.email, name: row.name,
  picture: row.picture || '', authProvider: row.auth_provider, createdAt: row.created_at });
export async function findUser(email) { return (await query('SELECT * FROM users WHERE email = ?', [email]))[0]; }
export async function createUser({email, name, passwordHash = null, googleId = null, picture = ''}) {
  const id = crypto.randomUUID();
  await query(`INSERT INTO users (id,email,name,picture,password_hash,google_id,auth_provider,created_at)
    VALUES (?,?,?,?,?,?,?,?)`, [id,email,name,picture,passwordHash,googleId,googleId ? 'google' : 'email',new Date().toISOString()]);
  return findUser(email);
}
