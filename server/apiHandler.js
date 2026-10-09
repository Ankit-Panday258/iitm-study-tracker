import { authMiddleware } from './auth.js';
import db from './db.js';
import url from 'url';
// Stub mongo for clean MySQL + SQLite operation
const isMongoConnected = () => false;
const getMongoStatus = () => ({ connected: false, message: 'MySQL is active engine' });
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

export function handleApiRequest(req, res, next) {
  return authMiddleware(req, res, () => handleAuthenticatedRequest(req, res, next));
}

function handleAuthenticatedRequest(req, res, next) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (!pathname.startsWith('/api')) {
    return next();
  }

  // Set JSON headers
  res.setHeader('Content-Type', 'application/json');

  const sendJson = (statusCode, data) => {
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  };

  const parseBody = async (callback) => {
    if (req.body) return callback(req.body);
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 100000) throw new Error('Request too large'); }
    return callback(raw ? JSON.parse(raw) : {});
  };

  return (async () => {
    try {
      const useMySQL = isMySQLConnected();
      const useMongo = !useMySQL && isMongoConnected();

      // Extract user context from headers or query
      const userEmail = (
        req.headers['x-user-email'] ||
        parsedUrl.query.user_email ||
        'default'
      ).toLowerCase().trim();

      // 0. GET /api/db-status
      if (method === 'GET' && pathname === '/api/db-status') {
        const mysqlStatus = getMySQLStatus();
        const mongoStatus = getMongoStatus();
        let active = 'SQLite';
        if (useMySQL) active = 'MySQL';
        else if (useMongo) active = 'MongoDB';

        return sendJson(200, {
          activeDatabase: active,
          mysql: mysqlStatus,
          mongo: mongoStatus
        });
      }

      // 1. GET /api/tasks
      if (method === 'GET' && pathname === '/api/tasks') {
        const date = parsedUrl.query.date;
        const allUsers = parsedUrl.query.all_users === 'true';

        if (useMySQL) {
          try {
            const mysqlTasks = allUsers ? await mySQLGetAllTasks() : await mySQLGetTasks(date, userEmail);
            return sendJson(200, mysqlTasks);
          } catch (e) {
            console.error('MySQL GET /api/tasks failed, falling back:', e.message);
            throw e;
          }
        }

        if (useMongo) {
          const query = {};
          if (date) query.date = date;
          if (!allUsers) query.userEmail = userEmail;
          const mongoTasks = await Task.find(query).sort({ createdAt: -1 });
          const formatted = mongoTasks.map(t => ({
            id: t.id,
            date: t.date,
            subject: t.subject,
            topic: t.topic,
            durationHours: t.durationHours || 0,
            durationMinutes: t.durationMinutes || 0,
            durationSeconds: t.durationSeconds || 0,
            priority: t.priority,
            completed: t.completed === true,
            completedAt: t.completedAt,
            notes: t.notes || '',
            userEmail: t.userEmail || userEmail,
            createdAt: t.createdAt
          }));
          return sendJson(200, formatted);
        }

        // SQLite fallback
        let rows;
        if (allUsers) {
          rows = db.prepare('SELECT * FROM tasks ORDER BY date DESC, created_at DESC').all();
        } else if (date) {
          rows = db.prepare('SELECT * FROM tasks WHERE user_email = ? AND date = ? ORDER BY created_at DESC').all(userEmail, date);
        } else {
          rows = db.prepare('SELECT * FROM tasks WHERE user_email = ? ORDER BY date DESC, created_at DESC').all(userEmail);
        }
        const formatted = rows.map(t => ({
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
        return sendJson(200, formatted);
      }

      // 2. POST /api/tasks
      if (method === 'POST' && pathname === '/api/tasks') {
        return await parseBody(async (body) => {
          const { id, date, subject, topic, durationHours, durationMinutes, durationSeconds, priority, notes } = body;
          const taskId = id || Date.now().toString();
          const now = new Date().toISOString();
          const taskUser = userEmail;

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
            userEmail: taskUser,
            createdAt: now
          };

          // Try MySQL first
          let createdResult = null;
          if (useMySQL) {
            try {
              createdResult = await mySQLCreateTask(taskData);
            } catch (e) {
              console.error('MySQL create task failed:', e.message);
            throw e;
            }
          }

          if (useMongo) {
            try {
              await Task.findOneAndUpdate({ id: taskId }, taskData, { upsert: true, new: true });
            } catch (e) { if (!useMySQL) throw e; }
          }

          // Mirror SQLite
          try {
            db.prepare(`
              INSERT OR REPLACE INTO tasks (id, date, subject, topic, duration_hours, duration_minutes, duration_seconds, priority, completed, completed_at, notes, user_email, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, ?, ?)
            `).run(
              taskId, taskData.date, taskData.subject, taskData.topic, 
              taskData.durationHours, taskData.durationMinutes, taskData.durationSeconds, 
              taskData.priority, taskData.notes, taskUser, now
            );
          } catch (e) { if (!useMySQL) throw e; }

          return sendJson(201, createdResult || taskData);
        });
      }

      // 3. PATCH /api/tasks/:id/toggle
      if (method === 'PATCH' && pathname.startsWith('/api/tasks/') && pathname.endsWith('/toggle')) {
        const parts = pathname.split('/');
        const taskId = parts[3];
        const now = new Date().toISOString();

        if (useMySQL) {
          try {
            const updated = await mySQLToggleTask(taskId);
            if (updated) {
              try {
                db.prepare('UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?')
                  .run(updated.completed ? 1 : 0, updated.completedAt, now, taskId);
              } catch (e) { if (!useMySQL) throw e; }
              return sendJson(200, updated);
            }
          } catch (e) {
            console.error('MySQL toggle task failed:', e.message);
            throw e;
          }
        }

        // SQLite
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
        if (!task) return sendJson(404, { error: 'Task not found' });

        const newCompleted = task.completed === 1 ? 0 : 1;
        const completedAt = newCompleted === 1 ? now : null;

        db.prepare(`
          UPDATE tasks SET completed = ?, completed_at = ?, updated_at = ? WHERE id = ?
        `).run(newCompleted, completedAt, now, taskId);

        const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
        return sendJson(200, {
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
      }

      // 4. PUT /api/tasks/:id
      if (method === 'PUT' && pathname.startsWith('/api/tasks/')) {
        const parts = pathname.split('/');
        const taskId = parts[3];
        return await parseBody(async (body) => {
          const { date, subject, topic, durationHours, durationMinutes, durationSeconds, priority, completed, completedAt, notes } = body;
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

          if (useMySQL) {
            try {
              const updated = await mySQLUpdateTask(taskId, updateFields);
              if (updated) {
                try {
                  db.prepare(`
                    UPDATE tasks
                    SET date = ?, subject = ?, topic = ?, duration_hours = ?, duration_minutes = ?, duration_seconds = ?, priority = ?,
                        completed = ?, completed_at = ?, notes = ?, updated_at = ?
                    WHERE id = ?
                  `).run(
                    date, subject, topic, updateFields.durationHours, updateFields.durationMinutes, updateFields.durationSeconds,
                    updateFields.priority, updateFields.completed ? 1 : 0, updateFields.completedAt, updateFields.notes, now, taskId
                  );
                } catch (e) { if (!useMySQL) throw e; }
                return sendJson(200, updated);
              }
            } catch (e) {
              console.error('MySQL update task failed:', e.message);
            throw e;
            }
          }

          // SQLite
          db.prepare(`
            UPDATE tasks
            SET date = ?, subject = ?, topic = ?, duration_hours = ?, duration_minutes = ?, duration_seconds = ?, priority = ?,
                completed = ?, completed_at = ?, notes = ?, updated_at = ?
            WHERE id = ?
          `).run(
            date, subject, topic, 
            updateFields.durationHours, updateFields.durationMinutes, updateFields.durationSeconds, 
            updateFields.priority,
            completed ? 1 : 0, completedAt || null, notes || '', now, taskId
          );

          const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
          if (!task) return sendJson(404, { error: 'Task not found' });

          return sendJson(200, {
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
        });
      }

      // 5. DELETE /api/tasks/:id
      if (method === 'DELETE' && pathname.startsWith('/api/tasks/')) {
        const parts = pathname.split('/');
        const taskId = parts[3];

        if (useMySQL) {
          try {
            await mySQLDeleteTask(taskId);
          } catch (e) {
            console.error('MySQL delete task failed:', e.message);
            throw e;
          }
        }
        try {
          db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
        } catch (e) { if (!useMySQL) throw e; }

        return sendJson(200, { success: true, id: taskId });
      }

      // 6. GET /api/daily-track
      if (method === 'GET' && pathname === '/api/daily-track') {
        if (useMySQL) {
          try {
            const track = await mySQLGetDailyTrack(userEmail);
            const trackWithNotes = await Promise.all(track.map(async item => {
              const note = await mySQLGetNote(item.date, userEmail);
              return {
                ...item,
                dailyNote: note ? note.noteText : ''
              };
            }));
            return sendJson(200, trackWithNotes);
          } catch (e) {
            console.error('MySQL GET /api/daily-track failed:', e.message);
            throw e;
          }
        }

        // SQLite
        const rows = db.prepare(`
          SELECT date, subject, topic, duration_hours, duration_minutes, duration_seconds, completed_at, notes, priority
          FROM tasks
          WHERE completed = 1 AND user_email = ?
          ORDER BY date DESC, completed_at DESC
        `).all(userEmail);

        const grouped = {};
        for (const row of rows) {
          const d = row.date;
          if (!grouped[d]) grouped[d] = [];
          grouped[d].push({
            subject: row.subject,
            topic: row.topic,
            durationHours: row.duration_hours || 0,
            durationMinutes: row.duration_minutes || 0,
            durationSeconds: row.duration_seconds || 0,
            completedAt: row.completed_at,
            notes: row.notes || '',
            priority: row.priority || 'Medium'
          });
        }

        const result = Object.entries(grouped).map(([date, tList]) => {
          const noteRow = db.prepare('SELECT note_text FROM daily_notes WHERE date = ? AND user_email = ?').get(date, userEmail);
          return {
            date,
            totalMinutes: tList.reduce((acc, t) => acc + (t.durationHours * 60) + t.durationMinutes + (t.durationSeconds / 60), 0),
            completedCount: tList.length,
            tasks: tList,
            dailyNote: noteRow ? noteRow.note_text : ''
          };
        }).sort((a, b) => b.date.localeCompare(a.date));

        return sendJson(200, result);
      }

      // 7. GET /api/notes/:date
      if (method === 'GET' && pathname.startsWith('/api/notes/')) {
        const date = pathname.replace('/api/notes/', '');
        if (useMySQL) {
          try {
            const note = await mySQLGetNote(date, userEmail);
            return sendJson(200, note);
          } catch (e) {
            console.error('MySQL GET note failed:', e.message);
            throw e;
          }
        }
        
        // SQLite
        const note = db.prepare('SELECT * FROM daily_notes WHERE date = ? AND user_email = ?').get(date, userEmail);
        return sendJson(200, note ? { date: note.date, noteText: note.note_text } : { date, noteText: '' });
      }

      // 8. PUT /api/notes/:date
      if (method === 'PUT' && pathname.startsWith('/api/notes/')) {
        const date = pathname.replace('/api/notes/', '');
        return await parseBody(async (body) => {
          const { noteText } = body;
          const noteUser = userEmail;
          const now = new Date().toISOString();

          if (useMySQL) {
            try {
              await mySQLSaveNote(date, noteText, noteUser);
            } catch (e) {
              console.error('MySQL save note failed:', e.message);
            throw e;
            }
          }

          // SQLite
          try {
            const existing = db.prepare('SELECT id FROM daily_notes WHERE date = ? AND user_email = ?').get(date, noteUser);
            if (existing) {
              db.prepare('UPDATE daily_notes SET note_text = ?, updated_at = ? WHERE date = ? AND user_email = ?').run(noteText || '', now, date, noteUser);
            } else {
              db.prepare('INSERT INTO daily_notes (date, note_text, user_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').run(date, noteText || '', noteUser, now, now);
            }
          } catch (e) { if (!useMySQL) throw e; }

          return sendJson(200, { date, noteText: noteText || '', userEmail: noteUser });
        });
      }

      // 9. GET /api/stats/streak
      if (method === 'GET' && pathname === '/api/stats/streak') {
        if (useMySQL) {
          try {
            const streak = await mySQLGetStreak(userEmail);
            return sendJson(200, { streak });
          } catch (e) {
            console.error('MySQL streak failed:', e.message);
            throw e;
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

        return sendJson(200, { streak });
      }

      // 10. GET /api/subjects
      if (method === 'GET' && pathname === '/api/subjects') {
        if (useMySQL) {
          try {
            const subs = await mySQLGetSubjects();
            if (subs && subs.length > 0) {
              return sendJson(200, subs);
            }
          } catch (e) {
            console.error('MySQL GET subjects failed:', e.message);
            throw e;
          }
        }

        const rows = db.prepare('SELECT * FROM subjects ORDER BY created_at ASC').all();
        return sendJson(200, rows);
      }

      // 11. POST /api/subjects
      if (method === 'POST' && pathname === '/api/subjects') {
        return await parseBody(async (body) => {
          const { name, icon, color } = body;
          if (!name || !name.trim()) {
            return sendJson(400, { error: 'Subject name is required' });
          }
          const id = 'sub_' + Date.now();
          const subName = name.trim();
          const subIcon = icon || '📚';
          const subColor = color || 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700';

          if (useMySQL) {
            try {
              await mySQLCreateSubject({ id, name: subName, icon: subIcon, color: subColor });
            } catch (e) {
              console.error('MySQL create subject failed:', e.message);
            throw e;
            }
          }

          try {
            db.prepare('INSERT OR IGNORE INTO subjects (id, name, icon, color) VALUES (?, ?, ?, ?)').run(id, subName, subIcon, subColor);
          } catch (e) { if (!useMySQL) throw e; }

          return sendJson(201, { id, name: subName, icon: subIcon, color: subColor });
        });
      }

      return sendJson(404, { error: 'Not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(503, { error: 'Changes could not be saved. Please check the database connection.' });
    }
  })();
}
