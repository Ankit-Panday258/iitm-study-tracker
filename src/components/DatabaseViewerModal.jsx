import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, CheckCircle, Clock, Tag, FileText, Code, Table } from 'lucide-react';
import { fetchAllTasks, fetchSubjects, fetchDailyTrack, fetchDbStatus } from '../api';
import { formatTaskDuration } from '../utils/formatTime';

export default function DatabaseViewerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'subjects' | 'rawJson'
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, sData, status] = await Promise.all([
        fetchAllTasks(),
        fetchSubjects(),
        fetchDbStatus()
      ]);
      setTasks(tData || []);
      setSubjects(sData || []);
      setDbStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify({ tasks, subjects }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/75 dark:bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-2 border-pink-400 dark:border-pink-600 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Database Explorer</span>
                {dbStatus?.activeDatabase === 'MySQL' ? (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-700 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                    🐬 MySQL 9.6 (Local)
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
                    {dbStatus?.activeDatabase || 'Live Data'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {dbStatus?.activeDatabase === 'MySQL' 
                  ? 'Connected to local MySQL (127.0.0.1:3306 / iitm_study_tracker)'
                  : 'Live view of all tasks and subjects stored in the database'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'tasks'
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-300'
              }`}
            >
              Tasks Table ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'subjects'
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-300'
              }`}
            >
              Subjects ({subjects.length})
            </button>
            <button
              onClick={() => setActiveTab('rawJson')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeTab === 'rawJson'
                  ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-300'
              }`}
            >
              Raw JSON
            </button>
          </div>

          {activeTab === 'rawJson' && (
            <button
              onClick={copyJson}
              className="px-3 py-1 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-lg text-xs font-semibold hover:bg-pink-100 transition-all"
            >
              {copied ? '✓ Copied!' : 'Copy JSON'}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-pink-600 mb-2" />
              <p className="text-xs text-gray-500">Loading database records...</p>
            </div>
          ) : activeTab === 'tasks' ? (
            tasks.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-400">No tasks in database yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700 text-gray-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Topic</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {tasks.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 text-[10px] font-semibold">
                            {t.subject}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-slate-200 max-w-xs truncate" title={t.topic}>
                          {t.topic}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-gray-500 dark:text-slate-400">
                          {formatTaskDuration(t)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {t.completed ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              ✓ Completed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                          {t.id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'subjects' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((s) => (
                <div key={s.name} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {s.id || s._id || 'default'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <pre className="p-4 rounded-2xl bg-gray-900 text-pink-300 font-mono text-xs overflow-x-auto max-h-[50vh]">
              {JSON.stringify({ tasks, subjects }, null, 2)}
            </pre>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-gray-500">
          <span>
            {dbStatus?.activeDatabase === 'MySQL' ? '🐬 Active DB: MySQL (Fallback: SQLite)' : '📦 Active DB: SQLite'} • {tasks.length} tasks, {subjects.length} subjects
          </span>
          <span className="font-mono text-[10px]">Host: 127.0.0.1:3306</span>
        </div>

      </div>
    </div>
  );
}
