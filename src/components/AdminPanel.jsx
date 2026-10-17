import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Plus, ShieldCheck, Users } from 'lucide-react';
import { createAdminUser, createSubject, fetchAdminUsers, fetchSubjects } from '../api';

const inputClass = 'w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-slate-100 outline-none focus:border-pink-400';

export default function AdminPanel({ onBack, showToast }) {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', icon: '📚' });

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextUsers, nextSubjects] = await Promise.all([fetchAdminUsers(), fetchSubjects()]);
      setUsers(nextUsers);
      setSubjects(nextSubjects);
    } catch (err) {
      setError(err.message || 'एडमिन जानकारी लोड नहीं हो सकी।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const addUser = async (event) => {
    event.preventDefault();
    try {
      const user = await createAdminUser(userForm);
      setUsers(current => [user, ...current]);
      setUserForm({ name: '', email: '', password: '' });
      showToast?.('यूज़र अकाउंट बन गया।');
    } catch (err) { setError(err.message); }
  };

  const addSubject = async (event) => {
    event.preventDefault();
    try {
      const subject = await createSubject({ ...subjectForm, color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700' });
      setSubjects(current => current.some(item => item.id === subject.id) ? current : [...current, subject]);
      setSubjectForm({ name: '', icon: '📚' });
      showToast?.('कोर्स/विषय जोड़ दिया गया।');
    } catch (err) { setError(err.message); }
  };

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-pink-600"><ArrowLeft className="w-4 h-4" /> वापस</button>
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-pink-100 dark:bg-pink-900/40 p-3 text-pink-700 dark:text-pink-300"><ShieldCheck className="w-6 h-6" /></div>
        <div><h1 className="text-2xl font-black">एडमिन पैनल</h1><p className="text-sm text-gray-500 dark:text-slate-400">यूज़र और कोर्स/विषय संभालें</p></div>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
      {loading ? <p className="py-8 text-center text-sm text-gray-500">लोड हो रहा है…</p> : (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><Users className="w-4 h-4 text-pink-600" /> यूज़र <span className="text-xs font-semibold text-gray-400">{users.length}</span></h2></div>
            <form onSubmit={addUser} className="mb-5 grid gap-2">
              <input className={inputClass} placeholder="पूरा नाम" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required maxLength={100} />
              <input className={inputClass} type="email" placeholder="ईमेल" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
              <input className={inputClass} type="password" placeholder="अस्थायी पासवर्ड (कम से कम 8 अक्षर)" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required minLength={8} />
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-700"><Plus className="w-4 h-4" /> यूज़र जोड़ें</button>
            </form>
            <div className="max-h-72 space-y-2 overflow-auto">
              {users.map(user => <div key={user.id} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-800/70 px-3 py-2.5"><div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-gray-500 dark:text-slate-400">{user.email}</p></div><span className="shrink-0 rounded-full bg-gray-200 dark:bg-slate-700 px-2 py-1 text-[10px] font-bold">{user.isAdmin ? 'एडमिन' : 'यूज़र'}</span></div>)}
              {!users.length && <p className="text-sm text-gray-500">अभी कोई यूज़र नहीं है।</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-bold"><BookOpen className="w-4 h-4 text-pink-600" /> कोर्स और विषय <span className="text-xs font-semibold text-gray-400">{subjects.length}</span></h2>
            <form onSubmit={addSubject} className="mb-5 grid grid-cols-[76px_1fr_auto] gap-2">
              <input className={inputClass + ' text-center'} aria-label="Icon" value={subjectForm.icon} onChange={e => setSubjectForm({ ...subjectForm, icon: e.target.value })} maxLength={8} />
              <input className={inputClass} placeholder="कोर्स/विषय का नाम" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} required maxLength={100} />
              <button className="inline-flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-2 text-sm font-bold text-white hover:bg-pink-700"><Plus className="w-4 h-4" /><span className="hidden sm:inline">जोड़ें</span></button>
            </form>
            <div className="space-y-2">
              {subjects.map(subject => <div key={subject.id} className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-slate-800/70 px-3 py-2.5"><span className="text-xl">{subject.icon || '📚'}</span><span className="text-sm font-semibold">{subject.name}</span></div>)}
              {!subjects.length && <p className="text-sm text-gray-500">अभी कोई कोर्स या विषय नहीं है।</p>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
