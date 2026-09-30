import React, { useState, useEffect } from 'react';
import { 
  Trophy, Clock, CheckCircle2, ArrowLeft, Star, Award, BookOpen, 
  Calendar, Sparkles, FileText, Check, X, Heart, Eye, Flame, Layers
} from 'lucide-react';
import { fetchDailyTrack } from '../api';
import { SUBJECT_OPTIONS } from '../data/initialData';
import { formatTaskDuration } from '../utils/formatTime';

const STICKER_ICONS = ['🏆', '⭐', '🎯', '🔥', '🌟', '🚀', '💪', '👑'];

function getSubjectConfig(subjectName) {
  return SUBJECT_OPTIONS.find(s => s.name === subjectName) || SUBJECT_OPTIONS[SUBJECT_OPTIONS.length - 1];
}

function formatDate(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatFullDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatHours(mins) {
  const hrs = Math.floor(mins / 60);
  const m = mins % 60;
  if (hrs === 0) return `${m}m`;
  if (m === 0) return `${hrs}h`;
  return `${hrs}h ${m}m`;
}

// ─── INSTAGRAM-STYLE COMPACT DAILY STICKER TILE ───────────────
function InstagramStyleStickerCard({ dayData, index, onClick }) {
  const emoji = STICKER_ICONS[index % STICKER_ICONS.length];
  const subjectsStudied = Array.from(new Set(dayData.tasks.map(t => t.subject)));

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 border-2 border-pink-400 dark:border-pink-600 rounded-3xl p-4 shadow-md hover:shadow-2xl hover:border-pink-500 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden aspect-[4/5] sm:aspect-square"
    >
      {/* Top washi tape sticker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-pink-200 dark:bg-pink-800/80 rounded-b-lg border-x border-b border-pink-300 dark:border-pink-700 flex items-center justify-center z-10">
        <div className="w-8 h-0.5 bg-pink-300 dark:bg-pink-600 rounded-full opacity-70" />
      </div>

      {/* Top row: Date badge & icon */}
      <div className="flex items-center justify-between mt-2 z-10">
        <span className="px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-[11px] font-bold flex items-center gap-1">
          <Calendar className="w-3 h-3 text-pink-600 dark:text-pink-400" />
          {formatDate(dayData.date)}
        </span>

        <span className="text-xl filter drop-shadow-sm group-hover:scale-125 transition-transform duration-300">
          {emoji}
        </span>
      </div>

      {/* Center visual: Achievement badge */}
      <div className="my-auto text-center flex flex-col items-center justify-center py-2">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-pink-500/20 via-pink-400/10 to-transparent border border-pink-300/60 dark:border-pink-600/40 flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <span className="text-3xl sm:text-4xl filter drop-shadow select-none">
            {emoji}
          </span>
        </div>

        <h4 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white truncate max-w-[90%]">
          {dayData.tasks[0]?.topic || 'Study Session'}
        </h4>

        {dayData.tasks.length > 1 && (
          <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold mt-0.5">
            +{dayData.tasks.length - 1} more topics
          </p>
        )}
      </div>

      {/* Bottom stats row (Instagram like/comment style: Heart & Clock) */}
      <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-3">
          {/* Topics count pill */}
          <span className="flex items-center gap-1 font-bold text-gray-700 dark:text-slate-200" title="Completed Topics">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>{dayData.completedCount}</span>
          </span>

          {/* Time spent pill */}
          <span className="flex items-center gap-1 font-semibold text-gray-500 dark:text-slate-400" title="Study Time">
            <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <span>{formatHours(dayData.totalMinutes)}</span>
          </span>
        </div>

        {/* Click hint pill */}
        <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800 opacity-90 group-hover:opacity-100">
          View
        </span>
      </div>

      {/* Hover overlay hint */}
      <div className="absolute inset-0 bg-pink-900/10 dark:bg-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
    </div>
  );
}

// ─── INSTAGRAM POST DETAIL MODAL (Click to View) ───────────
function StickerDetailModal({ dayData, onClose }) {
  if (!dayData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 dark:bg-slate-950/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border-2 border-pink-400 dark:border-pink-600 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleUp p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top washi tape */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-pink-200 dark:bg-pink-800/80 rounded-b-lg border-x border-b border-pink-300 dark:border-pink-700 flex items-center justify-center">
          <div className="w-12 h-0.5 bg-pink-300 dark:bg-pink-600 rounded-full opacity-70" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mt-2 mb-5 border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-pink-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
              24h Daily Sticker
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              {dayData.date}
            </span>
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {formatFullDate(dayData.date)}
          </h2>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2.5 mt-3">
            <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              {dayData.completedCount} Topics Done
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {formatHours(dayData.totalMinutes)} Studied
            </span>
          </div>
        </div>

        {/* 24-Hour Topics Checklist */}
        <div className="space-y-2.5 mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            Completed Topics (24-Hour Study Log)
          </p>

          <div className="space-y-2">
            {dayData.tasks.map((task, idx) => {
              const subjectConfig = getSubjectConfig(task.subject);
              return (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/80"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${subjectConfig.color}`}>
                          {subjectConfig.icon} {task.subject}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-slate-400">
                          {formatTaskDuration(task)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                        {task.topic}
                      </h4>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 shrink-0">
                    ✓ Done
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Note if present */}
        {dayData.dailyNote && (
          <div className="mb-5 p-3.5 rounded-2xl bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Daily Summary / Learning Note</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-slate-200 font-medium leading-relaxed">
              "{dayData.dailyNote}"
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 text-xs">
          <span className="flex items-center gap-1.5 text-pink-700 dark:text-pink-300 font-bold">
            <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            IIT Madras Verified Day Streak
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── MAIN DAILY TRACK COMPONENT ──────────────────────────────
export default function DailyTrack({ onBack }) {
  const [trackData, setTrackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    loadTrackData();
  }, []);

  const loadTrackData = async () => {
    try {
      setLoading(true);
      const data = await fetchDailyTrack();
      setTrackData(data);
    } catch (err) {
      console.error('Failed to load daily track:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = trackData.length;
  const totalCompleted = trackData.reduce((acc, d) => acc + d.completedCount, 0);
  const totalMinutes = trackData.reduce((acc, d) => acc + d.totalMinutes, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700 sticky top-0 z-30 px-4 lg:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all shadow-sm"
              title="Go back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                Daily Track Gallery
              </h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Instagram grid style daily stickers • Click any card to view full details
              </p>
            </div>
          </div>

          {/* Overall summary stats */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300 text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>{totalDays} Stickers</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>{formatHours(totalMinutes)} Total</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 pb-28">

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-3 border border-pink-200 dark:border-pink-700 animate-pulse">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Loading daily stickers...</p>
          </div>
        ) : trackData.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-4 border border-pink-200 dark:border-pink-700">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No daily stickers yet!</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
              Complete any study topic today and check the tick mark (✓). Your daily sticker will appear here automatically!
            </p>
          </div>
        ) : (
          <div>
            {/* Gallery Info Bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                Daily Stickers Gallery (Click any sticker to view 24h details)
              </p>
              <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                {totalCompleted} total topics completed
              </span>
            </div>

            {/* INSTAGRAM-STYLE COMPACT GRID (4 COLUMNS) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {trackData.map((dayData, idx) => (
                <InstagramStyleStickerCard
                  key={dayData.date}
                  dayData={dayData}
                  index={idx}
                  onClick={() => setSelectedSticker(dayData)}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* POPUP MODAL ON CLICK */}
      {selectedSticker && (
        <StickerDetailModal
          dayData={selectedSticker}
          onClose={() => setSelectedSticker(null)}
        />
      )}

    </div>
  );
}
