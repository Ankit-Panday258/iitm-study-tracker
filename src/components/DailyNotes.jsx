import React, { useState, useEffect } from 'react';
import { PenTool, Save, Check } from 'lucide-react';
import { fetchNote, saveNote as saveNoteAPI } from '../api';

export default function DailyNotes({ selectedDate }) {
  const [noteText, setNoteText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadNote();
  }, [selectedDate]);

  const loadNote = async () => {
    try {
      const data = await fetchNote(selectedDate);
      setNoteText(data.noteText || '');
      setSaved(false);
    } catch (err) {
      console.error('Failed to load note:', err);
      setNoteText('');
    }
  };

  const handleSave = async () => {
    try {
      await saveNoteAPI(selectedDate, noteText);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <PenTool className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          Today's Summary / Key Learnings
        </h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white border border-pink-600 rounded-xl text-xs font-semibold shadow-sm shadow-pink-600/20 transition-all active:scale-95"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </>
          )}
        </button>
      </div>

      <textarea
        rows="3"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="What did you learn today? Key points, formulas, or what's pending for tomorrow..."
        className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl p-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500 transition-all font-medium"
      />
    </div>
  );
}
