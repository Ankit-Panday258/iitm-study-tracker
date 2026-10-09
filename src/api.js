const API_BASE = '/api';

// Local storage backup keys
const BACKUP_TASKS_KEY = 'iitm_tasks_backup';
const BACKUP_NOTES_KEY = 'iitm_notes_backup';
const BACKUP_SUBJECTS_KEY = 'iitm_subjects_backup';
const USER_STORAGE_KEY = 'iitm_current_user';

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
    notes: 'Focus on CRUD operations and form validation',
    userEmail: 'default'
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
    notes: 'Solve assignment questions from Week 5',
    userEmail: 'default'
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
    notes: 'Practice grep, awk, sed commands',
    userEmail: 'default'
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
    notes: 'Completed 10 queries from practice set',
    userEmail: 'default'
  }
];

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

export function getCurrentUserEmail() {
  const user = getStoredUser();
  return user?.email ? user.email.toLowerCase().trim() : 'default';
}

function getBackupTasks(userEmail = getCurrentUserEmail()) {
  try {
    const key = `${BACKUP_TASKS_KEY}_${userEmail}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [];
}

function setBackupTasks(tasks, userEmail = getCurrentUserEmail()) {
  try {
    const key = `${BACKUP_TASKS_KEY}_${userEmail}`;
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (e) {}
}

// Fetch with reasonable 15000ms timeout and automatic user email header
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const userEmail = getCurrentUserEmail();

  const headers = {
    'x-user-email': userEmail,
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers, credentials: 'same-origin', signal: controller.signal });
    clearTimeout(id);
    if (!res.ok && options.method && options.method !== 'GET' && !url.includes('/auth/')) {
      const data = await safeJson(res);
      throw new Error(data?.error || 'Your changes could not be saved.');
    }
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

// Safe JSON parser to handle any response gracefully without crashing
async function safeJson(res) {
  if (!res) return null;
  try {
    const text = await res.text();
    if (!text || !text.trim()) return null;
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

// ─── USER-ISOLATED TASKS API ─────────────────────────────────

export async function fetchTasks(date, userEmail = getCurrentUserEmail()) {
  try {
    let url = `${API_BASE}/tasks?user_email=${encodeURIComponent(userEmail)}`;
    if (date) url += `&date=${date}`;

    const res = await fetchWithTimeout(url);
    const data = await safeJson(res);
    if (Array.isArray(data)) {
      setBackupTasks(data, userEmail);
      return date ? data.filter(t => t.date === date) : data;
    }
  } catch (err) {
    console.warn('Using local cache for tasks:', err.message);
  }

  const backup = getBackupTasks(userEmail);
  return date ? backup.filter(t => t.date === date) : backup;
}

export async function fetchAllTasks(allUsers = false) {
  try {
    const userEmail = getCurrentUserEmail();
    const url = allUsers ? `${API_BASE}/tasks?all_users=true` : `${API_BASE}/tasks?user_email=${encodeURIComponent(userEmail)}`;
    const res = await fetchWithTimeout(url);
    const data = await safeJson(res);
    if (Array.isArray(data)) return data;
  } catch (err) {}
  return getBackupTasks();
}

export async function createTask(taskData) {
  return writeRecord('/tasks', 'POST', taskData);
}

export async function updateTask(id, taskData) {
  return writeRecord(`/tasks/${encodeURIComponent(id)}`, 'PUT', taskData);
}

export async function toggleTask(id) {
  return writeRecord(`/tasks/${encodeURIComponent(id)}/toggle`, 'PATCH', {});
}

export async function deleteTask(id) {
  return writeRecord(`/tasks/${encodeURIComponent(id)}`, 'DELETE');
}

export async function fetchDailyTrack(userEmail = getCurrentUserEmail()) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/daily-track?user_email=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {}

  // Fallback to local cache
  const backup = getBackupTasks(userEmail).filter(t => t.completed);
  const notesRaw = localStorage.getItem(`${BACKUP_NOTES_KEY}_${userEmail}`);
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

// ─── NOTES API ───────────────────────────────────────────────

export async function fetchNote(date, userEmail = getCurrentUserEmail()) {
  const notesKey = `${BACKUP_NOTES_KEY}_${userEmail}`;
  const notesRaw = localStorage.getItem(notesKey);
  const notes = notesRaw ? JSON.parse(notesRaw) : {};

  try {
    const res = await fetchWithTimeout(`${API_BASE}/notes/${date}?user_email=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.noteText !== undefined) {
        notes[date] = data.noteText;
        localStorage.setItem(notesKey, JSON.stringify(notes));
        return data;
      }
    }
  } catch (err) {}

  return { date, noteText: notes[date] || '' };
}

export async function saveNote(date, noteText) {
  return writeRecord(`/notes/${date}`, 'PUT', { noteText });
}

export async function fetchStreak(userEmail = getCurrentUserEmail()) {
  const backup = getBackupTasks(userEmail).filter(t => t.completed);
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
    const res = await fetchWithTimeout(`${API_BASE}/stats/streak?user_email=${encodeURIComponent(userEmail)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.streak === 'number') return data;
    }
  } catch (err) {}

  return { streak: localStreak || 1 };
}

// ─── SUBJECTS API ────────────────────────────────────────────

export async function fetchSubjects() {
  const cached = localStorage.getItem(BACKUP_SUBJECTS_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  try {
    const res = await fetchWithTimeout(`${API_BASE}/subjects`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(BACKUP_SUBJECTS_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {}

  return DEFAULT_SUBJECTS;
}

export async function createSubject(subjectData) {
  return writeRecord('/subjects', 'POST', subjectData);
}

async function authRequest(path, body) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const data = await safeJson(res);
  if (!res.ok || !data?.user) throw new Error(data?.error || 'Unable to sign in. Please try again.');
  setStoredUser(data.user);return data.user;
}
export const loginWithGoogle = ({ credential }) => authRequest('google', { credential });
export const registerWithEmail = ({ email, password, name }) => authRequest('register', { email, password, name });
export const loginWithEmail = ({ email, password }) => authRequest('login', { email, password });
export async function fetchAuthConfig() {
  const res = await fetchWithTimeout(`${API_BASE}/auth/config`);
  const data = await safeJson(res);
  if (!res.ok) throw new Error(data?.error || 'Sign-in service unavailable.');
  return data;
}
export async function restoreSession() {
  const res = await fetchWithTimeout(`${API_BASE}/auth/me`);
  const data = await safeJson(res);
  if (res.status === 401) { setStoredUser(null); return null; }
  if (!res.ok) throw new Error(data?.error || 'Session service unavailable.');
  setStoredUser(data.user);return data.user;
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

export async function logout() {
  const res = await fetchWithTimeout(`${API_BASE}/auth/logout`, { method: 'POST' });
  if (!res.ok) throw new Error('Could not sign out. Please try again.');
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

async function writeRecord(path, method, body) {
  const res = await fetchWithTimeout(`${API_BASE}${path}`, { method,
    headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
  const data = await safeJson(res);
  if (!res.ok || !data) throw new Error(data?.error || 'Your changes could not be saved.');
  return data;
}
