import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, Sun, Moon, LogOut, 
  Download, Smartphone, Calendar, ChevronDown 
} from 'lucide-react';

export default function Navbar({ 
  streak, 
  onOpenAddModal, 
  darkMode, 
  toggleDarkMode, 
  currentUser,
  onOpenAuthModal,
  onLogout,
  isInstalled,
  isInstallable,
  onInstallApp,
  isPhoneView,
  onTogglePhoneView,
  taskDates = [],
  allTasks = [],
  selectedDate,
  setSelectedDate
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const loginMenuRef = useRef(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
        setIsLoginMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand: IIT Madras Logo + Title */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <img
              src="/iitm-logo.png"
              alt="IIT Madras"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain shadow-md border border-gray-200 dark:border-slate-700 bg-white"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                  IIT Madras
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium">Study Planner & Progress</p>
            </div>
          </div>

          {/* Mobile Right Controls: Streak & Profile */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200 dark:border-pink-800">
              <Flame className="w-3.5 h-3.5 fill-pink-500 text-pink-600 animate-pulse" />
              <span>{streak}d</span>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap">

          {/* Install App Button (PWA) - Only shown if NOT already installed */}
          {!isInstalled && isInstallable && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-300 dark:border-pink-700 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Install App on Device / Desktop"
            >
              <Download className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 animate-bounce" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </button>
          )}

          {/* Desktop Streak Counter */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs font-bold shadow-sm" title="Study Streak">
            <Flame className="w-4 h-4 fill-pink-500 text-pink-600 dark:fill-pink-400 dark:text-pink-400 animate-pulse" />
            <span>{streak}d Streak</span>
          </div>

          {/* Dark / Light Mode Toggle (Desktop) */}
          <button
            onClick={toggleDarkMode}
            className="hidden sm:block p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Auth & Login Area (With Scheduled Dates & Phone App View inside) */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-0.5 rounded-full border-2 border-pink-500 hover:border-pink-600 transition-all bg-white dark:bg-slate-800 shadow-sm"
                title={currentUser.name || currentUser.email}
              >
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                    {(currentUser.name || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-scaleUp">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
                    {currentUser.picture ? (
                      <img
                        src={currentUser.picture}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-pink-400"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-bold text-sm flex items-center justify-center">
                        {(currentUser.name || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {currentUser.name}
                      </h4>
                      <p className="text-xs text-gray-400 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 inline-block mb-1">
                      ✓ Google Authenticated
                    </span>

                    {/* Scheduled Dates Section inside Login/Profile Menu */}
                    {taskDates && taskDates.length > 0 && (
                      <div className="py-2 border-t border-b border-gray-100 dark:border-slate-800 my-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                            <span>Scheduled Dates</span>
                          </span>
                          <span className="text-[10px] text-pink-600 font-semibold">{taskDates.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {taskDates.map(d => {
                            const count = allTasks.filter(t => t.date === d).length;
                            const isSelected = d === selectedDate;
                            return (
                              <button
                                key={d}
                                onClick={() => {
                                  setSelectedDate(d);
                                  setIsUserMenuOpen(false);
                                }}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                                  isSelected
                                    ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/20'
                                    : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-400'
                                }`}
                              >
                                {d === todayStr ? 'Today' : d} ({count})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Phone App View inside Account Menu */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onTogglePhoneView();
                      }}
                      className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                        <span>Phone App View</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isPhoneView 
                          ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700' 
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'
                      }`}>
                        {isPhoneView ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login button with Scheduled Dates & Phone View dropdown */
            <div className="relative" ref={loginMenuRef}>
              <div className="flex items-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-800 dark:text-slate-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-slate-700/80 transition-all active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                  className="px-2 py-1.5 border-l border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 hover:text-pink-600 transition-colors flex items-center gap-1"
                  title="Scheduled Dates & Settings"
                >
                  <Calendar className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLoginMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Logged-out Dropdown Menu */}
              {isLoginMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 animate-scaleUp">
                  
                  {/* Quick Google Sign In */}
                  <button
                    onClick={() => {
                      setIsLoginMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-pink-600/20 mb-3 transition-all active:scale-95"
                  >
                    <span>Sign In with Google</span>
                  </button>

                  {/* Scheduled Dates Section inside Login Dropdown */}
                  {taskDates && taskDates.length > 0 && (
                    <div className="py-2 border-t border-b border-gray-100 dark:border-slate-800 my-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                          <span>Scheduled Dates</span>
                        </span>
                        <span className="text-[10px] text-pink-600 font-semibold">{taskDates.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {taskDates.map(d => {
                          const count = allTasks.filter(t => t.date === d).length;
                          const isSelected = d === selectedDate;
                          return (
                            <button
                              key={d}
                              onClick={() => {
                                setSelectedDate(d);
                                setIsLoginMenuOpen(false);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                                isSelected
                                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm shadow-pink-600/20'
                                  : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-400'
                              }`}
                            >
                              {d === todayStr ? 'Today' : d} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Phone App View option */}
                  <button
                    onClick={() => {
                      setIsLoginMenuOpen(false);
                      onTogglePhoneView();
                    }}
                    className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-gray-200 dark:border-slate-700 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                      <span>Phone App View</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isPhoneView 
                        ? 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-slate-700'
                    }`}>
                      {isPhoneView ? 'ON' : 'OFF'}
                    </span>
                  </button>

                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
