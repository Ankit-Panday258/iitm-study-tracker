import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TaskItem from './components/TaskItem';
import TaskFormModal from './components/TaskFormModal';
import PomodoroTimer from './components/PomodoroTimer';
import DailyNotes from './components/DailyNotes';
import DailyTrack from './components/DailyTrack';
import DatabaseViewerModal from './components/DatabaseViewerModal';
import AuthModal from './components/AuthModal';
import AppBottomNav from './components/AppBottomNav';
import PhoneSimulatorFrame from './components/PhoneSimulatorFrame';
import { 
  fetchTasks, createTask, updateTask, toggleTask, deleteTask, fetchStreak, fetchSubjects, 
  DEFAULT_INITIAL_TASKS, DEFAULT_SUBJECTS, getStoredUser, logout as logoutAPI
} from './api';
import { Plus, CheckCircle2, Search, BookMarked, Check, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_DARK = 'iitm_dark_mode';
const STORAGE_KEY_PHONE_VIEW = 'iitm_phone_view';

export default function App() {
  const getTodayString = () => new Date().toISOString().split('T')[0];

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

  // ─── Phone Simulator View Toggle for Desktop ──────────────
  const [isPhoneView, setIsPhoneView] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PHONE_VIEW);
    return saved === 'true';
  });

  const togglePhoneView = () => {
    setIsPhoneView(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_PHONE_VIEW, next.toString());
      return next;
    });
  };

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
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'dailyTrack'
  const [activeBottomTab, setActiveBottomTab] = useState('tasks');

  // ─── State: Immediate initial values from localStorage cache ──
  const [selectedDate, setSelectedDate] = useState(() => {
    return getTodayString();
  });

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const [allTasks, setAllTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('iitm_tasks_backup');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [editingTask, setEditingTask] = useState(null);
  const [activeTimerTask, setActiveTimerTask] = useState(null);

  const handleLogout = () => {
    logoutAPI();
    setCurrentUser(null);
    showToast('Logged out successfully');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name || user.email}!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ─── Load tasks from API in background ─────────────────────
  const loadTasks = useCallback(async () => {
    try {
      const data = await fetchTasks();
      if (Array.isArray(data) && data.length > 0) {
        setAllTasks(data);
      }
    } catch (err) {
      console.warn('Background loadTasks failed:', err);
    }
  }, []);

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

  const loadStreak = useCallback(async () => {
    try {
      const data = await fetchStreak();
      if (data && typeof data.streak === 'number') {
        setStreak(data.streak);
      }
    } catch (err) {
      console.warn('Background loadStreak failed:', err);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadStreak();
    loadSubjects();
  }, [loadTasks, loadStreak, loadSubjects]);

  // Keep backup in localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iitm_tasks_backup', JSON.stringify(allTasks));
    } catch (e) {}
  }, [allTasks]);

  useEffect(() => {
    try {
      localStorage.setItem('iitm_subjects_backup', JSON.stringify(subjects));
    } catch (e) {}
  }, [subjects]);

  // ─── Filter tasks for selected date ────────────────────────
  const dateTasks = allTasks.filter(t => t.date === selectedDate);

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
    const target = allTasks.find(t => t.id === taskId);
    if (!target) return;
    const willBeCompleted = !target.completed;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }

    setAllTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            completed: willBeCompleted,
            completedAt: willBeCompleted ? (t.completedAt || new Date().toISOString()) : null
          };
        }
        return t;
      });
      try {
        localStorage.setItem('iitm_tasks_backup', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (willBeCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#db2777', '#f43f5e', '#ec4899', '#ffffff']
      });
      showToast('Topic marked completed! 🎉');
    }

    try {
      await toggleTask(taskId);
      loadStreak();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setAllTasks(prev => {
      const updated = prev.filter(t => t.id !== taskId);
      try {
        localStorage.setItem('iitm_tasks_backup', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Topic deleted');
    try {
      await deleteTask(taskId);
      loadStreak();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      const updated = { ...editingTask, ...taskData };
      setAllTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t));
      showToast('Topic updated successfully!');
      try {
        await updateTask(editingTask.id, taskData);
        loadStreak();
      } catch (err) {
        console.error('Failed to update task:', err);
      }
    } else {
      const tempId = Date.now().toString();
      const newTask = {
        id: tempId,
        completed: false,
        ...taskData,
        date: taskData.date || selectedDate
      };
      setAllTasks(prev => [newTask, ...prev.filter(t => t.id !== tempId)]);
      showToast('Topic added successfully!');

      try {
        const created = await createTask(taskData);
        if (created) {
          setAllTasks(prev => [created, ...prev.filter(t => t.id !== tempId && t.id !== created.id)]);
        }
        loadStreak();
      } catch (err) {
        console.error('Failed to create task:', err);
      }
    }
  };

  // List of all distinct dates in tasks
  const taskDates = Array.from(new Set(allTasks.map(t => t.date))).sort().reverse();

  // ─── Main Render ───────────────────────────────────────────
  return (
    <PhoneSimulatorFrame 
      isPhoneView={isPhoneView} 
      onTogglePhoneView={togglePhoneView}
    >
      <div className="min-h-full bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white transition-colors duration-200 pb-20">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 sm:top-20 right-4 sm:right-6 z-50 bg-pink-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl shadow-pink-600/30 flex items-center gap-2 animate-bounce border border-pink-400">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* App Header */}
        <Navbar
          streak={streak}
          onOpenAddModal={handleOpenAddModal}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onOpenDailyTrack={() => {
            setCurrentPage('dailyTrack');
            setActiveBottomTab('track');
          }}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          isInstalled={isInstalled}
          isInstallable={isInstallable}
          onInstallApp={handleInstallApp}
          isPhoneView={isPhoneView}
          onTogglePhoneView={togglePhoneView}
          taskDates={taskDates}
          allTasks={allTasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* View Switch: Daily Track or Main Planner */}
        {currentPage === 'dailyTrack' ? (
          <DailyTrack 
            onBack={() => { 
              setCurrentPage('home'); 
              setActiveBottomTab('tasks');
              loadTasks(); 
              loadStreak(); 
            }} 
          />
        ) : (
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

            {/* Stats Overview */}
            <StatsOverview tasks={dateTasks} selectedDate={selectedDate} />

            {/* Daily Notes */}
            <DailyNotes selectedDate={selectedDate} />

            {/* Task List Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  Daily Study Tasks
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400">
                  Tick mark (✓) after completing each topic to generate your 24h sticker.
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
                          ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
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
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:border-pink-500 font-medium shadow-sm"
                >
                  <option value="All">All Subjects</option>
                  {subjects.map(s => (
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
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 shadow-sm"
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
                <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-3 border border-pink-200 dark:border-pink-700">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-md shadow-pink-600/25 border border-pink-600 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  Add New Study Topic
                </button>
              </div>
            )}

            {/* App Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-200 dark:border-slate-800 pt-4 text-xs text-gray-500 dark:text-slate-500">
              <p>IIT Madras Study Tracker &bull; Mobile App Edition</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDbModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 font-semibold transition-all shadow-sm active:scale-95 text-[11px]"
                >
                  <span>📦 View Database</span>
                </button>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  <span>Sync Active</span>
                </span>
              </div>
            </div>

          </main>
        )}

        {/* Native Mobile Bottom Navigation Bar */}
        <AppBottomNav
          activeTab={activeBottomTab}
          setActiveTab={(tab) => {
            setActiveBottomTab(tab);
            if (tab === 'tasks') setCurrentPage('home');
          }}
          onOpenAddModal={handleOpenAddModal}
          onOpenDailyTrack={() => {
            setCurrentPage('dailyTrack');
            setActiveBottomTab('track');
          }}
          onCloseDailyTrack={() => {
            setCurrentPage('home');
            setActiveBottomTab('tasks');
          }}
          onOpenDatabaseViewer={() => setIsDbModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          currentUser={currentUser}
          streak={streak}
        />

        {/* Database Viewer Modal */}
        <DatabaseViewerModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          isPhoneView={isPhoneView}
          onTogglePhoneView={togglePhoneView}
        />

        {/* Task Add / Edit Modal */}
        <TaskFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveTask={handleSaveTask}
          editingTask={editingTask}
          selectedDate={selectedDate}
          availableSubjects={subjects}
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
    </PhoneSimulatorFrame>
  );
}
