import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, AlertCircle, Tag, AlignLeft, Plus, Check } from 'lucide-react';
import { SUBJECT_OPTIONS } from '../data/initialData';
import { createSubject } from '../api';

const EMOJI_OPTIONS = ['💻', '📚', '🗄️', '⚙️', '🧠', '📐', '🔬', '🎯', '🚀', '🤖', '📝', '💡'];

export default function TaskFormModal({ isOpen, onClose, onSaveTask, editingTask, selectedDate, availableSubjects, onSubjectAdded }) {
  const subjectList = availableSubjects && availableSubjects.length > 0 ? availableSubjects : SUBJECT_OPTIONS;

  const [subject, setSubject] = useState(subjectList[0]?.name || 'MAD 1 Project');
  const [topic, setTopic] = useState('');
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [targetDate, setTargetDate] = useState(selectedDate);

  // New subject state
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('📚');
  const [subjectError, setSubjectError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setSubject(editingTask.subject);
      setTopic(editingTask.topic);

      if (editingTask.durationHours !== undefined || editingTask.durationSeconds !== undefined) {
        setDurationHours(Number(editingTask.durationHours) || 0);
        setDurationMinutes(Number(editingTask.durationMinutes) || 0);
        setDurationSeconds(Number(editingTask.durationSeconds) || 0);
      } else {
        const totalMins = Number(editingTask.durationMinutes) || 0;
        setDurationHours(Math.floor(totalMins / 60));
        setDurationMinutes(Math.floor(totalMins % 60));
        setDurationSeconds(0);
      }

      setPriority(editingTask.priority || 'Medium');
      setNotes(editingTask.notes || '');
      setTargetDate(editingTask.date);
    } else {
      setSubject(subjectList[0]?.name || 'MAD 1 Project');
      setTopic('');
      setDurationHours(0);
      setDurationMinutes(45);
      setDurationSeconds(0);
      setPriority('Medium');
      setNotes('');
      setTargetDate(selectedDate);
    }
    setIsAddingNewSubject(false);
    setNewSubjectName('');
    setSubjectError('');
  }, [editingTask, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleAddNewSubjectSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newSubjectName.trim()) {
      setSubjectError('Subject name is required');
      return;
    }

    try {
      const created = await createSubject({
        name: newSubjectName.trim(),
        icon: newSubjectIcon
      });

      if (onSubjectAdded) {
        onSubjectAdded(created);
      }

      // Automatically select the new subject
      setSubject(created.name);
      setIsAddingNewSubject(false);
      setNewSubjectName('');
      setSubjectError('');
    } catch (err) {
      console.error('Failed to create subject:', err);
      setSubjectError('Failed to create subject');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const hrs = Math.max(0, Number(durationHours) || 0);
    const mins = Math.max(0, Number(durationMinutes) || 0);
    const secs = Math.max(0, Number(durationSeconds) || 0);

    const computedTotalMins = Math.round(((hrs * 60) + mins + (secs / 60)) * 100) / 100;

    onSaveTask({
      id: editingTask ? editingTask.id : Date.now().toString(),
      date: targetDate,
      subject,
      topic: topic.trim(),
      durationHours: hrs,
      durationMinutes: mins,
      durationSeconds: secs,
      totalMinutes: computedTotalMins > 0 ? computedTotalMins : 1,
      priority,
      completed: editingTask ? editingTask.completed : false,
      completedAt: editingTask ? editingTask.completedAt : null,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 sticky top-0 z-10">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            {editingTask ? 'Edit Study Topic' : 'Add New Study Topic'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              What to study? (Topic / Chapter) *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Complete Flask CRUD operations for MAD 1 Project"
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-sm font-medium"
            />
          </div>

          {/* Subject & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Subject Dropdown & Add New Subject Button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Subject
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewSubject(!isAddingNewSubject)}
                  className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 font-bold flex items-center gap-0.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewSubject ? 'Cancel' : 'New Subject'}</span>
                </button>
              </div>

              {/* Add New Subject Mini Form */}
              {isAddingNewSubject ? (
                <div className="p-3 bg-pink-50/70 dark:bg-pink-950/30 border border-pink-300 dark:border-pink-800 rounded-xl space-y-2 mb-2 animate-fadeIn">
                  <p className="text-xs font-bold text-pink-800 dark:text-pink-300">Add New Subject</p>
                  
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => { setNewSubjectName(e.target.value); setSubjectError(''); }}
                    placeholder="Enter subject name (e.g. Python, Math)..."
                    className="w-full bg-white dark:bg-slate-900 border border-pink-300 dark:border-pink-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                    autoFocus
                  />
                  {subjectError && <p className="text-[10px] text-red-500 font-semibold">{subjectError}</p>}

                  {/* Quick Emoji Picker */}
                  <div>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-1">Choose icon:</span>
                    <div className="flex flex-wrap gap-1">
                      {EMOJI_OPTIONS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setNewSubjectIcon(em)}
                          className={`w-6 h-6 rounded-md text-xs flex items-center justify-center border transition-all ${
                            newSubjectIcon === em
                              ? 'bg-pink-600 text-white border-pink-600 scale-110'
                              : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-pink-400'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewSubject(false)}
                      className="px-2.5 py-1 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewSubjectSubmit}
                      className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      ✓ Add Subject
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={subject}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setIsAddingNewSubject(true);
                    } else {
                      setSubject(e.target.value);
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2.5 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-pink-500 transition-all cursor-pointer font-medium"
                >
                  {subjectList.map((sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                  <option value="__add_new__" className="text-pink-600 font-bold">
                    ➕ + Add New Subject...
                  </option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-pink-500 font-medium"
              />
            </div>
          </div>

          {/* Duration: Hours, Minutes, Seconds */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Duration (Hours, Minutes, Seconds)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Hours */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 focus-within:border-pink-500">
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none font-medium"
                />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold shrink-0">hr</span>
              </div>

              {/* Minutes */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 focus-within:border-pink-500">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none font-medium"
                />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold shrink-0">min</span>
              </div>

              {/* Seconds */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-3 py-2 focus-within:border-pink-500">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none font-medium"
                />
                <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold shrink-0">sec</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">
              Enter hours (hr), minutes (min), and seconds (sec) separately
            </p>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Priority
            </label>
            <div className="flex items-center gap-2 pt-0.5">
              {['Low', 'Medium', 'High'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    priority === p
                      ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" /> Additional Notes (optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. NCERT Book Page 45-50, solve 10 questions..."
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-300 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium transition-colors border border-gray-300 dark:border-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold shadow-md shadow-pink-600/20 transition-all border border-pink-600"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
