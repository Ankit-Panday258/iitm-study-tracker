import { restoreSession } from './api';
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TaskItem from './components/TaskItem';
import TaskFormModal from './components/TaskFormModal';
import PomodoroTimer from './components/PomodoroTimer';
import DailyTrack from './components/DailyTrack';
import DatabaseViewerModal from './components/DatabaseViewerModal';
import AuthModal from './components/AuthModal';
import BooksPage from './components/BooksPage';
import CoursesPage, { SYSTEM_COMMANDS_DRIVE_URL } from './components/CoursesPage';
import AssignmentCalendar from './components/AssignmentCalendar';
import GoalsPage from './components/GoalsPage';
import AdminPanel from './components/AdminPanel';
import { IITM_CURRICULUM } from './data/iitmCurriculum';
import ExamStudyPlanner from './components/ExamStudyPlanner';
import { 
  fetchTasks, getBackupTasks, createTask, updateTask, toggleTask, deleteTask, fetchStreak, fetchSubjects,
  DEFAULT_INITIAL_TASKS, DEFAULT_SUBJECTS, getStoredUser, setStoredUser, logout as logoutAPI, syncGoalToNotion
} from './api';
import { Plus, CheckCircle2, Search, BookMarked, Check, Calendar, ChevronLeft, ChevronRight, Play, Folder, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLocalDateString } from './utils/formatTime.js';

const STORAGE_KEY_DARK = 'iitm_dark_mode';

export default function App() {
  const getTodayString = () => getLocalDateString();

  // ─── Dark mode ─────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DARK);
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_DARK, darkMode.toString());
  }, [darkMode]);

  // ─── PWA Install Prompt State ─────────────────────────────
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    return isStandalone || localStorage.getItem('iitm_app_installed') === 'true';
  });
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (isStandalone || localStorage.getItem('iitm_app_installed') === 'true') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    };
    checkStandalone();

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      if (isStandalone || localStorage.getItem('iitm_app_installed') === 'true') {
        setIsInstalled(true);
        setIsInstallable(false);
        return;
      }
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      localStorage.setItem('iitm_app_installed', 'true');
      showToast('App installed to your device! 🎉');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        localStorage.setItem('iitm_app_installed', 'true');
        showToast('App installed to your device! 🎉');
      }
      setDeferredPrompt(null);
    } else {
      showToast('To install: click Browser menu (⋮ or Share) → "Install / Add to Home Screen"');
    }
  };

  // ─── Page navigation ──────────────────────────────────────
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'dailyTrack' | 'admin'
  const [activeBottomTab, setActiveBottomTab] = useState('tasks');
  const [coursesInitialStep, setCoursesInitialStep] = useState('subjects');

  // ─── State: Immediate initial values from localStorage cache ──
  const [selectedDate, setSelectedDate] = useState(() => {
    return getTodayString();
  });

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(getLocalDateString(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(getLocalDateString(d));
  };

  const [allTasks, setAllTasks] = useState(() => {
    try {
      const cachedUser = getStoredUser();
      const cachedTasks = getBackupTasks(cachedUser?.email || 'default');
      if (cachedTasks.length > 0) return cachedTasks;
    } catch (e) {}
    return DEFAULT_INITIAL_TASKS;
  });

  const [subjects, setSubjects] = useState(() => {
    try {
      const raw = localStorage.getItem('iitm_subjects_backup');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_SUBJECTS;
  });

  const [streak, setStreak] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const [filterTab, setFilterTab] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(['/login', '/register'].includes(window.location.pathname));
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredUser();
  });
  const selectedProfileSubjects = (currentUser?.selectedSubjects || [])
    .map(code => IITM_CURRICULUM.find(course => course.code === code))
    .filter(Boolean)
    .map(course => ({ id: `iitm_${course.code}`, name: course.name, icon: '📘', color: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-700' }));
  const availableSubjects = [...subjects, ...selectedProfileSubjects.filter(profileSubject => !subjects.some(subject => subject.name === profileSubject.name))];
  useEffect(() => {
    restoreSession().then(setCurrentUser).catch(error => {
      // Keep the cached identity visible while the session endpoint is temporarily unavailable.
      console.warn(error.message);
      setCurrentUser(getStoredUser());
    });
    const onPop = () => setIsAuthModalOpen(['/login', '/register'].includes(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTimerTask, setActiveTimerTask] = useState(null);

  // ─── Load tasks from API for active user ───────────────────
  const loadTasks = useCallback(async (userToLoad = currentUser) => {
    try {
      const email = userToLoad?.email || 'default';
      const data = await fetchTasks(undefined, email);
      if (Array.isArray(data)) {
        setAllTasks(data);
      }
    } catch (err) {
      console.warn('Background loadTasks failed:', err);
    }
  }, [currentUser]);

  const loadSubjects = useCallback(async () => {
    try {
      const data = await fetchSubjects();
      if (Array.isArray(data) && data.length > 0) {
        setSubjects(data);
      }
    } catch (err) {
      console.warn('Background loadSubjects failed:', err);
    }
  }, []);

  const loadStreak = useCallback(async (userToLoad = currentUser) => {
    try {
      const email = userToLoad?.email || 'default';
      const data = await fetchStreak(email);
      if (data && typeof data.streak === 'number') {
        setStreak(data.streak);
      }
    } catch (err) {
      console.warn('Background loadStreak failed:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadTasks(currentUser);
    loadStreak(currentUser);
    loadSubjects();
  }, [currentUser, loadTasks, loadStreak, loadSubjects]);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch (error) { showToast(error.message); return; }
    setCurrentUser(null);
    setStoredUser(null);
    showToast('Logged out successfully');
    await Promise.all([loadTasks(null), loadStreak(null)]);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setStoredUser(user);
    showToast(`Welcome back, ${user.name || user.email}!`);
    // Close the sign-in screen as soon as authentication succeeds; data refreshes in the background.
    void Promise.all([loadTasks(user), loadStreak(user)]);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    try {
      localStorage.setItem('iitm_subjects_backup', JSON.stringify(subjects));
    } catch (e) {}
  }, [subjects]);

  // ─── Filter tasks for selected date ────────────────────────
  const dateTasks = allTasks.filter(t => t.date === selectedDate && t.subject !== 'Personal Goals');

  const filteredTasks = dateTasks.filter(task => {
    if (filterTab === 'Pending' && task.completed) return false;
    if (filterTab === 'Completed' && !task.completed) return false;
    if (selectedSubject !== 'All' && task.subject !== selectedSubject) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTopic = task.topic.toLowerCase().includes(query);
      const matchSubject = task.subject.toLowerCase().includes(query);
      if (!matchTopic && !matchSubject) return false;
    }
    return true;
  });

  // ─── Task Actions ──────────────────────────────────────────
  const handleToggleTask = async (taskId) => {
    try {
      const updated = await toggleTask(taskId);
      setAllTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      let syncWarning = '';
      if (updated.subject === 'Personal Goals') {
        try { await syncGoalToNotion(updated); }
        catch (syncError) { syncWarning = ` · Notion sync failed: ${syncError.message}`; }
      }
      if (updated.completed) confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      showToast(`${updated.completed ? 'Topic marked completed!' : 'Topic marked pending'}${syncWarning}`);
      loadStreak();
    } catch (error) { showToast(error.message); }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const deleting = allTasks.find(task => task.id === taskId);
      await deleteTask(taskId);
      let syncWarning = '';
      if (deleting?.subject === 'Personal Goals') {
        try { await syncGoalToNotion(deleting, true); }
        catch (syncError) { syncWarning = ` · Notion sync failed: ${syncError.message}`; }
      }
      setAllTasks(prev => prev.filter(t => t.id !== taskId));
      showToast(`Topic deleted${syncWarning}`);loadStreak();
    } catch (error) { showToast(error.message); }
  };

  const handleOpenAddModal = () => {
    if (!currentUser) { setIsAuthModalOpen(true); return; }
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData, goalToEdit = null) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, error: 'Please sign in to add or edit study topics.' };
    }
    try {
      const taskWithDate = { ...taskData, date: taskData.date || getTodayString() };
      const taskBeingEdited = goalToEdit === false ? null : goalToEdit || editingTask;
      const saved = taskBeingEdited ? await updateTask(taskBeingEdited.id, taskWithDate) : await createTask(taskWithDate);
      setAllTasks(prev => taskBeingEdited ? prev.map(t => t.id === saved.id ? saved : t) : [saved, ...prev]);
      let syncWarning = '';
      if (saved.subject === 'Personal Goals') {
        try { await syncGoalToNotion(saved); }
        catch (syncError) { syncWarning = ` · Notion sync failed: ${syncError.message}`; }
      }
      // Make the saved item visible even if the planner was filtered to another date or status.
      setSelectedDate(saved.date);
      setFilterTab('All');
      setSelectedSubject('All');
      setSearchQuery('');
      showToast(`${taskBeingEdited ? 'Topic updated successfully!' : 'Topic added successfully!'}${syncWarning}`);
      loadStreak();
      return { success: true };
    } catch (error) {
      showToast(error.message);
      return { success: false, error: error.message };
    }
  };

  // List of all distinct dates in tasks
  const taskDates = Array.from(new Set(allTasks.map(t => t.date))).sort().reverse();

  // ─── Main Render ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col font-sans selection:bg-gray-500 selection:text-white transition-colors duration-200 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 sm:top-20 right-4 sm:right-6 z-50 bg-gray-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl shadow-gray-600/30 flex items-center gap-2 animate-bounce border border-gray-400">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Header */}
      <Navbar
        currentPage={currentPage}
        onOpenDashboard={() => { setCurrentPage('home'); setActiveBottomTab('tasks'); }}
        onOpenGoals={() => setCurrentPage('goals')}
        onOpenExamPlanner={() => setCurrentPage('examPlanner')}
        streak={streak}
        onOpenAddModal={handleOpenAddModal}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenDailyTrack={() => {
          setCurrentPage('dailyTrack');
          setActiveBottomTab('track');
        }}
        onOpenCourses={() => {
          setCoursesInitialStep('subjects');
          setCurrentPage('courses');
          setActiveBottomTab('courses');
        }}
        onOpenCalendar={() => {
          setCurrentPage('calendar');
          setActiveBottomTab('calendar');
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isInstalled={isInstalled}
        isInstallable={isInstallable}
        onInstallApp={handleInstallApp}
        onOpenAdmin={currentUser?.isAdmin ? () => setCurrentPage('admin') : undefined}
      />

        {currentPage === 'examPlanner' ? (
          <ExamStudyPlanner key={currentUser?.id || 'guest'} currentUser={currentUser} tasks={allTasks} subjects={subjects} onBack={() => { setCurrentPage('home'); setActiveBottomTab('tasks'); }} />
        ) : currentPage === 'goals' ? (
          <GoalsPage tasks={allTasks} onSave={handleSaveTask} onToggle={handleToggleTask} onDelete={handleDeleteTask} onBack={() => setCurrentPage('home')} />
        ) : currentPage === 'admin' ? (
          <AdminPanel onBack={() => setCurrentPage('home')} showToast={showToast} />
        ) : currentPage === 'dailyTrack' ? (
          <DailyTrack 
            onBack={() => { 
              setCurrentPage('home'); 
              setActiveBottomTab('tasks');
              loadTasks(); 
              loadStreak(); 
            }} 
          />
        ) : currentPage === 'courses' ? (
          <CoursesPage
            onBack={() => {
              setCurrentPage('home');
              setActiveBottomTab('tasks');
            }}
            onAddTask={handleSaveTask}
            showToast={showToast}
            initialStep={coursesInitialStep}
            initialCourseId="sys_cmd"
          />
        ) : currentPage === 'books' ? (
          <BooksPage
            onBack={() => {
              setCurrentPage('home');
              setActiveBottomTab('tasks');
            }}
          />
        ) : currentPage === 'calendar' ? (
          <AssignmentCalendar
            onBack={() => {
              setCurrentPage('home');
              setActiveBottomTab('tasks');
            }}
            onAddTask={handleSaveTask}
            showToast={showToast}
          />
        ) : (
          <main className="workspace-dashboard flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <section className="workspace-heading">
              <div><p className="workspace-kicker">IIT MADRAS / YOUR WORKSPACE</p><h1>Make today count<span>.</span></h1><p>A little focus today. A step closer to your goals.</p></div>
              <button onClick={handleOpenAddModal} className="workspace-add"><Plus size={18} /> New study task</button>
            </section>
            {/* Stats Overview */}
            <StatsOverview tasks={dateTasks} selectedDate={selectedDate} />

            <div className="flex items-center justify-center gap-3 mb-4" aria-label="Study date navigation">
              <button
                type="button"
                onClick={handlePrevDay}
                aria-label="Previous day"
                className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:border-gray-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="min-w-36 text-center text-sm font-semibold text-gray-700 dark:text-slate-200">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {selectedDate !== getTodayString() && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(getTodayString())}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/40 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors"
                >
                  Today
                </button>
              )}
              <button
                type="button"
                onClick={handleNextDay}
                aria-label="Next day"
                className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:border-gray-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <section className="workspace-task-panel" aria-label="Study tasks">
            {/* Task List Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Daily Study Tasks
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400">
                  Your next steps, one topic at a time.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-0.5 rounded-xl flex items-center text-xs font-semibold shadow-sm">
                  {['All', 'Pending', 'Completed'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`px-2.5 py-1.5 rounded-lg transition-all border ${
                        filterTab === tab
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'text-gray-600 dark:text-slate-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab === 'All' ? 'All' : tab === 'Pending' ? 'Pending' : 'Done'}
                    </button>
                  ))}
                </div>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:border-gray-500 font-medium shadow-sm"
                >
                  <option value="All">All Subjects</option>
                  {availableSubjects.map(s => (
                    <option key={s.name} value={s.name}>
                      {s.icon || '📚'} {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search study topics or subjects..."
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 shadow-sm"
              />
            </div>

            {/* Task Items List */}
            {filteredTasks.length > 0 ? (
              <div className="space-y-2.5 mb-6">
                {filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onToggleTask={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onDeleteTask={handleDeleteTask}
                    onEdit={handleOpenEditModal}
                    onEditTask={handleOpenEditModal}
                    onStartTimer={(t) => setActiveTimerTask(t)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white dark:bg-slate-900/60 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 flex items-center justify-center mx-auto mb-3 border border-gray-200 dark:border-gray-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  No study topics found for {selectedDate}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                  {dateTasks.length === 0
                    ? `No study topics scheduled for ${selectedDate}. Tap below to add your first topic!`
                    : 'No results match the selected filter (check "All" or "Completed" tab).'}
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-md shadow-gray-600/25 border border-gray-600 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  Add New Study Topic
                </button>
              </div>
            )}

            </section>
            {/* App Footer */}
            {currentUser?.isAdmin && <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-200 dark:border-slate-800 pt-4 text-xs text-gray-500 dark:text-slate-500">
              <p>IIT Madras Study Tracker &bull; Mobile App Edition</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDbModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 font-semibold transition-all shadow-sm active:scale-95 text-[11px]"
                >
                  <span>📦 View Database</span>
                </button>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
                  <span>{currentUser ? 'Signed in' : 'Sign in to sync'}</span>
                </span>
              </div>
            </div>}

          </main>
        )}

        {/* Database Viewer Modal */}
        <DatabaseViewerModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => { window.history.pushState({}, '', '/'); setIsAuthModalOpen(false); }}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Task Add / Edit Modal */}
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveTask={handleSaveTask}
          editingTask={editingTask}
          selectedDate={selectedDate}
          availableSubjects={availableSubjects}
          onSubjectAdded={(newSub) => {
            setSubjects(prev => [...prev.filter(s => s.name !== newSub.name), newSub]);
            showToast(`Subject "${newSub.name}" added!`);
          }}
        />

        {/* Pomodoro Timer Modal */}
        {activeTimerTask && (
          <PomodoroTimer
            activeTask={activeTimerTask}
            onClose={() => setActiveTimerTask(null)}
            onCompleteTask={(taskId) => {
              handleToggleTask(taskId);
              setActiveTimerTask(null);
            }}
          />
        )}

      </div>
  );
}
