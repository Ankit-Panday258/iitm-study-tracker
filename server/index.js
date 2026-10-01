import express from 'express';
import cors from 'cors';
import db from './db.js';
import {
  initMySQL,
  isMySQLConnected,
  getMySQLStatus,
  mySQLGetTasks,
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
  mySQLLoginUser
} from './mysql.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize MySQL
initMySQL().catch(err => console.log('MySQL init:', err.message));

// DB Status API
app.get('/api/db-status', (req, res) => {
  const mysqlStatus = getMySQLStatus();
  res.json({
    activeDatabase: isMySQLConnected() ? 'MySQL' : 'SQLite',
    mysql: mysqlStatus
  });
});

// ─── TASKS API ───────────────────────────────────────────────

// GET all tasks (optionally filter by date)
app.get('/api/tasks', async (req, res) => {
  try {
    const { date } = req.query;

    if (isMySQLConnected()) {
      try {
        const mysqlTasks = await mySQLGetTasks(date);
        return res.json(mysqlTasks);
      } catch (e) {
        console.error('MySQL GET tasks error:', e.message);
      }
    }

    // SQLite fallback
    let tasks;
    if (date) {
      tasks = db.prepare('SELECT * FROM tasks WHERE date = ? ORDER BY created_at DESC').all(date);
    } else {
      tasks = db.prepare('SELECT * FROM tasks ORDER BY date DESC, created_at DESC').all();
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
        INSERT OR REPLACE INTO tasks (id, date, subject, topic, duration_hours, duration_minutes, duration_seconds, priority, completed, completed_at, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)
      `).run(
        taskId, taskData.date, taskData.subject, taskData.topic,
        taskData.durationHours, taskData.durationMinutes, taskData.durationSeconds,
        taskData.priority, taskData.notes, now
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
    if (isMySQLConnected()) {
      try {
        const track = await mySQLGetDailyTrack();
        const trackWithNotes = await Promise.all(track.map(async item => {
          const note = await mySQLGetNote(item.date);
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
      SELECT date, subject, topic, duration_hours, duration_minutes, duration_seconds, completed_at, notes, priority
      FROM tasks
      WHERE completed = 1
      ORDER BY date DESC, completed_at DESC
    `).all();

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
        priority: row.priority
      });
    }

    const result = Object.entries(grouped).map(([date, tasks]) => {
      const noteRow = db.prepare('SELECT note_text FROM daily_notes WHERE date = ?').get(date);
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
    if (isMySQLConnected()) {
      try {
        const note = await mySQLGetNote(date);
        return res.json(note);
      } catch (e) {
        console.error('MySQL GET note error:', e.message);
      }
    }

    const note = db.prepare('SELECT * FROM daily_notes WHERE date = ?').get(date);
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
    const now = new Date().toISOString();

    if (isMySQLConnected()) {
      try {
        await mySQLSaveNote(date, noteText);
      } catch (e) {
        console.error('MySQL save note error:', e.message);
      }
    }

    db.prepare(`
      INSERT INTO daily_notes (date, note_text, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET note_text = ?, updated_at = ?
    `).run(date, noteText || '', now, now, noteText || '', now);

    res.json({ date, noteText: noteText || '' });
  } catch (err) {
    console.error('PUT /api/notes/:date error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS API ───────────────────────────────────────────────

app.get('/api/stats/streak', async (req, res) => {
  try {
    if (isMySQLConnected()) {
      try {
        const streak = await mySQLGetStreak();
        return res.json({ streak });
      } catch (e) {
        console.error('MySQL streak error:', e.message);
      }
    }

    const dates = db.prepare(`
      SELECT DISTINCT date FROM tasks WHERE completed = 1 ORDER BY date DESC
    `).all().map(r => r.date);

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

// ─── START SERVER ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`🐬 MySQL status: ${isMySQLConnected() ? 'CONNECTED' : 'STANDBY/FALLBACK'}`);
  console.log(`📦 SQLite database ready as fallback`);
});
