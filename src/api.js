const API_BASE = '/api';

// Local storage backup keys
const BACKUP_TASKS_KEY = 'iitm_tasks_backup';
const BACKUP_NOTES_KEY = 'iitm_notes_backup';
const BACKUP_SUBJECTS_KEY = 'iitm_subjects_backup';

export const DEFAULT_SUBJECTS = [
  { id: 'sub_1', name: 'MAD 1 Project', icon: '💻', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700' },
  { id: 'sub_2', name: 'DBMS', icon: '🗄️', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600' },
  { id: 'sub_3', name: 'System Commands', icon: '⚙️', color: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800' }
];

export const DEFAULT_INITIAL_TASKS = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    subject: 'MAD 1 Project',
    topic: 'Complete Flask routes and Jinja templates for Task Manager',
    durationHours: 1,
    durationMinutes: 30,
    durationSeconds: 0,
    priority: 'High',
    completed: true,
    completedAt: new Date().toISOString(),
    notes: 'Focus on CRUD operations and form validation'
  },
  {
    id: '2',
    date: new Date().toISOString().split('T')[0],
    subject: 'DBMS',
    topic: 'Normalization: 1NF, 2NF, 3NF & BCNF with examples',
    durationHours: 1,
    durationMinutes: 0,
    durationSeconds: 0,
    priority: 'High',
    completed: false,
    completedAt: null,
    notes: 'Solve assignment questions from Week 5'
  },
  {
    id: '3',
    date: new Date().toISOString().split('T')[0],
    subject: 'System Commands',
    topic: 'Shell scripting: loops, conditionals & file processing',
    durationHours: 0,
    durationMinutes: 45,
    durationSeconds: 0,
    priority: 'Medium',
    completed: false,
    completedAt: null,
    notes: 'Practice grep, awk, sed commands'
  },
  {
    id: '4',
    date: new Date().toISOString().split('T')[0],
    subject: 'DBMS',
    topic: 'SQL Joins and Subqueries practice problems',
    durationHours: 0,
    durationMinutes: 45,
    durationSeconds: 0,
    priority: 'Medium',
    completed: true,
    completedAt: new Date().toISOString(),
    notes: 'Completed 10 queries from practice set'
  }
];

function getBackupTasks() {
  try {
    const raw = localStorage.getItem(BACKUP_TASKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_INITIAL_TASKS;
}

function setBackupTasks(tasks) {
  try {
    localStorage.setItem(BACKUP_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {}
}

// Fetch with strict 1500ms timeout so the UI never hangs
async function fetchWithTimeout(url, options = {}, timeout = 1500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, credentials: 'omit', signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Safe JSON parser to handle HTML responses (e.g. Vercel SPA fallbacks) gracefully
async function safeJson(res) {
  if (!res || !res.ok) return null;
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }
  try {
    return await res.json();
  } catch (e) {
    return null;
  }
}

// ─── TASKS ───────────────────────────────────────────────────

export async function fetchTasks(date) {
  try {
    const url = date ? `${API_BASE}/tasks?date=${date}` : `${API_BASE}/tasks`;
    const res = await fetchWithTimeout(url);
    const data = await safeJson(res);
    if (Array.isArray(data) && data.length > 0) {
      setBackupTasks(data);
      return date ? data.filter(t => t.date === date) : data;
    }
  } catch (err) {
    console.warn('Using local cache for tasks:', err.message);
  }

  const backup = getBackupTasks();
  return date ? backup.filter(t => t.date === date) : backup;
}

export async function fetchAllTasks() {
  return fetchTasks();
}

export async function createTask(taskData) {
  const newTask = {
    id: taskData.id || Date.now().toString(),
    date: taskData.date,
    subject: taskData.subject,
    topic: taskData.topic,
    durationHours: Number(taskData.durationHours) || 0,
    durationMinutes: Number(taskData.durationMinutes) || 0,
    durationSeconds: Number(taskData.durationSeconds) || 0,
    priority: taskData.priority || 'Medium',
    completed: false,
    completedAt: null,
    notes: taskData.notes || '',
    createdAt: new Date().toISOString()
  };

  // Immediate local cache update
  const backup = getBackupTasks();
  const updated = [newTask, ...backup.filter(t => t.id !== newTask.id)];
  setBackupTasks(updated);

  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const data = await safeJson(res);
    if (data && data.id) {
      setBackupTasks([data, ...backup.filter(t => t.id !== data.id)]);
      return data;
    }
  } catch (err) {
    console.warn('Local save only for createTask:', err.message);
  }

  return newTask;
}

export async function updateTask(id, taskData) {
  const backup = getBackupTasks();
  const existing = backup.find(t => t.id === id) || {};
  const merged = { ...existing, ...taskData, id };
  setBackupTasks(backup.map(t => t.id === id ? merged : t));

  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged)
    });
    const data = await safeJson(res);
    if (data && data.id) {
      setBackupTasks(backup.map(t => t.id === id ? data : t));
      return data;
    }
  } catch (err) {
    console.warn('Local update only for updateTask:', err.message);
  }

  return merged;
}

export async function toggleTask(id) {
  const backup = getBackupTasks();
  let updatedTask = null;
  const newBackup = backup.map(t => {
    if (t.id === id) {
      updatedTask = {
        ...t,
        completed: !t.completed,
        completedAt: !t.completed ? new Date().toISOString() : null
      };
      return updatedTask;
    }
    return t;
  });
  setBackupTasks(newBackup);

  try {
    const res = await fetchWithTimeout(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH'
    });
    const data = await safeJson(res);
    if (data && data.id) {
      setBackupTasks(backup.map(t => t.id === id ? data : t));
      return data;
    }
  } catch (err) {
    console.warn('Local toggle only for toggleTask:', err.message);
  }

  return updatedTask;
}

export async function deleteTask(id) {
  const backup = getBackupTasks();
  setBackupTasks(backup.filter(t => t.id !== id));

  try {
    await fetchWithTimeout(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  } catch (err) {}

  return { success: true, id };
}

// ─── DAILY TRACK ─────────────────────────────────────────────

export async function fetchDailyTrack() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/daily-track`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {}

  // Fallback to local cache
  const backup = getBackupTasks().filter(t => t.completed);
  const notesRaw = localStorage.getItem(BACKUP_NOTES_KEY);
  const notes = notesRaw ? JSON.parse(notesRaw) : {};

  const grouped = {};
  for (const t of backup) {
    if (!grouped[t.date]) grouped[t.date] = [];
    grouped[t.date].push(t);
  }
  return Object.entries(grouped).map(([date, tasks]) => ({
    date,
    totalMinutes: tasks.reduce((acc, t) => {
      const h = Number(t.durationHours) || 0;
      const m = Number(t.durationMinutes) || 0;
      const s = Number(t.durationSeconds) || 0;
      return acc + (h * 60) + m + (s / 60);
    }, 0),
    completedCount: tasks.length,
    tasks,
    dailyNote: notes[date] || ''
  })).sort((a, b) => b.date.localeCompare(a.date));
}

// ─── NOTES ───────────────────────────────────────────────────

export async function fetchNote(date) {
  const notesRaw = localStorage.getItem(BACKUP_NOTES_KEY);
  const notes = notesRaw ? JSON.parse(notesRaw) : {};

  try {
    const res = await fetchWithTimeout(`${API_BASE}/notes/${date}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.noteText !== undefined) {
        notes[date] = data.noteText;
        localStorage.setItem(BACKUP_NOTES_KEY, JSON.stringify(notes));
        return data;
      }
    }
  } catch (err) {}

  return { date, noteText: notes[date] || '' };
}

export async function saveNote(date, noteText) {
  const notesRaw = localStorage.getItem(BACKUP_NOTES_KEY);
  const notes = notesRaw ? JSON.parse(notesRaw) : {};
  notes[date] = noteText;
  localStorage.setItem(BACKUP_NOTES_KEY, JSON.stringify(notes));

  try {
    await fetchWithTimeout(`${API_BASE}/notes/${date}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteText })
    });
  } catch (err) {}

  return { date, noteText };
}

// ─── STATS ───────────────────────────────────────────────────

export async function fetchStreak() {
  const backup = getBackupTasks().filter(t => t.completed);
  const dates = new Set(backup.map(t => t.date));
  let localStreak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dates.has(dateStr)) {
      localStreak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE}/stats/streak`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.streak === 'number') return data;
    }
  } catch (err) {}

  return { streak: localStreak };
}

// ─── SUBJECTS ────────────────────────────────────────────────

export async function fetchSubjects() {
  const cached = localStorage.getItem(BACKUP_SUBJECTS_KEY);
  const fallback = cached ? JSON.parse(cached) : DEFAULT_SUBJECTS;

  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(BACKUP_SUBJECTS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  return fallback;
}

export async function createSubject({ name, icon, color }) {
  const newSub = {
    id: 'sub_' + Date.now(),
    name: name.trim(),
    icon: icon || '📚',
    color: color || 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700'
  };

  const current = await fetchSubjects();
  const updated = [...current.filter(s => s.name !== newSub.name), newSub];
  localStorage.setItem(BACKUP_SUBJECTS_KEY, JSON.stringify(updated));

  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(BACKUP_SUBJECTS_KEY, JSON.stringify([...current.filter(s => s.name !== data.name), data]));
      return data;
    }
  } catch (e) {}

  return newSub;
}

// ─── AUTHENTICATION (GOOGLE & EMAIL) ─────────────────────────

const USER_STORAGE_KEY = 'iitm_auth_user';

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export async function loginWithGoogle({ email, name, picture, googleId, credential }) {
  const userPayload = {
    email,
    name: name || email.split('@')[0],
    picture: picture || '',
    googleId: googleId || 'google_' + Date.now(),
    credential
  };

  // Immediate local save
  setStoredUser(userPayload);

  try {
    const res = await fetchWithTimeout(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        setStoredUser(data.user);
        return data.user;
      }
    }
  } catch (e) {
    console.warn('Auth API fallback to local user:', e.message);
  }

  return userPayload;
}

export async function registerWithEmail({ email, password, name }) {
  const cleanEmail = email.toLowerCase().trim();
  const userName = (name || cleanEmail.split('@')[0]).trim();

  const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, password, name: userName })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  if (data.user) {
    setStoredUser(data.user);
    return data.user;
  }
  throw new Error('Could not create account');
}

export async function loginWithEmail({ email, password, name }) {
  const cleanEmail = email.toLowerCase().trim();
  const userName = (name || cleanEmail.split('@')[0]).trim();

  const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: cleanEmail, password, name: userName })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  if (data.user) {
    setStoredUser(data.user);
    return data.user;
  }

  const fallbackUser = {
    id: 'user_' + Date.now(),
    email: cleanEmail,
    name: userName,
    picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
    authProvider: 'email'
  };
  setStoredUser(fallbackUser);
  return fallbackUser;
}

export async function fetchUsers() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/users`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Fetch users fallback:', e.message);
  }
  return [];
}

export function logout() {
  setStoredUser(null);
}

export async function fetchDbStatus() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/db-status`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('DB Status check:', e.message);
  }
  return { activeDatabase: 'Local/SQLite' };
}

