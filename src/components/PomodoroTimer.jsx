import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Clock, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTotalDurationSeconds } from '../utils/formatTime';

export default function PomodoroTimer({ activeTask, onClose, onCompleteTask }) {
  const getSeconds = () => {
    if (!activeTask) return 25 * 60;
    const s = getTotalDurationSeconds(activeTask);
    return s > 0 ? s : 25 * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [initialDuration, setInitialDuration] = useState(getSeconds);

  useEffect(() => {
    const s = getSeconds();
    setTimeLeft(s);
    setInitialDuration(s);
    setIsRunning(false);
  }, [activeTask]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {
        console.log(e);
      }
      if (activeTask) {
        onCompleteTask(activeTask.id);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, activeTask, onCompleteTask]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialDuration);
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = initialDuration > 0
    ? Math.round(((initialDuration - timeLeft) / initialDuration) * 100)
    : 0;

  if (!activeTask) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl shadow-xl p-5 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Focus Timer</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Task Name */}
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-3" title={activeTask.topic}>
        📖 {activeTask.topic}
      </p>

      {/* Timer Display */}
      <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-300 dark:border-slate-700 text-center mb-4">
        <div className="text-4xl font-black font-mono text-gray-900 dark:text-white tracking-wider">
          {formatTime(timeLeft)}
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden border border-gray-300 dark:border-slate-600">
          <div
            className="h-full bg-pink-600 dark:bg-pink-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${
            isRunning
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600'
              : 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600 shadow-md shadow-pink-600/20'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => onCompleteTask(activeTask.id)}
          className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700 transition-colors"
          title="Mark Complete"
        >
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
