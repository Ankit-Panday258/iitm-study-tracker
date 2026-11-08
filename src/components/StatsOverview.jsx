import React from 'react';
import { CheckCircle2, Clock, Target, Sparkles } from 'lucide-react';
import { getTotalDurationSeconds, formatTotalTime, getLocalDateString } from '../utils/formatTime';

export default function StatsOverview({ tasks, selectedDate }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSecondsCompleted = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + getTotalDurationSeconds(t), 0);

  const isToday = selectedDate === getLocalDateString();

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 mb-6 shadow-lg shadow-indigo-950/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Progress info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {isToday ? "Today's Study Progress" : `Study Progress (${selectedDate})`}
                {percent === 100 && totalTasks > 0 && (
                  <span className="text-xs font-semibold bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-300" /> Goal Complete!
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {completedTasks} / {totalTasks} topics completed ({percent}%)
              </p>
            </div>
            <span className="text-4xl font-black text-indigo-600 dark:text-indigo-300">{percent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-slate-600">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-indigo-600 dark:bg-indigo-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:w-auto">
          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-0">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-300 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{completedTasks}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Completed</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-0">
            <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatTotalTime(totalSecondsCompleted)}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Study Time</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-0">
            <Target className="w-5 h-5 text-gray-500 dark:text-indigo-300 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{totalTasks - completedTasks}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Remaining</span>
          </div>
        </div>

      </div>
    </div>
  );
}
