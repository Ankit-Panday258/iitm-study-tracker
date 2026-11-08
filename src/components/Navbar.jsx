import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Calendar, Trophy, Timer, Sun, Moon, Download, LogOut, ShieldCheck, Folder, BookOpen, LayoutDashboard } from 'lucide-react';

export default function Navbar({ currentPage, onOpenDashboard, onOpenCourses, onOpenGoals, onOpenExamPlanner, onOpenDailyTrack, onOpenCalendar, onOpenAdmin, darkMode, toggleDarkMode, currentUser, onOpenAuthModal, onLogout, isInstalled, isInstallable, onInstallApp, streak }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    const outside = (event) => { if (!menuRef.current?.contains(event.target)) setOpen(false); };
    const escape = (event) => { if (event.key === 'Escape' && menuRef.current?.contains(event.target)) { setOpen(false); triggerRef.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const navigate = (action) => { setOpen(false); action?.(); };
  return (
    <header className="workspace-nav">
      <div className="workspace-nav-inner">
        <button onClick={onOpenDashboard} className="workspace-brand" aria-label="IIT Madras dashboard">
          <img src="/iitm-logo.png" alt="" width="38" height="38" />
          <span>IIT Madras<small>Study workspace</small></span>
        </button>
        <nav className="workspace-tabs" aria-label="Main navigation">
          <button onClick={onOpenDashboard} aria-current={currentPage === 'home' ? 'page' : undefined}><LayoutDashboard size={17} /> Dashboard</button>
          <button onClick={onOpenCourses} aria-current={currentPage === 'courses' ? 'page' : undefined}><BookOpen size={17} /> Courses</button>
        </nav>
        <div className="workspace-menu" ref={menuRef}>
          <button ref={triggerRef} className="workspace-menu-trigger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="workspace-menu-panel" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
          {open && <div id="workspace-menu-panel" className="workspace-menu-panel">
            <div className="workspace-account"><strong>{currentUser?.name || 'Your study workspace'}</strong><small>{streak || 0} day study streak</small></div>
            <button onClick={() => navigate(onOpenGoals)}><Trophy size={18} /> Goals & rewards</button>
            <button onClick={() => navigate(onOpenCalendar)}><Calendar size={18} /> Assignment calendar</button>
            <button onClick={() => navigate(onOpenExamPlanner)}><BookOpen size={18} /> Exam study planner</button>
            <button onClick={() => navigate(onOpenDailyTrack)}><Timer size={18} /> Daily progress</button>
            <a href="https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv" target="_blank" rel="noopener noreferrer"><Folder size={18} /> System Commands notes</a>
            <button onClick={toggleDarkMode}>{darkMode ? <Sun size={18} /> : <Moon size={18} />}{darkMode ? 'Light appearance' : 'Dark appearance'}</button>
            {!isInstalled && isInstallable && <button onClick={() => navigate(onInstallApp)}><Download size={18} /> Install app</button>}
            {currentUser?.isAdmin && <button onClick={() => navigate(onOpenAdmin)}><ShieldCheck size={18} /> Admin panel</button>}
            <button onClick={() => navigate(currentUser ? onLogout : onOpenAuthModal)}><LogOut size={18} />{currentUser ? 'Sign out' : 'Sign in'}</button>
          </div>}
        </div>
      </div>
    </header>
  );
}
