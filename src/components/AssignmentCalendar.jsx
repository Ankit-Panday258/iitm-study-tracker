import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, ArrowLeft, Clock, AlertTriangle, CheckCircle2, 
  ChevronLeft, ChevronRight, Plus, ExternalLink, Flag, Sparkles, Filter, 
  Layers, Check, Bell, BookOpen, MessageCircle
} from 'lucide-react';
import WhatsAppModal from './WhatsAppModal';

export const ASSIGNMENT_SCHEDULE = [
  {
    week: 1,
    termWeek: 'Week 1T3',
    label: 'Week 1',
    releaseDateStr: 'Friday, October 2, 2026',
    releaseDate: '2026-10-02',
    deadlineStr: 'Sunday, October 11, 2026',
    deadlineDate: '2026-10-11',
    comment: null,
    type: 'regular'
  },
  {
    week: 2,
    termWeek: 'Week 2 T3',
    label: 'Week 2',
    releaseDateStr: 'Friday, October 9, 2026',
    releaseDate: '2026-10-09',
    deadlineStr: 'Sunday, October 18, 2026',
    deadlineDate: '2026-10-18',
    comment: null,
    type: 'regular'
  },
  {
    week: 3,
    termWeek: 'Week 3T3',
    label: 'Week 3',
    releaseDateStr: 'Friday, October 16, 2026',
    releaseDate: '2026-10-16',
    deadlineStr: 'Sunday, October 25, 2026',
    deadlineDate: '2026-10-25',
    comment: null,
    type: 'regular'
  },
  {
    week: 4,
    termWeek: 'Week 4T3',
    label: 'Week 4',
    releaseDateStr: 'Friday, October 23, 2026',
    releaseDate: '2026-10-23',
    deadlineStr: 'Sunday, November 1, 2026',
    deadlineDate: '2026-11-01',
    comment: 'OPPE 1 eligibility closes',
    type: 'milestone_cyan'
  },
  {
    week: 5,
    termWeek: 'Week 5T3',
    label: 'Week 5',
    releaseDateStr: 'Friday, October 30, 2026',
    releaseDate: '2026-10-30',
    deadlineStr: 'Wednesday, November 11, 2026',
    deadlineDate: '2026-11-11',
    comment: null,
    type: 'regular'
  },
  {
    week: 6,
    termWeek: 'Week 6T3',
    label: 'Week 6',
    releaseDateStr: 'Friday, November 6, 2026',
    releaseDate: '2026-11-06',
    deadlineStr: 'Wednesday, November 18, 2026',
    deadlineDate: '2026-11-18',
    comment: null,
    type: 'regular'
  },
  {
    week: 7,
    termWeek: 'Week 7T3',
    label: 'Week 7',
    releaseDateStr: 'Friday, November 13, 2026',
    releaseDate: '2026-11-13',
    deadlineStr: 'Wednesday, November 25, 2026',
    deadlineDate: '2026-11-25',
    comment: 'End term eligibility closes',
    type: 'milestone_green'
  },
  {
    week: 8,
    termWeek: 'Week 8T3',
    label: 'Week 8',
    releaseDateStr: 'Friday, November 20, 2026',
    releaseDate: '2026-11-20',
    deadlineStr: 'Sunday, November 29, 2026',
    deadlineDate: '2026-11-29',
    comment: 'OPPE2 - eligibility closes',
    type: 'milestone_cyan'
  },
  {
    week: 9,
    termWeek: 'Week 9T3',
    label: 'Week 9',
    releaseDateStr: 'Friday, November 27, 2026',
    releaseDate: '2026-11-27',
    deadlineStr: 'Sunday, December 6, 2026',
    deadlineDate: '2026-12-06',
    comment: null,
    type: 'regular'
  },
  {
    week: 10,
    termWeek: 'Week 10T3',
    label: 'Week 10',
    releaseDateStr: 'Friday, December 4, 2026',
    releaseDate: '2026-12-04',
    deadlineStr: 'Sunday, December 13, 2026',
    deadlineDate: '2026-12-13',
    comment: 'GAA calculation closes',
    type: 'milestone_green'
  },
  {
    week: 11,
    termWeek: 'Week 11T3',
    label: 'Week 11',
    releaseDateStr: 'Friday, December 11, 2026',
    releaseDate: '2026-12-11',
    deadlineStr: 'Wednesday, December 23, 2026',
    deadlineDate: '2026-12-23',
    comment: null,
    type: 'regular'
  },
  {
    week: 12,
    termWeek: 'Week 12T3',
    label: 'Week 12',
    releaseDateStr: 'Friday, December 11, 2026',
    releaseDate: '2026-12-11',
    deadlineStr: 'Wednesday, December 23, 2026',
    deadlineDate: '2026-12-23',
    comment: null,
    type: 'regular'
  }
];

export const OFFICIAL_EXAMS = [
  {
    id: 'quiz1',
    name: 'Quiz 1',
    dateStr: 'Sunday, November 15, 2026',
    date: '2026-11-15',
    type: 'exam',
    badgeColor: 'amber',
    icon: '📝',
    scope: 'Weeks 1 to 4 Content',
    description: 'First Major In-Person / Proctored Assessment (Weeks 1 to 4 Content)'
  },
  {
    id: 'quiz2',
    name: 'Quiz 2',
    dateStr: 'Saturday, December 5, 2026',
    date: '2026-12-05',
    type: 'exam',
    badgeColor: 'purple',
    icon: '📝',
    scope: 'Weeks 5 to 8 Content',
    description: 'Second Major In-Person / Proctored Assessment (Weeks 5 to 8 Content)'
  },
  {
    id: 'endterm',
    name: 'End Term Exam',
    dateStr: 'Sunday, January 10, 2027',
    date: '2027-01-10',
    type: 'exam',
    badgeColor: 'rose',
    icon: '🏆',
    scope: 'Full Term (Weeks 1 to 12 Content)',
    description: 'Comprehensive Term Final Exam (All 12 Weeks)'
  }
];

export const AVAILABLE_MONTHS = [
  { year: 2026, month: 9, label: 'October 2026', shortLabel: 'October' },
  { year: 2026, month: 10, label: 'November 2026', shortLabel: 'November' },
  { year: 2026, month: 11, label: 'December 2026', shortLabel: 'December' },
  { year: 2027, month: 0, label: 'January 2027', shortLabel: 'January 2027' }
];

const STORAGE_KEY_SUBMITTED = 'iitm_assignments_submitted_v1';

export default function AssignmentCalendar({ onBack, onAddTask, showToast }) {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const [currentMonthIdx, setCurrentMonthIdx] = useState(0); // 0 = Oct 2026, 1 = Nov, 2 = Dec, 3 = Jan 2027
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'milestones' | 'exams' | 'submitted' | 'pending'
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppConfig, setWhatsAppConfig] = useState(null);

  const activeMonthObj = AVAILABLE_MONTHS[currentMonthIdx] || AVAILABLE_MONTHS[0];
  const selectedMonth = activeMonthObj.month;
  const monthYear = activeMonthObj.year;

  const checkWhatsAppStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/config');
      if (res.ok) {
        const data = await res.json();
        setWhatsAppConfig(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    checkWhatsAppStatus();
  }, []);

  // Saved submissions
  const [submittedWeeks, setSubmittedWeeks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMITTED);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMITTED, JSON.stringify(submittedWeeks));
    } catch (e) {}
  }, [submittedWeeks]);

  const toggleSubmission = (weekNum) => {
    setSubmittedWeeks(prev => {
      const next = { ...prev, [weekNum]: !prev[weekNum] };
      if (!prev[weekNum] && showToast) {
        showToast(`Week ${weekNum} assignment marked as Submitted! 🎉`);
      }
      return next;
    });
  };

  const handleAddAssignmentTask = (item) => {
    if (!onAddTask) return;
    const taskData = {
      subject: 'IITM Assignment',
      topic: `${item.label} Assignment (${item.termWeek})`,
      durationMinutes: 120,
      priority: item.comment ? 'High' : 'Medium',
      notes: `Release: ${item.releaseDateStr}\nDeadline: ${item.deadlineStr}${item.comment ? `\nImportant: ${item.comment}` : ''}`
    };
    onAddTask(taskData);
    if (showToast) {
      showToast(`Added ${item.label} assignment deadline to tasks! 🎯`);
    }
  };

  const handleAddExamTask = (exam) => {
    if (!onAddTask) return;
    const taskData = {
      subject: 'IITM Exam',
      topic: `${exam.name} Exam (${exam.scope})`,
      durationMinutes: 180,
      priority: 'High',
      notes: `Official Exam Date: ${exam.dateStr}\nScope: ${exam.scope}\nDetails: ${exam.description}`
    };
    onAddTask(taskData);
    if (showToast) {
      showToast(`Added ${exam.name} exam prep to tasks! 🎯`);
    }
  };

  // Find the next upcoming deadline from today
  const todayStr = '2026-10-06';
  const upcomingAssignments = ASSIGNMENT_SCHEDULE.filter(a => a.deadlineDate >= todayStr);
  const nextUpcoming = upcomingAssignments[0] || ASSIGNMENT_SCHEDULE[0];

  // Calculate days remaining
  const getDaysRemaining = (targetDateStr) => {
    const today = new Date(todayStr);
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calendar Grid builder
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (year, monthIndex) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, monthIndex) => {
    return new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
  };

  const daysInCurrentMonth = getDaysInMonth(monthYear, selectedMonth);
  const firstDayIndex = getFirstDayOfMonth(monthYear, selectedMonth);

  // Month navigation
  const prevMonth = () => {
    if (currentMonthIdx > 0) setCurrentMonthIdx(prev => prev - 1);
  };
  const nextMonth = () => {
    if (currentMonthIdx < AVAILABLE_MONTHS.length - 1) setCurrentMonthIdx(prev => prev + 1);
  };

  // Events lookup by date string "YYYY-MM-DD"
  const getEventsForDate = (dateStr) => {
    const releases = ASSIGNMENT_SCHEDULE.filter(a => a.releaseDate === dateStr);
    const deadlines = ASSIGNMENT_SCHEDULE.filter(a => a.deadlineDate === dateStr);
    const exams = OFFICIAL_EXAMS.filter(e => e.date === dateStr);
    return { releases, deadlines, exams };
  };

  const filteredList = ASSIGNMENT_SCHEDULE.filter(item => {
    if (filterType === 'milestones') return !!item.comment;
    if (filterType === 'submitted') return !!submittedWeeks[item.week];
    if (filterType === 'pending') return !submittedWeeks[item.week];
    return true;
  });

  const activeWeekObj = ASSIGNMENT_SCHEDULE.find(a => a.week === selectedWeek) || ASSIGNMENT_SCHEDULE[0];
  const nextDays = getDaysRemaining(nextUpcoming.deadlineDate);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 animate-fadeIn">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-pink-600 hover:border-pink-300 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Back to Tasks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                <span>Assignment Due Dates & Deadlines</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                Term 3 (T3) 2026
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
              Foundation / Degree / Diploma Weekly Assignment Release Dates, Deadlines & Critical Eligibility Milestones
            </p>
          </div>
        </div>

        {/* View Switcher Toggle & WhatsApp Alerts Button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            title="Configure WhatsApp Assignment Alerts"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp Alerts</span>
            <span className="sm:hidden">WhatsApp</span>
            {whatsAppConfig?.enabled && whatsAppConfig?.phone ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-1 rounded font-bold">New</span>
            )}
          </button>

          <div className="bg-gray-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-gray-200 dark:border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm font-black'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm font-black'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Schedule Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Alerts Notification Status Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:via-slate-800/90 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center text-lg shadow-sm shrink-0">
            💬
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                WhatsApp Assignment Alerts & Deadlines
              </h4>
              {whatsAppConfig?.enabled && whatsAppConfig?.phone ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Active for {whatsAppConfig.phone}
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Setup in 1 Minute
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-600 dark:text-slate-400 mt-0.5">
              Receive automated WhatsApp alerts for content releases (every Friday) and 24 hours before deadlines.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWhatsAppModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-600/30 transition-transform whitespace-nowrap cursor-pointer self-start sm:self-auto"
        >
          <span>{whatsAppConfig?.enabled && whatsAppConfig?.phone ? '⚙️ Manage Alerts' : '⚡ Setup WhatsApp Alerts'}</span>
          <span>→</span>
        </button>
      </div>

      {/* Hero Countdown & Key Milestones Alert Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Next Urgent Deadline Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-3xl p-5 shadow-lg shadow-pink-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30">
                Next Immediate Deadline
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-1">
              {nextUpcoming.label} Assignment ({nextUpcoming.termWeek})
            </h3>
            <p className="text-xs text-pink-100 flex items-center gap-1.5 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Due: {nextUpcoming.deadlineStr}</span>
            </p>
          </div>

          <div className="relative z-10 pt-3 border-t border-white/20 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">
                {nextDays > 0 ? `${nextDays} Days Left` : 'Due Today!'}
              </div>
              <div className="text-[10px] text-pink-100">
                Release: {nextUpcoming.releaseDateStr.split(',')[1]}
              </div>
            </div>
            <button
              onClick={() => handleAddAssignmentTask(nextUpcoming)}
              className="px-3 py-1.5 rounded-xl bg-white text-pink-600 hover:bg-pink-50 active:scale-95 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* 4 Critical Milestones Highlights */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-pink-600" />
                <span>Term 3 Critical Eligibility Milestones</span>
              </span>
              <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                4 Official Gates
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Milestone 1: Week 4 OPPE 1 */}
              <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                    Week 4
                  </span>
                  <h4 className="text-xs font-black text-cyan-900 dark:text-cyan-100 mt-1">
                    OPPE 1 Closes
                  </h4>
                  <p className="text-[10px] text-cyan-700 dark:text-cyan-300 mt-0.5">
                    Sun, Nov 1, 2026
                  </p>
                </div>
              </div>

              {/* Milestone 2: Week 7 End Term */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    Week 7
                  </span>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-100 mt-1">
                    End Term Closes
                  </h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Wed, Nov 25, 2026
                  </p>
                </div>
              </div>

              {/* Milestone 3: Week 8 OPPE 2 */}
              <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-200 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
                    Week 8
                  </span>
                  <h4 className="text-xs font-black text-cyan-900 dark:text-cyan-100 mt-1">
                    OPPE 2 Closes
                  </h4>
                  <p className="text-[10px] text-cyan-700 dark:text-cyan-300 mt-0.5">
                    Sun, Nov 29, 2026
                  </p>
                </div>
              </div>

              {/* Milestone 4: Week 10 GAA */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-2.5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    Week 10
                  </span>
                  <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-100 mt-1">
                    GAA Closes
                  </h4>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Sun, Dec 13, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick submission count */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-slate-400">
              Your Submissions: <strong>{Object.values(submittedWeeks).filter(Boolean).length} of 12 Weeks Done</strong>
            </span>
            <span className="text-pink-600 dark:text-pink-400 font-bold">
              {Math.round((Object.values(submittedWeeks).filter(Boolean).length / 12) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* Official Examinations Schedule (Quiz 1, Quiz 2, End Term) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-purple-950/30 dark:to-rose-950/30 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              📝
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>Official Term 3 Examination Schedule</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                  Quiz 1 • Quiz 2 • End Term
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Mandatory in-person proctored quizzes and final comprehensive term evaluations
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800 self-start sm:self-auto">
            3 Official Exams Scheduled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {OFFICIAL_EXAMS.map(exam => {
            const daysLeft = getDaysRemaining(exam.date);
            const isSelected = selectedExam?.id === exam.id;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  exam.id === 'quiz1'
                    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 hover:border-amber-400'
                    : exam.id === 'quiz2'
                    ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800/80 hover:border-purple-400'
                    : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80 hover:border-rose-400'
                } ${isSelected ? 'ring-2 ring-pink-500 shadow-md' : 'shadow-xs'}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-gray-900 dark:text-white">
                      <span>{exam.icon}</span>
                      <span>{exam.name}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      daysLeft > 0
                        ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Today!'}
                    </span>
                  </div>

                  <div className="text-sm font-black text-gray-900 dark:text-white mb-1">
                    {exam.dateStr}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-snug mb-3">
                    {exam.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                    {exam.scope}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddExamTask(exam);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                    title={`Add ${exam.name} prep to study tasks`}
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>Prep Task</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: MONTHLY CALENDAR GRID VIEW                                        */}
      {/* ========================================================================= */}
      {viewMode === 'calendar' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Calendar Month Header & Navigation */}
          <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevMonth}
                  disabled={currentMonthIdx === 0}
                  className={`p-2 rounded-xl border border-gray-200 dark:border-slate-700 transition-all ${
                    currentMonthIdx === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95'
                  }`}
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white">
                  {activeMonthObj.label}
                </h2>
                <button
                  onClick={nextMonth}
                  disabled={currentMonthIdx === AVAILABLE_MONTHS.length - 1}
                  className={`p-2 rounded-xl border border-gray-200 dark:border-slate-700 transition-all ${
                    currentMonthIdx === AVAILABLE_MONTHS.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer active:scale-95'
                  }`}
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month Quick Tabs (October, November, December 2026, January 2027) */}
              <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800/70 p-1 rounded-2xl flex-wrap">
                {AVAILABLE_MONTHS.map((mObj, idx) => (
                  <button
                    key={mObj.label}
                    onClick={() => setCurrentMonthIdx(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentMonthIdx === idx
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-slate-300 hover:text-pink-600'
                    }`}
                  >
                    {mObj.shortLabel}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Release
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Deadline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Gate
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Exam
                </span>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-[11px] font-black uppercase text-gray-400 dark:text-slate-500">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Empty padding days for previous month */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="min-h-[85px] sm:min-h-[105px] p-1 rounded-2xl bg-gray-50/40 dark:bg-slate-800/20 border border-dashed border-gray-100 dark:border-slate-800" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateMonthStr = String(selectedMonth + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const fullDateStr = `${monthYear}-${dateMonthStr}-${dayStr}`;
                const { releases, deadlines, exams } = getEventsForDate(fullDateStr);
                const isToday = fullDateStr === todayStr;
                const hasEvents = releases.length > 0 || deadlines.length > 0 || exams.length > 0;

                return (
                  <div
                    key={dayNum}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between group ${
                      isToday
                        ? 'bg-pink-50/70 dark:bg-pink-950/30 border-pink-400 dark:border-pink-600 shadow-sm'
                        : hasEvents
                        ? 'bg-white dark:bg-slate-800/90 border-gray-200 dark:border-slate-700 hover:border-pink-300'
                        : 'bg-white dark:bg-slate-800/40 border-gray-100 dark:border-slate-800/70 opacity-90'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-pink-600 text-white shadow-sm' 
                          : 'text-gray-800 dark:text-slate-200'
                      }`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] font-black uppercase text-pink-600 dark:text-pink-400 hidden sm:inline">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Events Badge Stack */}
                    <div className="space-y-1 mt-1">
                      {/* Official Exam Event */}
                      {exams.map(exam => (
                        <div
                          key={`exam-${exam.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExam(exam);
                          }}
                          className={`rounded-lg p-1 text-[10px] font-black truncate cursor-pointer hover:scale-102 transition-transform border shadow-xs ${
                            exam.id === 'quiz1'
                              ? 'bg-amber-100 dark:bg-amber-950/90 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-600'
                              : exam.id === 'quiz2'
                              ? 'bg-purple-100 dark:bg-purple-950/90 text-purple-950 dark:text-purple-200 border-purple-400 dark:border-purple-600'
                              : 'bg-rose-100 dark:bg-rose-950/90 text-rose-950 dark:text-rose-200 border-rose-400 dark:border-rose-600'
                          }`}
                          title={`Official Exam: ${exam.name} (${exam.dateStr}) - ${exam.scope}`}
                        >
                          {exam.icon} {exam.name}
                        </div>
                      ))}

                      {/* Release Event */}
                      {releases.map(item => (
                        <div
                          key={`rel-${item.week}`}
                          onClick={() => setSelectedWeek(item.week)}
                          className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg p-1 text-[10px] font-black truncate cursor-pointer hover:scale-102 transition-transform"
                          title={`Content Released: ${item.label}`}
                        >
                          🟢 {item.label} Released
                        </div>
                      ))}

                      {/* Deadline Event */}
                      {deadlines.map(item => (
                        <div
                          key={`ddl-${item.week}`}
                          onClick={() => setSelectedWeek(item.week)}
                          className={`rounded-lg p-1 text-[10px] font-black truncate cursor-pointer hover:scale-102 transition-transform border ${
                            item.comment
                              ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border-cyan-400 dark:border-cyan-700'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
                          }`}
                          title={`Due Date: ${item.label} (${item.comment || 'Assignment Due'})`}
                        >
                          🔴 {item.label} Due
                          {item.comment && ` • ${item.comment.split(' ')[0]}`}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Exam Inspector Card */}
          {selectedExam && (
            <div className={`border-2 rounded-3xl p-5 sm:p-6 shadow-sm animate-fadeIn ${
              selectedExam.id === 'quiz1'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                : selectedExam.id === 'quiz2'
                ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xl">{selectedExam.icon}</span>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {selectedExam.name}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700">
                      Official Exam
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                      {getDaysRemaining(selectedExam.date) > 0 ? `${getDaysRemaining(selectedExam.date)} Days Left` : 'Exam Today!'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                    {selectedExam.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 dark:text-slate-300">
                    <span>
                      <strong>Date:</strong> {selectedExam.dateStr}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Scope:</strong> {selectedExam.scope}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddExamTask(selectedExam)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md shadow-pink-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Prep Task</span>
                  </button>
                  <button
                    onClick={() => setSelectedExam(null)}
                    className="px-3 py-2 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-100 text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Week Inspector Card */}
          {activeWeekObj && (
            <div className="bg-gradient-to-r from-pink-50/70 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-pink-950/20 border-2 border-pink-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300">
                      {activeWeekObj.termWeek}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {activeWeekObj.label} Assignment Details
                    </h3>
                    {activeWeekObj.comment && (
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
                        ⚠️ {activeWeekObj.comment}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <strong className="text-emerald-600">Release:</strong> {activeWeekObj.releaseDateStr}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <strong className="text-rose-600">Deadline:</strong> {activeWeekObj.deadlineStr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubmission(activeWeekObj.week)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer ${
                      submittedWeeks[activeWeekObj.week]
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                        : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submittedWeeks[activeWeekObj.week] ? 'Submitted ✓' : 'Mark Submitted'}</span>
                  </button>
                  <button
                    onClick={() => handleAddAssignmentTask(activeWeekObj)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md shadow-pink-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add to Study Tasks</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: TABLE & LIST VIEW                                                 */
        /* ========================================================================= */
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All 12 Weeks' },
                { id: 'milestones', label: 'Milestones (OPPE & End Term)' },
                { id: 'pending', label: 'Pending' },
                { id: 'submitted', label: 'Submitted' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    filterType === f.id
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-pink-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-gray-500 self-end sm:self-auto">
              Showing {filteredList.length} of 12 Assignments
            </span>
          </div>

          {/* Official Exams Table */}
          <div className="bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50 to-rose-50 dark:from-amber-950/40 dark:to-rose-950/40 border-b border-amber-200 dark:border-amber-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                  Official Term 3 Exams (Quiz 1, Quiz 2, End Term)
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                Official Assessments
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/50 dark:bg-slate-800/40 text-gray-600 dark:text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-gray-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Exam Name</th>
                    <th className="py-3 px-4">Official Date</th>
                    <th className="py-3 px-4">Syllabus Scope</th>
                    <th className="py-3 px-4">Countdown</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {OFFICIAL_EXAMS.map(exam => {
                    const daysLeft = getDaysRemaining(exam.date);
                    return (
                      <tr key={exam.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-black text-gray-900 dark:text-white whitespace-nowrap">
                          <span className="mr-1.5">{exam.icon}</span>
                          <span>{exam.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800 dark:text-slate-200 whitespace-nowrap">
                          {exam.dateStr}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-400 font-medium">
                          {exam.scope}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-pink-600 whitespace-nowrap">
                          {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Exam Today!' : 'Completed'}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleAddExamTask(exam)}
                            className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 transition-all font-bold text-xs inline-flex items-center gap-1 active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Prep Task</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-800/80 text-gray-700 dark:text-slate-300 uppercase font-black tracking-wider text-[11px] border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3.5 px-4">Term Week</th>
                    <th className="py-3.5 px-4">Content Release</th>
                    <th className="py-3.5 px-4">Foundation / Degree / Diploma Deadline</th>
                    <th className="py-3.5 px-4">Comments / Eligibility Gate</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredList.map(item => {
                    const isSubmitted = !!submittedWeeks[item.week];
                    const daysLeft = getDaysRemaining(item.deadlineDate);

                    return (
                      <tr 
                        key={item.week}
                        className={`hover:bg-pink-50/40 dark:hover:bg-slate-800/50 transition-colors ${
                          item.type === 'milestone_cyan' ? 'bg-cyan-50/30 dark:bg-cyan-950/10' :
                          item.type === 'milestone_green' ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        {/* Week Column */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-black text-xs flex items-center justify-center">
                              {item.week}
                            </span>
                            <div>
                              <div className="font-black text-gray-900 dark:text-white">
                                {item.label}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                {item.termWeek}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Content Release */}
                        <td className="py-3.5 px-4 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <span className="text-emerald-500 font-bold">🟢</span>
                            <span>{item.releaseDateStr}</span>
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                            <span className="text-rose-500 font-bold">🔴</span>
                            <span>{item.deadlineStr}</span>
                          </div>
                          <div className="text-[10px] font-bold text-pink-600 pl-4">
                            {daysLeft > 0 ? `${daysLeft} days remaining` : daysLeft === 0 ? 'Due Today!' : 'Past Due'}
                          </div>
                        </td>

                        {/* Comments / Milestones */}
                        <td className="py-3.5 px-4">
                          {item.comment ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-black text-[11px] ${
                              item.type === 'milestone_cyan'
                                ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700'
                                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                            }`}>
                              <AlertTriangle className="w-3 h-3" />
                              <span>{item.comment}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Status Checkbox */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => toggleSubmission(item.week)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              isSubmitted
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 border border-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{isSubmitted ? 'Submitted' : 'Pending'}</span>
                          </button>
                        </td>

                        {/* Action: Add to Tasks */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleAddAssignmentTask(item)}
                            className="p-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800 transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1 text-xs font-bold"
                            title="Add to daily tasks"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Task</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Alerts Configuration Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => {
          setIsWhatsAppModalOpen(false);
          checkWhatsAppStatus();
        }}
        showToast={showToast}
      />

    </div>
  );
}
