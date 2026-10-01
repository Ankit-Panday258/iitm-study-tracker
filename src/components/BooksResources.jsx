import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ExternalLink, Copy, Check, ChevronDown, ChevronUp, 
  Folder, Plus, Trash2, Globe, Sparkles 
} from 'lucide-react';

const STORAGE_KEY = 'iitm_study_resources_v1';

export const SYSTEM_COMMANDS_DRIVE_URL = 'https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv';

const INITIAL_RESOURCES = [
  {
    id: 'res_sys_cmd',
    subject: 'System Commands',
    title: 'System Commands - Google Drive Book & Study Materials',
    description: 'Official IIT Madras Google Drive folder containing reference books, lecture slides, bash scripts & command cheat-sheets.',
    url: SYSTEM_COMMANDS_DRIVE_URL,
    type: 'Google Drive',
    badge: 'Drive Folder',
    icon: '⚙️',
    isPrimary: true
  },
  {
    id: 'res_mad1',
    subject: 'MAD 1 Project',
    title: 'MAD 1 Project - Flask & Architecture Guide',
    description: 'Modern Application Development 1 documentation, CRUD patterns, Jinja2 templates, and SQLite database schemas.',
    url: '',
    type: 'Course Guide',
    badge: 'Study Docs',
    icon: '💻',
    isPrimary: false
  },
  {
    id: 'res_dbms',
    subject: 'DBMS',
    title: 'DBMS - Relational Models & SQL Reference',
    description: 'Database Management Systems notes covering Normalization (1NF, 2NF, 3NF, BCNF), indexing, and SQL queries.',
    url: '',
    type: 'Course Guide',
    badge: 'Study Docs',
    icon: '🗄️',
    isPrimary: false
  }
];

export default function BooksResources() {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Guarantee System Commands drive URL is updated
          return parsed.map(r => r.id === 'res_sys_cmd' ? { ...r, url: SYSTEM_COMMANDS_DRIVE_URL } : r);
        }
      }
    } catch (e) {}
    return INITIAL_RESOURCES;
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubject, setNewSubject] = useState('System Commands');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    } catch (e) {}
  }, [resources]);

  const handleCopyLink = (resId, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(resId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newRes = {
      id: 'res_' + Date.now(),
      subject: newSubject,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom study resource link.',
      url: newUrl.trim(),
      type: 'Google Drive',
      badge: 'User Link',
      icon: newSubject === 'System Commands' ? '⚙️' : newSubject === 'MAD 1 Project' ? '💻' : '📚',
      isPrimary: false
    };

    setResources(prev => [newRes, ...prev]);
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setIsAddingNew(false);
  };

  const handleDeleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div id="books-resources-section" className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 shadow-sm transition-all duration-200">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center border border-pink-200 dark:border-pink-800 shadow-inner shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight">
                Books & Study Resources
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                {resources.length} Available
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400">
              Access Google Drive study books, lecture slides, and notes for IIT Madras courses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 text-xs font-semibold transition-all active:scale-95"
            title="Add New Resource Link"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Link</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition-all"
            title={isOpen ? 'Collapse Section' : 'Expand Section'}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/80 space-y-3">
          
          {/* Add New Resource Form */}
          {isAddingNew && (
            <form onSubmit={handleAddResource} className="p-3.5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 mb-3 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-700 dark:text-pink-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Add Study Resource / Google Drive Link
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 font-bold"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 dark:text-slate-200 focus:outline-none focus:border-pink-500"
                  >
                    <option value="System Commands">⚙️ System Commands</option>
                    <option value="MAD 1 Project">💻 MAD 1 Project</option>
                    <option value="DBMS">🗄️ DBMS</option>
                    <option value="General Study">📚 General Study</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. System Commands Lecture Notes"
                    className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Google Drive URL / Web Link *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Short Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Reference PDF books and practical examples"
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm shadow-pink-600/30 transition-all active:scale-95"
                >
                  Save Resource
                </button>
              </div>
            </form>
          )}

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resources.map((item) => {
              const hasUrl = Boolean(item.url && item.url.trim().length > 0);
              const isSysCommands = item.subject === 'System Commands';

              return (
                <div
                  key={item.id}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSysCommands
                      ? 'bg-pink-50/40 dark:bg-pink-950/20 border-pink-300 dark:border-pink-800/80 shadow-sm ring-1 ring-pink-400/30'
                      : 'bg-white dark:bg-slate-800/70 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div>
                    {/* Top Row: Subject & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                          {item.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isSysCommands
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-600'
                        }`}>
                          {item.badge}
                        </span>

                        {!item.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(item.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-lg"
                            title="Delete custom resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1">
                      {item.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                    {hasUrl ? (
                      <>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-pink-600/25 transition-all"
                        >
                          <Folder className="w-3.5 h-3.5" />
                          <span>Open Google Drive</span>
                          <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleCopyLink(item.id, item.url)}
                          className="p-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 transition-all active:scale-95"
                          title="Copy Link to Clipboard"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-pink-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between text-xs text-gray-400 dark:text-slate-500">
                        <span>Drive link not configured</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNew(true);
                            setNewSubject(item.subject);
                            setNewTitle(`${item.subject} Study Folder`);
                          }}
                          className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
                        >
                          + Set Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-pink-500" />
              System Commands Google Drive folder is synced and accessible directly with 1 click.
            </span>
            <a
              href={SYSTEM_COMMANDS_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 font-bold hover:underline shrink-0"
            >
              Open Drive ↗
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
