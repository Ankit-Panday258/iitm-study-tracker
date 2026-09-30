import React from 'react';
import { Check, Trash2, Edit2, Clock, Play, FileText } from 'lucide-react';
import { SUBJECT_OPTIONS } from '../data/initialData';
import { formatTaskDuration } from '../utils/formatTime';

export default function TaskItem({ 
  task, 
  onToggle, 
  onToggleTask, 
  onDelete, 
  onDeleteTask, 
  onEdit, 
  onEditTask, 
  onStartTimer 
}) {
  const subjectConfig = SUBJECT_OPTIONS.find(s => s.name === task.subject) || SUBJECT_OPTIONS[SUBJECT_OPTIONS.length - 1];

  const handleToggle = () => {
    const fn = onToggle || onToggleTask;
    if (typeof fn === 'function') fn(task.id);
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    const fn = onDelete || onDeleteTask;
    if (typeof fn === 'function') fn(task.id);
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    const fn = onEdit || onEditTask;
    if (typeof fn === 'function') fn(task);
  };

  const handleStartTimer = (e) => {
    e?.stopPropagation();
    if (typeof onStartTimer === 'function') onStartTimer(task);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'High':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-600 text-white border border-pink-600">High</span>;
      case 'Medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700">Medium</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600">Low</span>;
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border p-4 transition-all duration-200 select-none ${
        task.completed
          ? 'bg-gray-50 dark:bg-slate-900/60 border-gray-300 dark:border-slate-700 opacity-80'
          : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 shadow-sm hover:border-pink-400 dark:hover:border-slate-500'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Checkbox (Pink tick mark) */}
        <button
          type="button"
          onClick={handleToggle}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 border shrink-0 cursor-pointer active:scale-90 ${
            task.completed
              ? 'bg-pink-600 border-pink-600 text-white shadow-sm shadow-pink-600/30'
              : 'border-gray-400 dark:border-slate-500 bg-white dark:bg-slate-800 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-transparent'
          }`}
          title={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        >
          <Check className={`w-4 h-4 stroke-[3] ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0" onClick={handleToggle} role="button" tabIndex={0}>
          
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${subjectConfig.color}`}>
              <span>{subjectConfig.icon}</span>
              <span>{task.subject}</span>
            </span>
            {getPriorityBadge(task.priority)}
            <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-400 dark:text-slate-500" />
              <span>{formatTaskDuration(task)}</span>
            </span>
          </div>

          {/* Topic Title */}
          <h4
            className={`text-base font-semibold leading-snug break-words transition-all ${
              task.completed ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-white'
            }`}
          >
            {task.topic}
          </h4>

          {/* Notes */}
          {task.notes && (
            <div className="mt-2 text-xs text-gray-600 dark:text-slate-400 bg-gray-50 dark:bg-slate-900/60 rounded-lg p-2.5 border border-gray-200 dark:border-slate-700 flex items-start gap-1.5">
              <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <p className="line-clamp-2">{task.notes}</p>
            </div>
          )}

          {/* Completed label */}
          {task.completed && (
            <p className="mt-1.5 text-[11px] text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
              ✓ Completed today
            </p>
          )}

        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          
          {/* Start Timer (Pink) */}
          {!task.completed && (
            <button
              type="button"
              onClick={handleStartTimer}
              className="p-2 rounded-xl text-white bg-pink-600 hover:bg-pink-700 active:scale-95 border border-pink-600 transition-all shadow-sm shadow-pink-600/20 cursor-pointer"
              title="Start Study Timer"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          )}

          {/* Edit */}
          <button
            type="button"
            onClick={handleEdit}
            className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 border border-transparent hover:border-gray-300 dark:hover:border-slate-600 transition-all cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl text-gray-400 dark:text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 active:scale-95 border border-transparent hover:border-pink-200 dark:hover:border-pink-800 transition-all cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
}
