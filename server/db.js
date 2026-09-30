import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'study_tracker.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 45,
    priority TEXT DEFAULT 'Medium',
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    note_text TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT '📚',
    color TEXT DEFAULT 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    picture TEXT DEFAULT '',
    google_id TEXT,
    auth_provider TEXT DEFAULT 'google',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
  CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
  CREATE INDEX IF NOT EXISTS idx_daily_notes_date ON daily_notes(date);
`);

// Ensure duration_hours and duration_seconds columns exist
try {
  db.exec("ALTER TABLE tasks ADD COLUMN duration_hours INTEGER DEFAULT 0");
} catch (e) {}
try {
  db.exec("ALTER TABLE tasks ADD COLUMN duration_seconds INTEGER DEFAULT 0");
} catch (e) {}

// Seed default subjects if empty
const subjectCount = db.prepare('SELECT COUNT(*) as count FROM subjects').get();
if (subjectCount.count === 0) {
  const insertSub = db.prepare('INSERT OR IGNORE INTO subjects (id, name, icon, color) VALUES (?, ?, ?, ?)');
  insertSub.run('sub_1', 'MAD 1 Project', '💻', 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700');
  insertSub.run('sub_2', 'DBMS', '🗄️', 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600');
  insertSub.run('sub_3', 'System Commands', '⚙️', 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800');
}

// Seed sample data if empty
const taskCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
if (taskCount.count === 0) {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, date, subject, topic, duration_minutes, priority, completed, completed_at, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedTasks = db.transaction(() => {
    insertTask.run('1', today, 'MAD 1 Project', 'Complete Flask routes and Jinja templates for Task Manager', 90, 'High', 1, now, 'Focus on CRUD operations and form validation', now);
    insertTask.run('2', today, 'DBMS', 'Normalization: 1NF, 2NF, 3NF & BCNF with examples', 60, 'High', 0, null, 'Solve assignment questions from Week 5', now);
    insertTask.run('3', today, 'System Commands', 'Shell scripting: loops, conditionals & file processing', 45, 'Medium', 0, null, 'Practice grep, awk, sed commands', now);
    insertTask.run('4', today, 'DBMS', 'SQL Joins and Subqueries practice problems', 45, 'Medium', 1, now, 'Completed 10 queries from practice set', now);
  });

  seedTasks();

  db.prepare(`
    INSERT OR IGNORE INTO daily_notes (date, note_text, created_at)
    VALUES (?, ?, ?)
  `).run(today, 'Completed Flask CRUD routes and solved 10 SQL queries today.', now);
}

export default db;
