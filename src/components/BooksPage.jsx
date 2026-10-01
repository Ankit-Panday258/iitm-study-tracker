import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ExternalLink, Copy, Check, ArrowLeft, Plus, 
  Trash2, Folder, Sparkles, Search, FileText, Download 
} from 'lucide-react';

export const SYSTEM_COMMANDS_DRIVE_URL = 'https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv';
const STORAGE_KEY_BOOKS = 'iitm_study_books_library_v1';

const INITIAL_BOOKS = [
  {
    id: 'book_sys_cmd',
    subject: 'System Commands',
    title: 'System Commands - IIT Madras Official Book & Lab Materials',
    subtitle: 'Linux, Shell Scripting & System Commands Reference',
    description: 'Direct Google Drive folder containing official reference textbooks, lecture presentation slides, bash shell scripts, and command cheat-sheets for IITM System Commands course.',
    driveUrl: SYSTEM_COMMANDS_DRIVE_URL,
    badge: 'Official Google Drive',
    icon: '⚙️',
    isPrimary: true,
    modules: [
      'Linux Terminal & File System Architecture',
      'Text Streams & Filtering (grep, sed, awk, cut)',
      'Bash Shell Scripting (loops, functions, logic)',
      'Process Management & Permissions (chmod, ps, kill)'
    ]
  },
  {
    id: 'book_mad1',
    subject: 'MAD 1 Project',
    title: 'MAD 1 - Modern Application Development 1 Handbook',
    subtitle: 'Python, Flask Backend & SQLite Architecture',
    description: 'Comprehensive guide to building full-stack web applications with Flask, Jinja2 templates, REST APIs, and database modeling.',
    driveUrl: '',
    badge: 'Course Handbook',
    icon: '💻',
    isPrimary: false,
    modules: [
      'Flask Routing & Jinja Templating',
      'SQLite & SQLAlchemy Database Integration',
      'User Authentication & Session Management',
      'CRUD Operations & Frontend Styling'
    ]
  },
  {
    id: 'book_dbms',
    subject: 'DBMS',
    title: 'DBMS - Database Systems Theory & Query Practice',
    subtitle: 'Relational Models, Normalization & SQL Queries',
    description: 'Reference book notes covering Entity-Relationship models, relational algebra, SQL optimization, and functional dependencies (1NF, 2NF, 3NF, BCNF).',
    driveUrl: '',
    badge: 'Study Material',
    icon: '🗄️',
    isPrimary: false,
    modules: [
      'Relational Algebra & Tuple Calculus',
      'Schema Normalization (1NF, 2NF, 3NF, BCNF)',
      'Advanced SQL Joins, Subqueries & Aggregations',
      'Transaction Processing & ACID Properties'
    ]
  }
];

export default function BooksPage({ onBack }) {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(b => b.id === 'book_sys_cmd' ? { ...b, driveUrl: SYSTEM_COMMANDS_DRIVE_URL } : b);
        }
      }
    } catch (e) {}
    return INITIAL_BOOKS;
  });

  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newSubject, setNewSubject] = useState('System Commands');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    } catch (e) {}
  }, [books]);

  const handleCopyLink = (id, url) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleAddBook = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const newBook = {
      id: 'book_' + Date.now(),
      subject: newSubject,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || `${newSubject} Study Reference`,
      description: newDescription.trim() || 'Custom course book and Google Drive resource folder.',
      driveUrl: newUrl.trim(),
      badge: 'Custom Drive',
      icon: newSubject === 'System Commands' ? '⚙️' : newSubject === 'MAD 1 Project' ? '💻' : newSubject === 'DBMS' ? '🗄️' : '📚',
      isPrimary: false,
      modules: ['Lecture Slides & Handouts', 'Reference Notes & Practice Questions']
    };

    setBooks(prev => [newBook, ...prev]);
    setNewTitle('');
    setNewSubtitle('');
    setNewUrl('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  const handleDeleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const filteredBooks = books.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  });

  const sysCommandBook = books.find(b => b.id === 'book_sys_cmd') || books[0];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 animate-fadeIn">
      
      {/* Top Header Row with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 shadow-sm active:scale-95 transition-all"
            title="Back to Today's Tasks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              <span>Books & Study Materials</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              IIT Madras Course Books, Reference Materials & Google Drive Folders
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-pink-600/30 border border-pink-600 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Book / Link</span>
          </button>
        </div>
      </div>

      {/* FEATURED HERO CARD: System Commands Google Drive Book */}
      <div className="bg-gradient-to-br from-pink-50 via-white to-pink-50/30 dark:from-pink-950/30 dark:via-slate-900 dark:to-pink-950/20 border-2 border-pink-300 dark:border-pink-800/80 rounded-3xl p-5 sm:p-7 mb-8 shadow-lg shadow-pink-600/10 relative overflow-hidden">
        
        {/* Subtle decorative background circle */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-pink-500/10 dark:bg-pink-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          
          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600 text-white font-black text-xs shadow-sm shadow-pink-600/30">
              <span>⚙️</span>
              <span>System Commands (सिस्टम कमांड)</span>
            </span>

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Drive Connected</span>
            </span>
          </div>

          {/* Book Title & Subtitle */}
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
            System Commands Book & Complete Study Materials
          </h2>
          <p className="text-xs sm:text-sm text-pink-700 dark:text-pink-300 font-semibold mb-3">
            Official Google Drive Folder &bull; IIT Madras Course Curriculum
          </p>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-5 max-w-3xl">
            Complete reference library containing official presentation slides, Linux kernel & command documentation, bash shell scripts, assignment problem solutions, and exam preparation books.
          </p>

          {/* Core Modules included */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {sysCommandBook.modules.map((mod, idx) => (
              <div 
                key={idx}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-pink-200 dark:border-pink-900/60 rounded-2xl p-2.5 flex items-start gap-2 shadow-sm text-xs font-semibold text-gray-800 dark:text-slate-200"
              >
                <span className="text-pink-600 dark:text-pink-400 font-black">0{idx + 1}.</span>
                <span>{mod}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={SYSTEM_COMMANDS_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-pink-600/30 border border-pink-600 transition-all cursor-pointer"
            >
              <Folder className="w-4 h-4 fill-white" />
              <span>Open System Commands Drive Book</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            <button
              onClick={() => handleCopyLink(sysCommandBook.id, SYSTEM_COMMANDS_DRIVE_URL)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/80 text-gray-800 dark:text-slate-200 font-bold text-xs border border-gray-300 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
            >
              {copiedId === sysCommandBook.id ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-pink-600" />
                  <span>Copy Drive Link</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Search & Course Books Grid */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            All Subject Books & Course Materials
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Browse through books and drive links for all registered courses.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books or subjects..."
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 shadow-sm"
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => {
          const hasUrl = Boolean(book.driveUrl && book.driveUrl.trim().length > 0);
          const isSysCmd = book.subject === 'System Commands';

          return (
            <div
              key={book.id}
              className={`rounded-3xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                isSysCmd
                  ? 'bg-white dark:bg-slate-900 border-pink-400 dark:border-pink-700 shadow-md ring-1 ring-pink-500/20'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                {/* Subject badge and delete */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{book.icon}</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {book.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSysCmd
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                    }`}>
                      {book.badge}
                    </span>

                    {!book.isPrimary && (
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete custom book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-1">
                  {book.title}
                </h4>
                
                {/* Subtitle */}
                {book.subtitle && (
                  <p className="text-[11px] font-semibold text-pink-600 dark:text-pink-400 mb-2">
                    {book.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                  {book.description}
                </p>

                {/* Modules list */}
                {book.modules && book.modules.length > 0 && (
                  <div className="mb-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Key Content:
                    </span>
                    <ul className="text-[11px] text-gray-600 dark:text-slate-300 space-y-0.5">
                      {book.modules.slice(0, 3).map((m, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                          <span className="truncate">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {hasUrl ? (
                  <>
                    <a
                      href={book.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-pink-600/30 transition-all cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>Open Book (Google Drive)</span>
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                    </a>

                    <button
                      onClick={() => handleCopyLink(book.id, book.driveUrl)}
                      className="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 transition-all active:scale-95"
                      title="Copy Link"
                    >
                      {copiedId === book.id ? (
                        <Check className="w-4 h-4 text-pink-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-gray-400 dark:text-slate-500">
                    <span>Google Drive not linked</span>
                    <button
                      onClick={() => {
                        setNewSubject(book.subject);
                        setNewTitle(`${book.subject} Course Book`);
                        setIsAddModalOpen(true);
                      }}
                      className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
                    >
                      + Add Drive Link
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-pink-400 dark:border-pink-600 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              Add Course Book / Drive Link
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
              Save Google Drive folders or book links for your IITM subjects.
            </p>

            <form onSubmit={handleAddBook} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                >
                  <option value="System Commands">⚙️ System Commands</option>
                  <option value="MAD 1 Project">💻 MAD 1 Project</option>
                  <option value="DBMS">🗄️ DBMS</option>
                  <option value="Mathematics">📐 Mathematics</option>
                  <option value="General Study">📚 General Study</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Book / Material Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Linux Command Reference Book"
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Google Drive Link / URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase">Short Description</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. Week 1 to 12 lecture slides & exercises"
                  className="w-full mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-pink-600/30 transition-all"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
