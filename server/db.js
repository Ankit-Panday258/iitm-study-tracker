import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

try {
  const { default: Database } = await import('better-sqlite3');
  const dbPath = path.join(__dirname, 'study_tracker.db');
  db = new Database(dbPath);

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

  try {
    db.exec("ALTER TABLE tasks ADD COLUMN duration_hours INTEGER DEFAULT 0");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN duration_seconds INTEGER DEFAULT 0");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN user_email TEXT DEFAULT 'kumar@gmail.com'");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE daily_notes ADD COLUMN user_email TEXT DEFAULT 'kumar@gmail.com'");
  } catch (e) {}
  try {
    db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
  } catch (e) {}

  // Seed default subjects if empty
  const subjectCount = db.prepare('SELECT COUNT(*) as count FROM subjects').get();
  if (subjectCount.count === 0) {
    const insertSub = db.prepare('INSERT OR IGNORE INTO subjects (id, name, icon, color) VALUES (?, ?, ?, ?)');
    insertSub.run('sub_1', 'MAD 1 Project', '💻', 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700');
    insertSub.run('sub_2', 'DBMS', '🗄️', 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600');
    insertSub.run('sub_3', 'System Commands', '⚙️', 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800');
  }

  // Seed Kumar and Ankit sample tasks
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  // Seed Kumar
  const kumarCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_email = 'kumar@gmail.com'").get();
  if (kumarCount.count === 0) {
    const insertTask = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, date, subject, topic, duration_minutes, priority, completed, completed_at, notes, user_email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTask.run('kumar_t1', today, 'MAD 1 Project', 'Complete Flask routes and Jinja templates for Task Manager', 90, 'High', 1, now, 'Focus on CRUD operations and form validation', 'kumar@gmail.com', now);
    insertTask.run('kumar_t2', today, 'DBMS', 'Normalization: 1NF, 2NF, 3NF & BCNF with examples', 60, 'High', 0, null, 'Solve assignment questions from Week 5', 'kumar@gmail.com', now);
    insertTask.run('kumar_t3', today, 'DBMS', 'SQL Joins and Subqueries practice problems', 45, 'Medium', 1, now, 'Completed 10 queries from practice set', 'kumar@gmail.com', now);

    db.prepare(`
      INSERT OR IGNORE INTO daily_notes (date, note_text, user_email, created_at)
      VALUES (?, ?, 'kumar@gmail.com', ?)
    `).run(today, 'Kumar Daily Track: Completed Flask CRUD routes and solved 10 SQL queries.', now);
  }

  // Seed Ankit
  const ankitCount = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE user_email = 'ankit@gmail.com'").get();
  if (ankitCount.count === 0) {
    const insertTask = db.prepare(`
      INSERT OR REPLACE INTO tasks (id, date, subject, topic, duration_minutes, priority, completed, completed_at, notes, user_email, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTask.run('ankit_t1', today, 'System Commands', 'Shell scripting: loops, conditionals & file processing. Book Drive: https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv', 45, 'High', 1, now, 'Practice grep, awk, sed commands. Google Drive book link saved.', 'ankit@gmail.com', now);
    insertTask.run('ankit_t2', today, 'MAD 1 Project', 'Frontend state management with React & Vite components', 60, 'High', 0, null, 'Build modular UI components with Tailwind CSS', 'ankit@gmail.com', now);
    insertTask.run('ankit_t3', today, 'DBMS', 'ER Modeling, Relationships and Foreign Keys schema design', 45, 'Medium', 0, null, 'Review entity relationship diagrams from Week 4', 'ankit@gmail.com', now);

    db.prepare(`
      INSERT OR IGNORE INTO daily_notes (date, note_text, user_email, created_at)
      VALUES (?, ?, 'ankit@gmail.com', ?)
    `).run(today, 'Ankit Daily Track: Mastered bash shell commands and completed System Command assignment.', now);
  }
} catch (err) {
  console.warn('SQLite (better-sqlite3) unavailable or native addon not compiled. Using in-memory fallback.');
  // Fallback in-memory dummy database
  const memoryStore = { tasks: [], subjects: [], daily_notes: [], users: [] };
  db = {
    prepare: () => ({
      get: () => ({ count: 0 }),
      all: () => [],
      run: () => ({ changes: 0 })
    }),
    exec: () => {},
    transaction: (fn) => fn
  };
}

export default db;
