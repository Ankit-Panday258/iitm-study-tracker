import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  initMySQL,
  isMySQLConnected,
  getMySQLStatus,
  mySQLGetTasks,
  mySQLGetAllTasks,
  mySQLCreateTask,
  mySQLUpdateTask,
  mySQLToggleTask,
  mySQLDeleteTask,
  mySQLGetDailyTrack,
  mySQLGetNote,
  mySQLSaveNote,
  mySQLGetStreak,
  mySQLGetSubjects,
  mySQLCreateSubject,
  mySQLLoginUser,
  mySQLRegisterUser,
  mySQLLoginWithPassword,
  mySQLGetUsers
} from './mysql.js';
import { hashPassword, verifyPassword } from './authUtils.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize MySQL
initMySQL().catch(err => console.log('MySQL init:', err.message));

// Helper to get active userEmail
function getUserEmail(req) {
  return (
    req.headers['x-user-email'] ||
    req.query.user_email ||
    (req.body && req.body.userEmail) ||
    'default'
  ).toLowerCase().trim();
}

// DB Status API
app.get('/api/db-status', (req, res) => {
  const mysqlStatus = getMySQLStatus();
  res.json({
    activeDatabase: isMySQLConnected() ? 'MySQL' : 'SQLite',
    mysql: mysqlStatus
  });
});

// ─── TASKS API ───────────────────────────────────────────────

// GET tasks (scoped to user)
app.get('/api/tasks', async (req, res) => {
  try {
    const { date, all_users } = req.query;
    const userEmail = getUserEmail(req);
    const allUsers = all_users === 'true';

    if (isMySQLConnected()) {
      try {
        const mysqlTasks = allUsers ? await mySQLGetAllTasks() : await mySQLGetTasks(date, userEmail);
        return res.json(mysqlTasks);
      } catch (e) {
        console.error('MySQL GET tasks error:', e.message);
      }
    }

    // SQLite fallback
    let tasks;
    if (allUsers) {
      tasks = db.prepare('SELECT * FROM tasks ORDER BY date DESC, created_at DESC').all();
    } else if (date) {
      tasks = db.prepare('SELECT * FROM tasks WHERE user_email = ? AND date = ? ORDER BY created_at DESC').all(userEmail, date);
    } else {
      tasks = db.prepare('SELECT * FROM tasks WHERE user_email = ? ORDER BY date DESC, created_at DESC').all(userEmail);
    }

    const formatted = tasks.map(t => ({
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
      notes: t.notes,
      userEmail: t.user_email || userEmail,
      createdAt: t.created_at
    }));
    res.json(formatted);
  } catch (err) {
    console.error('GET /api/tasks error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { id, date, subject, topic, durationHours, durationMinutes, durationSeconds, priority, notes } = req.body;
    const userEmail = getUserEmail(req);
    const taskId = id || Date.now().toString();
    const now = new Date().toISOString();

    const taskData = {
      id: taskId,
      date: date || now.split('T')[0],
      subject: subject || 'MAD 1 Project',
      topic: topic || 'New Topic',
      durationHours: Number(durationHours) || 0,
      durationMinutes: Number(durationMinutes) || 0,
      durationSeconds: Number(durationSeconds) || 0,
      priority: priority || 'Medium',
      completed: false,
      completedAt: null,
      notes: notes || '',
      userEmail,
      createdAt: now
    };

    let result = null;
    if (isMySQLConnected()) {
      try {
        result = await mySQLCreateTask(taskData);
      } catch (e) {
        console.error('MySQL create task error:', e.message);
      }
    }

    // Mirror in SQLite
    try {
      db.prepare(`
        INSERT OR REPLACE INTO tasks (id, date, subject, topic, duration_hours, duration_minutes, duration_seconds, priority, completed, completed_at, notes, user_email, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?, ?)
      `).run(
        taskId, taskData.date, taskData.subject, taskData.topic,
        taskData.durationHours, taskData.durationMinutes, taskData.durationSeconds,
        taskData.priority, taskData.notes, userEmail, now
      );
    } catch (e) {}

    res.status(201).json(result || taskData);
  } catch (err) {
    console.error('POST /api/tasks error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, subject, topic, durationHours, durationMinutes, durationSeconds, priority, completed, completedAt, notes } = req.body;
    const now = new Date().toISOString();

    const updateFields = {
      date, subject, topic,
      durationHours: Number(durationHours) || 0,
      durationMinutes: Number(durationMinutes) || 0,
      durationSeconds: Number(durationSeconds) || 0,
      priority: priority || 'Medium',
      completed: Boolean(completed),
      completedAt: completedAt || null,
      notes: notes || ''
    };

    if (isMySQLConnected()) {
      try {
        const updated = await mySQLUpdateTask(id, updateFields);
        if (updated) {
          try {
            db.prepare(`
              UPDATE tasks
              SET date = ?, subject = ?, topic = ?, duration_hours = ?, duration_minutes = ?, duration_seconds = ?, priority = ?,
                  completed = ?, completed_at = ?, notes = ?, updated_at = ?
              WHERE id = ?
            `).run(
              date, subject, topic, updateFields.durationHours, updateFields.durationMinutes, updateFields.durationSeconds,
              updateFields.priority, updateFields.completed ? 1 : 0, updateFields.completedAt, updateFields.notes, now, id
            );
          } catch (e) {}
          return res.json(updated);
        }
      } catch (e) {
        console.error('MySQL update task error:', e.message);
      }
    }

    db.prepare(`
      UPDATE tasks
      SET date = ?, subject = ?, topic = ?, duration_hours = ?, duration_minutes = ?, duration_seconds = ?, priority = ?,
          completed = ?, completed_at = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `).run(
      date, subject, topic, updateFields.durationHours, updateFields.durationMinutes, updateFields.durationSeconds,
      updateFields.priority, updateFields.completed ? 1 : 0, updateFields.completedAt, updateFields.notes, now, id
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({
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
      notes: task.notes,
      userEmail: task.user_email,
      createdAt: task.created_at
    });
  } catch (err) {
    console.error('PUT /api/tasks/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle task completion
app.patch('/api/tasks/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date().toISOString();

    if (isMySQLConnected()) {
      try {
        const updated = await mySQLToggleTask(id);
        if (updated) {
          try {
            db.prepare('UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?')
              .run(updated.completed ? 1 : 0, updated.completedAt, now, id);
          } catch (e) {}
          return res.json(updated);
        }
      } catch (e) {
        console.error('MySQL toggle task error:', e.message);
      }
    }

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newCompleted = task.completed === 1 ? 0 : 1;
    const completedAt = newCompleted === 1 ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?
    `).run(newCompleted, completedAt, now, id);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json({
      id: updated.id,
      date: updated.date,
      subject: updated.subject,
      topic: updated.topic,
      durationHours: updated.duration_hours || 0,
      durationMinutes: updated.duration_minutes || 0,
      durationSeconds: updated.duration_seconds || 0,
      priority: updated.priority,
      completed: updated.completed === 1,
      completedAt: updated.completed_at,
      notes: updated.notes,
      userEmail: updated.user_email,
      createdAt: updated.created_at
    });
  } catch (err) {
    console.error('PATCH /api/tasks/:id/toggle error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMySQLConnected()) {
      try {
        await mySQLDeleteTask(id);
      } catch (e) {
        console.error('MySQL delete task error:', e.message);
      }
    }

    try {
      db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    } catch (e) {}

    res.json({ success: true, id });
  } catch (err) {
    console.error('DELETE /api/tasks/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DAILY TRACK API ─────────────────────────────────────────

app.get('/api/daily-track', async (req, res) => {
  try {
    const userEmail = getUserEmail(req);

    if (isMySQLConnected()) {
      try {
        const track = await mySQLGetDailyTrack(userEmail);
        const trackWithNotes = await Promise.all(track.map(async item => {
          const note = await mySQLGetNote(item.date, userEmail);
          return {
            ...item,
            dailyNote: note ? note.noteText : ''
          };
        }));
        return res.json(trackWithNotes);
      } catch (e) {
        console.error('MySQL daily-track error:', e.message);
      }
    }

    const rows = db.prepare(`
      SELECT date, subject, topic, duration_hours, duration_minutes, duration_seconds, completed_at, notes, priority, user_email
      FROM tasks
      WHERE completed = 1 AND user_email = ?
      ORDER BY date DESC, completed_at DESC
    `).all(userEmail);

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.date]) grouped[row.date] = [];
      grouped[row.date].push({
        subject: row.subject,
        topic: row.topic,
        durationHours: row.duration_hours || 0,
        durationMinutes: row.duration_minutes || 0,
        durationSeconds: row.duration_seconds || 0,
        completedAt: row.completed_at,
        notes: row.notes,
        priority: row.priority,
        userEmail: row.user_email
      });
    }

    const result = Object.entries(grouped).map(([date, tasks]) => {
      const noteRow = db.prepare('SELECT note_text FROM daily_notes WHERE date = ? AND user_email = ?').get(date, userEmail);
      return {
        date,
        totalMinutes: tasks.reduce((acc, t) => acc + (t.durationHours * 60) + t.durationMinutes + (t.durationSeconds / 60), 0),
        completedCount: tasks.length,
        tasks,
        dailyNote: noteRow ? noteRow.note_text : ''
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    res.json(result);
  } catch (err) {
    console.error('GET /api/daily-track error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DAILY NOTES API ─────────────────────────────────────────

app.get('/api/notes/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const userEmail = getUserEmail(req);

    if (isMySQLConnected()) {
      try {
        const note = await mySQLGetNote(date, userEmail);
        return res.json(note);
      } catch (e) {
        console.error('MySQL GET note error:', e.message);
      }
    }

    const note = db.prepare('SELECT * FROM daily_notes WHERE date = ? AND user_email = ?').get(date, userEmail);
    res.json(note ? { date: note.date, noteText: note.note_text } : { date, noteText: '' });
  } catch (err) {
    console.error('GET /api/notes/:date error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/notes/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { noteText } = req.body;
    const userEmail = getUserEmail(req);
    const now = new Date().toISOString();

    if (isMySQLConnected()) {
      try {
        await mySQLSaveNote(date, noteText, userEmail);
      } catch (e) {
        console.error('MySQL save note error:', e.message);
      }
    }

    try {
      const existing = db.prepare('SELECT id FROM daily_notes WHERE date = ? AND user_email = ?').get(date, userEmail);
      if (existing) {
        db.prepare('UPDATE daily_notes SET note_text = ?, updated_at = ? WHERE date = ? AND user_email = ?').run(noteText || '', now, date, userEmail);
      } else {
        db.prepare('INSERT INTO daily_notes (date, note_text, user_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(date, noteText || '', userEmail, now, now);
      }
    } catch (e) {}

    res.json({ date, noteText: noteText || '', userEmail });
  } catch (err) {
    console.error('PUT /api/notes/:date error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS API ───────────────────────────────────────────────

app.get('/api/stats/streak', async (req, res) => {
  try {
    const userEmail = getUserEmail(req);

    if (isMySQLConnected()) {
      try {
        const streak = await mySQLGetStreak(userEmail);
        return res.json({ streak });
      } catch (e) {
        console.error('MySQL streak error:', e.message);
      }
    }

    const dates = db.prepare(`
      SELECT DISTINCT date FROM tasks WHERE completed = 1 AND user_email = ? ORDER BY date DESC
    `).all(userEmail).map(r => r.date);

    const dateSet = new Set(dates);
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

    res.json({ streak });
  } catch (err) {
    console.error('GET /api/stats/streak error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── SUBJECTS API ────────────────────────────────────────────

app.get('/api/subjects', async (req, res) => {
  try {
    if (isMySQLConnected()) {
      try {
        const subs = await mySQLGetSubjects();
        if (subs && subs.length > 0) return res.json(subs);
      } catch (e) {
        console.error('MySQL GET subjects error:', e.message);
      }
    }

    const rows = db.prepare('SELECT * FROM subjects ORDER BY created_at ASC').all();
    res.json(rows);
  } catch (err) {
    console.error('GET /api/subjects error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Subject name is required' });

    const id = 'sub_' + Date.now();
    const subName = name.trim();
    const subIcon = icon || '📚';
    const subColor = color || 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700';

    if (isMySQLConnected()) {
      try {
        await mySQLCreateSubject({ id, name: subName, icon: subIcon, color: subColor });
      } catch (e) {
        console.error('MySQL create subject error:', e.message);
      }
    }

    try {
      db.prepare('INSERT OR IGNORE INTO subjects (id, name, icon, color) VALUES (?, ?, ?, ?)').run(id, subName, subIcon, subColor);
    } catch (e) {}

    res.status(201).json({ id, name: subName, icon: subIcon, color: subColor });
  } catch (err) {
    console.error('POST /api/subjects error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── USERS & AUTH API ────────────────────────────────────────

// GET all registered users
app.get('/api/users', async (req, res) => {
  try {
    if (isMySQLConnected()) {
      try {
        const users = await mySQLGetUsers();
        return res.json(users);
      } catch (e) {
        console.error('MySQL GET users error:', e.message);
      }
    }

    const rows = db.prepare('SELECT id, email, name, picture, auth_provider, created_at FROM users ORDER BY created_at DESC').all();
    res.json(rows.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      picture: u.picture,
      authProvider: u.auth_provider,
      createdAt: u.created_at
    })));
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !email.trim()) return res.status(400).json({ error: 'Valid email is required.' });
    if (!password || password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters long.' });

    const cleanEmail = email.toLowerCase().trim();
    const userName = (name || cleanEmail.split('@')[0]).trim();
    const userId = 'usr_' + Date.now();
    const userPic = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    if (isMySQLConnected()) {
      try {
        const newUser = await mySQLRegisterUser({ email: cleanEmail, password, name: userName, picture: userPic });

        try {
          db.prepare(`
            INSERT INTO users (id, email, name, picture, password_hash, auth_provider, created_at)
            VALUES (?, ?, ?, ?, ?, 'email', ?)
            ON CONFLICT(email) DO UPDATE SET name = ?, picture = ?, password_hash = ?
          `).run(newUser.id, cleanEmail, userName, userPic, passwordHash, now, userName, userPic, passwordHash);
        } catch (e) {}

        return res.status(201).json({ success: true, user: newUser });
      } catch (err) {
        return res.status(err.status || 400).json({ error: err.message });
      }
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'User already exists with this email. Please sign in.' });
    }

    db.prepare(`
      INSERT INTO users (id, email, name, picture, password_hash, auth_provider, created_at)
      VALUES (?, ?, ?, ?, ?, 'email', ?)
    `).run(userId, cleanEmail, userName, userPic, passwordHash, now);

    res.status(201).json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: userName,
        picture: userPic,
        authProvider: 'email',
        createdAt: now
      }
    });
  } catch (err) {
    console.error('POST /api/auth/register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST login with password or email
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !email.trim()) return res.status(400).json({ error: 'Email is required.' });

    const cleanEmail = email.toLowerCase().trim();

    if (password) {
      if (isMySQLConnected()) {
        try {
          const loggedInUser = await mySQLLoginWithPassword({ email: cleanEmail, password });
          return res.json({ success: true, user: loggedInUser });
        } catch (err) {
          return res.status(err.status || 401).json({ error: err.message });
        }
      }

      const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
      if (!userRow) return res.status(404).json({ error: 'User not found. Please register first.' });
      if (!userRow.password_hash) return res.status(400).json({ error: 'This account was created with Google Sign-In. Please use Google Login.' });
      if (!verifyPassword(password, userRow.password_hash)) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      return res.json({
        success: true,
        user: {
          id: userRow.id,
          email: userRow.email,
          name: userRow.name,
          picture: userRow.picture,
          authProvider: userRow.auth_provider,
          createdAt: userRow.created_at
        }
      });
    }

    // Guest / 1-click fallback
    const id = 'usr_' + Date.now();
    const userName = name || cleanEmail.split('@')[0];
    const now = new Date().toISOString();
    let userDoc = {
      id,
      email: cleanEmail,
      name: userName,
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
      authProvider: 'email',
      createdAt: now
    };

    if (isMySQLConnected()) {
      try {
        const saved = await mySQLLoginUser(userDoc);
        if (saved) userDoc = saved;
      } catch (e) {}
    }

    try {
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, name, picture, auth_provider, created_at)
        VALUES (?, ?, ?, ?, 'email', ?)
      `).run(id, cleanEmail, userName, userDoc.picture, now);
    } catch (e) {}

    res.json({ success: true, user: userDoc });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Google OAuth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const id = googleId || 'user_' + Date.now();
    const userName = name || email.split('@')[0];
    const userPic = picture || '';
    const now = new Date().toISOString();

    let userDoc = {
      id,
      email: email.toLowerCase().trim(),
      name: userName,
      picture: userPic,
      googleId: googleId || id,
      authProvider: 'google',
      createdAt: now
    };

    if (isMySQLConnected()) {
      try {
        const savedUser = await mySQLLoginUser(userDoc);
        if (savedUser) userDoc = savedUser;
      } catch (e) {
        console.error('MySQL login google user error:', e.message);
      }
    }

    try {
      db.prepare(`
        INSERT INTO users (id, email, name, picture, google_id, auth_provider, created_at)
        VALUES (?, ?, ?, ?, ?, 'google', ?)
        ON CONFLICT(email) DO UPDATE SET name = ?, picture = ?, google_id = ?
      `).run(id, userDoc.email, userName, userPic, googleId || id, now, userName, userPic, googleId || id);
    } catch (e) {}

    res.json({ success: true, user: userDoc });
  } catch (err) {
    console.error('POST /api/auth/google error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend from dist in production / fallback
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
    if (err) next();
  });
});

// ─── START SERVER ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`🐬 MySQL status: ${isMySQLConnected() ? 'CONNECTED' : 'STANDBY/FALLBACK'}`);
  console.log(`📦 SQLite database ready as fallback`);
});
