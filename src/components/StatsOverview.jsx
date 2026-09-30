import React from 'react';
import { CheckCircle2, Clock, Target, Sparkles } from 'lucide-react';
import { getTotalDurationSeconds, formatTotalTime } from '../utils/formatTime';

export default function StatsOverview({ tasks, selectedDate }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSecondsCompleted = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + getTotalDurationSeconds(t), 0);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Progress info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {isToday ? "Today's Study Progress" : `Study Progress (${selectedDate})`}
                {percent === 100 && totalTasks > 0 && (
                  <span className="text-xs font-semibold bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-600 dark:text-pink-400" /> Goal Complete!
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {completedTasks} / {totalTasks} topics completed ({percent}%)
              </p>
            </div>
            <span className="text-2xl font-black text-pink-600 dark:text-pink-400">{percent}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden p-0.5 border border-gray-300 dark:border-slate-600">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out bg-pink-600 dark:bg-pink-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:w-auto">
          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-[90px]">
            <CheckCircle2 className="w-5 h-5 text-pink-600 dark:text-pink-400 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{completedTasks}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Completed</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-[90px]">
            <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatTotalTime(totalSecondsCompleted)}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Study Time</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center text-center min-w-[90px]">
            <Target className="w-5 h-5 text-pink-500 dark:text-pink-400 mb-1" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">{totalTasks - completedTasks}</span>
            <span className="text-[11px] text-gray-500 dark:text-slate-400">Remaining</span>
          </div>
        </div>

      </div>
    </div>
  );
}
