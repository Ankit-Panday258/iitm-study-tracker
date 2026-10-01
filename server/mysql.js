import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MYSQL_HOST = process.env.MYSQL_HOST || '127.0.0.1';
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const MYSQL_USER = process.env.MYSQL_USER || 'root';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'password';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'iitm_study_tracker';

let pool = null;
let isConnected = false;
let connectionError = null;

export async function initMySQL() {
  try {
    // 1. Initial connection without database to ensure database exists
    const rootConn = await mysql.createConnection({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // 2. Create connection pool for the app database
    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        icon VARCHAR(50) DEFAULT '📚',
        color VARCHAR(255) DEFAULT 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
        created_at VARCHAR(100) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        date VARCHAR(20) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        topic TEXT NOT NULL,
        duration_hours INT DEFAULT 0,
        duration_minutes INT DEFAULT 45,
        duration_seconds INT DEFAULT 0,
        priority VARCHAR(50) DEFAULT 'Medium',
        completed TINYINT(1) DEFAULT 0,
        completed_at VARCHAR(100) NULL,
        notes TEXT NULL,
        created_at VARCHAR(100) NULL,
        updated_at VARCHAR(100) NULL,
        INDEX idx_date (date),
        INDEX idx_completed (completed)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(20) UNIQUE NOT NULL,
        note_text TEXT NULL,
        created_at VARCHAR(100) NULL,
        updated_at VARCHAR(100) NULL,
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        picture TEXT NULL,
        google_id VARCHAR(255) NULL,
        auth_provider VARCHAR(50) DEFAULT 'google',
        created_at VARCHAR(100) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Seed default subjects if empty
    const [subCountRows] = await pool.query('SELECT COUNT(*) as count FROM subjects');
    if (subCountRows[0].count === 0) {
      await pool.query(`
        INSERT INTO subjects (id, name, icon, color, created_at) VALUES 
        ('sub_1', 'MAD 1 Project', '💻', 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700', NOW()),
        ('sub_2', 'DBMS', '🗄️', 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600', NOW()),
        ('sub_3', 'System Commands', '⚙️', 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800', NOW())
      `);
      console.log('🐬 Default subjects seeded in MySQL');
    }

    // 5. Seed default tasks if empty
    const [taskCountRows] = await pool.query('SELECT COUNT(*) as count FROM tasks');
    if (taskCountRows[0].count === 0) {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();

      await pool.query(`
        INSERT INTO tasks (id, date, subject, topic, duration_minutes, priority, completed, completed_at, notes, created_at) VALUES 
        ('1', ?, 'MAD 1 Project', 'Complete Flask routes and Jinja templates for Task Manager', 90, 'High', 1, ?, 'Focus on CRUD operations and form validation', ?),
        ('2', ?, 'DBMS', 'Normalization: 1NF, 2NF, 3NF & BCNF with examples', 60, 'High', 0, NULL, 'Solve assignment questions from Week 5', ?),
        ('3', ?, 'System Commands', 'Shell scripting: loops, conditionals & file processing', 45, 'Medium', 0, NULL, 'Practice grep, awk, sed commands. Book Drive: https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv', ?),
        ('4', ?, 'DBMS', 'SQL Joins and Subqueries practice problems', 45, 'Medium', 1, ?, 'Completed 10 queries from practice set', ?)
      `, [today, now, now, today, now, today, now, today, now, now]);

      await pool.query(`
        INSERT INTO daily_notes (date, note_text, created_at, updated_at) VALUES 
        (?, 'Completed Flask CRUD routes and solved 10 SQL queries today.', ?, ?)
        ON DUPLICATE KEY UPDATE note_text = VALUES(note_text)
      `, [today, now, now]);

      console.log('🐬 Default study tasks seeded in MySQL');
    }

    isConnected = true;
    connectionError = null;
    console.log(`🐬 Connected to local MySQL successfully at: ${MYSQL_HOST}:${MYSQL_PORT} / db: ${MYSQL_DATABASE}`);
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    console.error(`🐬 MySQL connection error: ${err.message}. (Falling back to SQLite)`);
    return false;
  }
}

export function isMySQLConnected() {
  return isConnected && pool !== null;
}

export function getMySQLStatus() {
  return {
    connected: isConnected,
    type: 'MySQL',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    error: connectionError
  };
}

// ─── CRUD OPERATIONS ON MYSQL ────────────────────────────────

export async function mySQLGetTasks(date) {
  if (!pool) throw new Error('MySQL pool not ready');
  let rows;
  if (date) {
    [rows] = await pool.query('SELECT * FROM tasks WHERE date = ? ORDER BY created_at DESC', [date]);
  } else {
    [rows] = await pool.query('SELECT * FROM tasks ORDER BY date DESC, created_at DESC');
  }

  return rows.map(t => ({
    id: t.id,
    date: t.date,
    subject: t.subject,
    topic: t.topic,
    durationHours: t.duration_hours || 0,
    durationMinutes: t.duration_minutes || 0,
    durationSeconds: t.duration_seconds || 0,
    priority: t.priority,
    completed: t.completed === 1,
    completedAt: t.completed_at,
    notes: t.notes || '',
    createdAt: t.created_at
  }));
}

export async function mySQLCreateTask(taskData) {
  if (!pool) throw new Error('MySQL pool not ready');
  const taskId = taskData.id || Date.now().toString();
  const now = new Date().toISOString();

  await pool.query(`
    INSERT INTO tasks (id, date, subject, topic, duration_hours, duration_minutes, duration_seconds, priority, completed, completed_at, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)
  `, [
    taskId,
    taskData.date,
    taskData.subject,
    taskData.topic,
    taskData.durationHours || 0,
    taskData.durationMinutes || 45,
    taskData.durationSeconds || 0,
    taskData.priority || 'Medium',
    taskData.notes || '',
    now
  ]);

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
  const task = rows[0];
  return {
    id: task.id,
    date: task.date,
    subject: task.subject,
    topic: task.topic,
    durationHours: task.duration_hours || 0,
    durationMinutes: task.duration_minutes || 0,
    durationSeconds: task.duration_seconds || 0,
    priority: task.priority,
    completed: task.completed === 1,
    completedAt: task.completed_at,
    notes: task.notes || '',
    createdAt: task.created_at
  };
}

export async function mySQLUpdateTask(id, taskData) {
  if (!pool) throw new Error('MySQL pool not ready');
  const now = new Date().toISOString();

  await pool.query(`
    UPDATE tasks
    SET date = ?, subject = ?, topic = ?, duration_hours = ?, duration_minutes = ?, duration_seconds = ?, priority = ?,
        completed = ?, completed_at = ?, notes = ?, updated_at = ?
    WHERE id = ?
  `, [
    taskData.date,
    taskData.subject,
    taskData.topic,
    taskData.durationHours || 0,
    taskData.durationMinutes || 45,
    taskData.durationSeconds || 0,
    taskData.priority || 'Medium',
    taskData.completed ? 1 : 0,
    taskData.completedAt || null,
    taskData.notes || '',
    now,
    id
  ]);

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const task = rows[0];
  return {
    id: task.id,
    date: task.date,
    subject: task.subject,
    topic: task.topic,
    durationHours: task.duration_hours || 0,
    durationMinutes: task.duration_minutes || 0,
    durationSeconds: task.duration_seconds || 0,
    priority: task.priority,
    completed: task.completed === 1,
    completedAt: task.completed_at,
    notes: task.notes || '',
    createdAt: task.created_at
  };
}

export async function mySQLToggleTask(id) {
  if (!pool) throw new Error('MySQL pool not ready');
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const task = rows[0];

  const newCompleted = task.completed === 1 ? 0 : 1;
  const completedAt = newCompleted === 1 ? new Date().toISOString() : null;
  const now = new Date().toISOString();

  await pool.query(`
    UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?
  `, [newCompleted, completedAt, now, id]);

  return {
    id: task.id,
    date: task.date,
    subject: task.subject,
    topic: task.topic,
    durationHours: task.duration_hours || 0,
    durationMinutes: task.duration_minutes || 0,
    durationSeconds: task.duration_seconds || 0,
    priority: task.priority,
    completed: newCompleted === 1,
    completedAt,
    notes: task.notes || '',
    createdAt: task.created_at
  };
}

export async function mySQLDeleteTask(id) {
  if (!pool) throw new Error('MySQL pool not ready');
  const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function mySQLGetDailyTrack() {
  if (!pool) throw new Error('MySQL pool not ready');
  const [rows] = await pool.query(`
    SELECT date, subject, topic, duration_minutes, completed_at, notes, priority
    FROM tasks
    WHERE completed = 1
    ORDER BY date DESC, completed_at DESC
  `);

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.date]) grouped[row.date] = [];
    grouped[row.date].push({
      subject: row.subject,
      topic: row.topic,
      durationMinutes: row.duration_minutes,
      completedAt: row.completed_at,
      notes: row.notes,
      priority: row.priority
    });
  }

  return Object.entries(grouped).map(([date, tasks]) => ({
    date,
    totalMinutes: tasks.reduce((acc, t) => acc + t.durationMinutes, 0),
    completedCount: tasks.length,
    tasks
  })).sort((a, b) => b.date.localeCompare(a.date));
}

export async function mySQLGetNote(date) {
  if (!pool) throw new Error('MySQL pool not ready');
  const [rows] = await pool.query('SELECT * FROM daily_notes WHERE date = ?', [date]);
  return rows.length > 0 ? { date: rows[0].date, noteText: rows[0].note_text } : { date, noteText: '' };
}

export async function mySQLSaveNote(date, noteText) {
  if (!pool) throw new Error('MySQL pool not ready');
  const now = new Date().toISOString();
  await pool.query(`
    INSERT INTO daily_notes (date, note_text, created_at, updated_at)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE note_text = VALUES(note_text), updated_at = VALUES(updated_at)
  `, [date, noteText || '', now, now]);
  return { date, noteText: noteText || '' };
}

export async function mySQLGetStreak() {
  if (!pool) throw new Error('MySQL pool not ready');
  const [rows] = await pool.query(`
    SELECT DISTINCT date FROM tasks WHERE completed = 1 ORDER BY date DESC
  `);

  const dateSet = new Set(rows.map(r => r.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];

    if (dateSet.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  return streak;
}

export async function mySQLGetSubjects() {
  if (!pool) throw new Error('MySQL pool not ready');
  const [rows] = await pool.query('SELECT * FROM subjects ORDER BY id ASC');
  return rows.map(s => ({
    id: s.id,
    name: s.name,
    icon: s.icon,
    color: s.color
  }));
}

export async function mySQLCreateSubject(data) {
  if (!pool) throw new Error('MySQL pool not ready');
  const id = data.id || 'sub_' + Date.now();
  await pool.query(`
    INSERT INTO subjects (id, name, icon, color, created_at)
    VALUES (?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE icon = VALUES(icon), color = VALUES(color)
  `, [id, data.name, data.icon || '📚', data.color || 'bg-pink-50 text-pink-700']);
  return { id, name: data.name, icon: data.icon, color: data.color };
}

export async function mySQLLoginUser(userData) {
  if (!pool) throw new Error('MySQL pool not ready');
  const id = userData.id || 'usr_' + Date.now();
  await pool.query(`
    INSERT INTO users (id, email, name, picture, google_id, auth_provider, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE name = VALUES(name), picture = VALUES(picture)
  `, [id, userData.email, userData.name, userData.picture || '', userData.googleId || '', userData.authProvider || 'google']);

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [userData.email]);
  return rows[0];
}

export default {
  initMySQL,
  isMySQLConnected,
  getMySQLStatus,
  getTasks: mySQLGetTasks,
  createTask: mySQLCreateTask,
  updateTask: mySQLUpdateTask,
  toggleTask: mySQLToggleTask,
  deleteTask: mySQLDeleteTask,
  getDailyTrack: mySQLGetDailyTrack,
  getNote: mySQLGetNote,
  saveNote: mySQLSaveNote,
  getStreak: mySQLGetStreak,
  getSubjects: mySQLGetSubjects,
  createSubject: mySQLCreateSubject,
  loginUser: mySQLLoginUser
};
