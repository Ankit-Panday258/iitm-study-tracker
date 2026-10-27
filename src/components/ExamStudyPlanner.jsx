import React, { useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, Plus, Trash2, Download, BookOpen, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { INITIAL_COURSES_DATA } from './CoursesPage';
import { getLocalDateString } from '../utils/formatTime.js';
import { existingTopics, generateStudyPlan, planToCSV } from '../utils/studyPlanner.js';

const blankSubject = () => ({ id: crypto.randomUUID(), name: '', examDate: '', syllabus: '', topicCount: '', hoursPerTopic: 1, difficulty: 'normal' });
const duration = minutes => `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}m`;
const displayDate = date => new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const fieldClass = 'w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-pink-500';
const buttonClass = 'min-h-11 cursor-pointer rounded-xl px-4 py-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500';

export default function ExamStudyPlanner({ onBack, tasks = [], subjects = [], currentUser }) {
  const storageKey = `iitm_exam_planner_v1:${currentUser?.id || 'guest'}`;
  const [draft, setDraft] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.subjects?.length && saved.subjects.length <= 20) return saved;
    } catch {}
    return { startDate: getLocalDateString(), dailyHours: 2, subjects: [blankSubject()] };
  });
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');
  const courses = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iitm_courses_syllabus_v5'));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch {}
    return INITIAL_COURSES_DATA;
  }, []);
  const subjectNames = [...new Set([...courses.map(course => course.name), ...subjects.map(subject => subject.name), ...tasks.map(task => task.subject)].filter(Boolean))];
  function changeDraft(update) { setDraft(previous => ({ ...previous, ...update })); setPlan(null); setError(''); setNotice(''); }
  function changeSubject(id, update) { changeDraft({ subjects: draft.subjects.map(subject => subject.id === id ? { ...subject, ...update } : subject) }); }
  function importSyllabus(subject) {
    const topics = existingTopics(subject.name, courses, tasks);
    if (!topics.length) { setError('No saved topics found for this subject. Paste your syllabus or provide a topic count.'); return; }
    changeSubject(subject.id, { syllabus: topics.join('\n') });
    setNotice(`Imported ${topics.length} topics for ${subject.name}. Review the list before generating.`);
  }
  function generate(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      const result = generateStudyPlan({ ...draft, courses, tasks });
      setPlan(result); setFilter('all');
      try { localStorage.setItem(storageKey, JSON.stringify(draft)); setNotice('Inputs saved on this browser.'); }
      catch { setNotice('Plan generated. This browser could not save your inputs.'); }
    } catch (exception) { setError(exception.message); setPlan(null); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([planToCSV(plan)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'exam-study-plan.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const visibleDays = plan?.days.filter(day => filter === 'all' || day.sessions.some(session => session.subjectId === filter)) || [];
  return <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
    <button type="button" onClick={onBack} className={`${buttonClass} flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800`}><ArrowLeft size={18} /> Back to tracker</button>
    <header className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-700">
      <div className="flex gap-3 items-center text-pink-300"><CalendarClock size={25} /><span className="text-xs font-bold uppercase tracking-widest">Your exam, broken into study days</span></div>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">Exam study planner</h1>
      <p className="mt-3 text-slate-300 max-w-2xl">Add your subjects, exam dates and syllabus. Get a daily timetable with exactly what to study and how long to spend.</p>
    </header>
    <form onSubmit={generate} className="space-y-5">
      <section aria-label="Study availability" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700">
        <h2 className="font-bold text-lg flex gap-2 items-center"><Clock size={20} /> Your available time</h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <label className="space-y-1 block font-semibold text-sm">Start date<input aria-label="Study start date" type="date" required value={draft.startDate} onChange={event => changeDraft({ startDate: event.target.value })} className={fieldClass} /></label>
          <label className="space-y-1 block font-semibold text-sm">Total study hours per day<input aria-label="Daily study hours" type="number" min="0.25" max="16" step="0.25" required value={draft.dailyHours} onChange={event => changeDraft({ dailyHours: event.target.value })} className={fieldClass} /></label>
        </div>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-3">This is your combined daily limit for all subjects. Hours mean focused study; take breaks separately. The exam day is excluded.</p>
      </section>
      <datalist id="planner-subjects">{subjectNames.map(name => <option value={name} key={name} />)}</datalist>
      {draft.subjects.map((subject, index) => <section key={subject.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="flex justify-between items-center gap-3"><h2 className="text-lg font-bold flex gap-2 items-center"><BookOpen size={20} /> Subject {index + 1}</h2>{draft.subjects.length > 1 && <button type="button" aria-label={`Remove subject ${index + 1}`} onClick={() => changeDraft({ subjects: draft.subjects.filter(item => item.id !== subject.id) })} className={`${buttonClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-950`}><Trash2 size={18} /></button>}</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1 text-sm font-semibold">Subject name<input aria-label={`Subject ${index + 1} name`} list="planner-subjects" maxLength={100} placeholder="e.g. System Commands, Java, DBMS" required value={subject.name} onChange={event => changeSubject(subject.id, { name: event.target.value })} className={fieldClass} /></label>
          <label className="block space-y-1 text-sm font-semibold">Exam date<input aria-label={`Subject ${index + 1} exam date`} type="date" required min={draft.startDate} value={subject.examDate} onChange={event => changeSubject(subject.id, { examDate: event.target.value })} className={fieldClass} /></label>
        </div>
        <div><div className="flex flex-wrap items-center justify-between gap-2 mb-1"><label htmlFor={`syllabus-${subject.id}`} className="text-sm font-semibold">Syllabus / topics — one per line</label><button type="button" onClick={() => importSyllabus(subject)} className={`${buttonClass} text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950 text-sm`}>Use existing syllabus</button></div>
          <textarea id={`syllabus-${subject.id}`} rows={5} maxLength={50000} placeholder={'Variables and data types\nLoops and conditions\nFunctions'} value={subject.syllabus} onChange={event => changeSubject(subject.id, { syllabus: event.target.value })} className={fieldClass} />
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">If empty, we look for this subject in your saved course syllabus and tasks. Other subjects are never substituted.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block space-y-1 text-sm font-semibold">Topic count, if no syllabus<input aria-label={`Subject ${index + 1} topic count`} type="number" min="1" max="200" step="1" placeholder="Optional" value={subject.topicCount} onChange={event => changeSubject(subject.id, { topicCount: event.target.value })} className={fieldClass} /></label>
          <label className="block space-y-1 text-sm font-semibold">Estimated hours per topic<input aria-label={`Subject ${index + 1} hours per topic`} type="number" min="0.25" max="24" step="0.25" required value={subject.hoursPerTopic} onChange={event => changeSubject(subject.id, { hoursPerTopic: event.target.value })} className={fieldClass} /></label>
          <label className="block space-y-1 text-sm font-semibold">Difficulty<select aria-label={`Subject ${index + 1} difficulty`} value={subject.difficulty} onChange={event => changeSubject(subject.id, { difficulty: event.target.value })} className={fieldClass}><option value="easy">Easy / familiar</option><option value="normal">Normal</option><option value="hard">Hard / new to me</option></select></label>
        </div>
      </section>)}
      <div className="flex flex-wrap gap-3"><button type="button" disabled={draft.subjects.length >= 20} onClick={() => changeDraft({ subjects: [...draft.subjects, blankSubject()] })} className={`${buttonClass} flex gap-2 items-center border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50`}><Plus size={18} /> Add another subject</button><button type="submit" className={`${buttonClass} bg-pink-600 text-white hover:bg-pink-700 flex gap-2 items-center`}><CalendarClock size={18} /> Generate timetable</button></div>
      {error && <p role="alert" className="rounded-xl p-4 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">{error}</p>}
      {notice && <p role="status" className="text-sm text-gray-600 dark:text-slate-300">{notice}</p>}
    </form>
    {plan && <section aria-label="Generated study timetable" className="space-y-5">
      <div className={`rounded-2xl p-5 border ${plan.feasible ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100' : 'bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100'}`}>
        <h2 className="text-xl font-bold flex items-center gap-2">{plan.feasible ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}{plan.feasible ? 'Your syllabus fits this timetable' : 'Some work does not fit before the exams'}</h2>
        <p className="mt-2">{duration(plan.scheduledMinutes)} scheduled of {duration(plan.requiredMinutes)} estimated study and revision.</p>
        {!plan.feasible && <p className="mt-2 font-semibold">{duration(plan.requiredMinutes - plan.scheduledMinutes)} remains unscheduled. Increase your daily time, start earlier, or adjust the syllabus and estimates.</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{plan.subjects.map(subject => <article key={subject.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"><h3 className="font-bold text-lg">{subject.name}</h3><p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Exam: {displayDate(subject.examDate)} · {subject.days} study days</p><p className="text-2xl font-extrabold mt-3">{subject.recommendedDailyHours.toFixed(2)} h/day</p><p className="text-sm mt-1">Average needed for this subject · {subject.topics} topics · {duration(subject.requiredMinutes)} total</p><p className="text-xs mt-3 text-gray-600 dark:text-slate-400">Source: {subject.source}</p></article>)}</div>
      <div className="flex flex-wrap justify-between items-center gap-3"><h2 className="font-bold text-2xl">Daily study table</h2><div className="flex gap-2 flex-wrap"><select aria-label="Filter timetable by subject" value={filter} onChange={event => setFilter(event.target.value)} className={`${fieldClass} w-auto`}><option value="all">All subjects</option>{plan.subjects.map(subject => <option value={subject.id} key={subject.id}>{subject.name}</option>)}</select><button type="button" onClick={download} className={`${buttonClass} flex items-center gap-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800`}><Download size={18} /> Download CSV</button></div></div>
      <p className="text-sm text-gray-600 dark:text-slate-400">Earlier deadlines get priority. Difficulty adjusts learning estimates (easy ×0.75, normal ×1, hard ×1.5); revision gets about 20% of total effort, rounded to 15-minute blocks. These are adjustable estimates, not guaranteed learning times.</p>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"><table className="min-w-[640px] w-full text-sm text-left"><caption className="sr-only">Planned study sessions before each subject’s exam date</caption><thead className="bg-gray-100 dark:bg-slate-800"><tr>{['Date', 'Subject', 'What to study', 'Time'].map(title => <th scope="col" key={title} className="p-4 font-bold">{title}</th>)}</tr></thead><tbody>{visibleDays.map(day => {
        const sessions = day.sessions.filter(session => filter === 'all' || session.subjectId === filter);
        return <React.Fragment key={day.date}>{sessions.length ? sessions.map((session, i) => <tr key={`${session.jobId}-${i}`} className="border-t border-gray-100 dark:border-slate-800"><td className="p-4 align-top whitespace-nowrap">{i === 0 ? <><span className="font-semibold">{displayDate(day.date)}</span><span className="block text-xs text-gray-600 dark:text-slate-400 mt-1">Day total: {duration(sessions.reduce((sum, item) => sum + item.minutes, 0))}</span></> : null}</td><td className="p-4 align-top font-semibold">{session.subject}</td><td className="p-4"><span className="block text-xs text-pink-700 dark:text-pink-300 mb-1">{session.activity}</span>{session.topic}</td><td className="p-4 whitespace-nowrap align-top">{duration(session.minutes)}</td></tr>) : <tr className="border-t border-gray-100 dark:border-slate-800"><td className="p-4 whitespace-nowrap">{displayDate(day.date)}</td><td colSpan={2} className="p-4 text-gray-600 dark:text-slate-400">Buffer / catch-up — no study scheduled</td><td className="p-4">0h 0m</td></tr>}</React.Fragment>;
      })}</tbody></table></div>
      {plan.remaining.length > 0 && <details className="rounded-xl border border-amber-300 dark:border-amber-800 p-4"><summary className="cursor-pointer font-semibold">See unscheduled topics ({plan.remaining.length} activities)</summary><ul className="mt-3 space-y-2">{plan.remaining.map((item, index) => <li key={index} className="text-sm">{item.subject} — {item.topic} · {item.activity} · {duration(item.minutes)}</li>)}</ul></details>}
    </section>}
  </main>;
}
