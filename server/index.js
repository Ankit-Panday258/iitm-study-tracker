import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── TASKS API ───────────────────────────────────────────────

// GET all tasks (optionally filter by date)
app.get('/api/tasks', (req, res) => {
  try {
    const { date } = req.query;
    let tasks;
    if (date) {
      tasks = db.prepare('SELECT * FROM tasks WHERE date = ? ORDER BY created_at DESC').all(date);
    } else {
      tasks = db.prepare('SELECT * FROM tasks ORDER BY date DESC, created_at DESC').all();
    }
    // Convert completed from 0/1 to boolean
    const formatted = tasks.map(t => ({
      id: t.id,
      date: t.date,
      subject: t.subject,
      topic: t.topic,
      durationMinutes: t.duration_minutes,
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
app.post('/api/tasks', (req, res) => {
  try {
    const { id, date, subject, topic, durationMinutes, priority, notes } = req.body;
    const taskId = id || Date.now().toString();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO tasks (id, date, subject, topic, duration_minutes, priority, completed, completed_at, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, NULL, ?, ?)
    `).run(taskId, date, subject, topic, durationMinutes || 45, priority || 'Medium', notes || '', now);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    res.status(201).json({
      id: task.id,
      date: task.date,
      subject: task.subject,
      topic: task.topic,
      durationMinutes: task.duration_minutes,
      priority: task.priority,
      completed: task.completed === 1,
      completedAt: task.completed_at,
      notes: task.notes,
      createdAt: task.created_at
    });
  } catch (err) {
    console.error('POST /api/tasks error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update a task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { date, subject, topic, durationMinutes, priority, completed, completedAt, notes } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE tasks
      SET date = ?, subject = ?, topic = ?, duration_minutes = ?, priority = ?,
          completed = ?, completed_at = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `).run(
      date, subject, topic, durationMinutes || 45, priority || 'Medium',
      completed ? 1 : 0, completedAt || null, notes || '', now, id
    );

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({
      id: task.id,
      date: task.date,
      subject: task.subject,
      topic: task.topic,
      durationMinutes: task.duration_minutes,
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
app.patch('/api/tasks/:id/toggle', (req, res) => {
  try {
    const { id } = req.params;
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newCompleted = task.completed === 1 ? 0 : 1;
    const completedAt = newCompleted === 1 ? new Date().toISOString() : null;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?
    `).run(newCompleted, completedAt, now, id);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json({
      id: updated.id,
      date: updated.date,
      subject: updated.subject,
      topic: updated.topic,
      durationMinutes: updated.duration_minutes,
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
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true, id });
  } catch (err) {
    console.error('DELETE /api/tasks/:id error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DAILY TRACK API ─────────────────────────────────────────

// GET completed tasks grouped by date (for Daily Track sticker view)
app.get('/api/daily-track', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT date, subject, topic, duration_minutes, completed_at, notes, priority
      FROM tasks
      WHERE completed = 1
      ORDER BY date DESC, completed_at DESC
    `).all();

    // Group by date
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

    // Convert to array sorted by date desc
    const result = Object.entries(grouped).map(([date, tasks]) => ({
      date,
      totalMinutes: tasks.reduce((acc, t) => acc + t.durationMinutes, 0),
      completedCount: tasks.length,
      tasks
    })).sort((a, b) => b.date.localeCompare(a.date));

    res.json(result);
  } catch (err) {
    console.error('GET /api/daily-track error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── DAILY NOTES API ─────────────────────────────────────────

// GET note for a specific date
app.get('/api/notes/:date', (req, res) => {
  try {
    const { date } = req.params;
    const note = db.prepare('SELECT * FROM daily_notes WHERE date = ?').get(date);
    res.json(note ? { date: note.date, noteText: note.note_text } : { date, noteText: '' });
  } catch (err) {
    console.error('GET /api/notes/:date error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT save/update note for a date
app.put('/api/notes/:date', (req, res) => {
  try {
    const { date } = req.params;
    const { noteText } = req.body;
    const now = new Date().toISOString();

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

// GET all notes
app.get('/api/notes', (req, res) => {
  try {
    const notes = db.prepare('SELECT * FROM daily_notes ORDER BY date DESC').all();
    const result = {};
    for (const n of notes) {
      result[n.date] = n.note_text;
    }
    res.json(result);
  } catch (err) {
    console.error('GET /api/notes error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS API ───────────────────────────────────────────────

// GET streak info
app.get('/api/stats/streak', (req, res) => {
  try {
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

// ─── START SERVER ────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📦 SQLite database ready`);
});
