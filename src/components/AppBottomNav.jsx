import React from 'react';
import { Calendar, Trophy, Plus, BookOpen, User as UserIcon, Flame } from 'lucide-react';

export default function AppBottomNav({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenDailyTrack,
  onCloseDailyTrack,
  onOpenBooks,
  onCloseBooks,
  onOpenDatabaseViewer,
  onOpenAuthModal,
  currentUser,
  streak
}) {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const handleTabClick = (tabKey) => {
    triggerHaptic();
    if (tabKey === 'tasks') {
      if (typeof onCloseDailyTrack === 'function') onCloseDailyTrack();
      if (typeof onCloseBooks === 'function') onCloseBooks();
      setActiveTab('tasks');
    } else if (tabKey === 'books') {
      if (typeof onCloseDailyTrack === 'function') onCloseDailyTrack();
      if (typeof onOpenBooks === 'function') onOpenBooks();
      setActiveTab('books');
    } else if (tabKey === 'track') {
      if (typeof onCloseBooks === 'function') onCloseBooks();
      if (typeof onOpenDailyTrack === 'function') onOpenDailyTrack();
      setActiveTab('track');
    } else if (tabKey === 'profile') {
      if (typeof onOpenAuthModal === 'function') onOpenAuthModal();
      setActiveTab('profile');
    }
  };

  const handleCenterPlusClick = () => {
    triggerHaptic();
    onOpenAddModal();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Tab 1: Tasks / Planner */}
        <button
          onClick={() => handleTabClick('tasks')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all py-1 active:scale-95 ${
            activeTab === 'tasks'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'tasks' ? 'bg-pink-50 dark:bg-pink-950/40' : ''}`}>
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Today</span>
        </button>

        {/* Tab 2: Books / Study Materials */}
        <button
          onClick={() => handleTabClick('books')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all py-1 active:scale-95 ${
            activeTab === 'books'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'books' ? 'bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-500' : ''}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Books</span>
        </button>

        {/* Center Primary Action Button: Elevated Pink Plus (+) */}
        <div className="flex-1 flex items-center justify-center -mt-5">
          <button
            onClick={handleCenterPlusClick}
            className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-pink-600 hover:bg-pink-700 active:scale-90 text-white flex items-center justify-center shadow-lg shadow-pink-600/40 border-4 border-white dark:border-slate-900 transition-all cursor-pointer"
            title="Add New Study Topic"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Daily Track (Stickers) */}
        <button
          onClick={() => handleTabClick('track')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all py-1 active:scale-95 ${
            activeTab === 'track'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'track' ? 'bg-pink-50 dark:bg-pink-950/40' : ''}`}>
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight">Stickers</span>
        </button>

        {/* Tab 4: Account / Profile with Robot Avatar */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all py-1 active:scale-95 ${
            activeTab === 'profile'
              ? 'text-pink-600 dark:text-pink-400 font-bold'
              : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <div className={`p-0.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-500' : ''}`}>
            <img
              src={currentUser?.picture || "/avatar-bot.png"}
              alt="Account"
              className="w-6 h-6 rounded-full object-cover"
            />
          </div>
          <span className="text-[10px] tracking-tight">Account</span>
        </button>

      </div>
    </nav>
  );
}
