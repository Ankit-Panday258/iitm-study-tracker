import React, { useEffect, useState } from 'react';
import { ArrowLeft, Award, Check, Circle, Pencil, Plus, Sparkles, Trophy, X } from 'lucide-react';
import { fetchGoalRanking, fetchNotionGoalsStatus, setupNotionGoals } from '../api';

const GOAL_SUBJECT = 'Personal Goals';
const REWARD_POINTS = 10;

export default function GoalsPage({ tasks, onSave, onToggle, onDelete, onBack }) {
  const goals = tasks.filter(task => task.subject === GOAL_SUBJECT);
  const completed = goals.filter(goal => goal.completed);
  const points = completed.length * REWARD_POINTS;
  const [title, setTitle] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ranking, setRanking] = useState(null);
  const [notionStatus, setNotionStatus] = useState(null);
  const [settingUpNotion, setSettingUpNotion] = useState(false);
  const [notionSetupMessage, setNotionSetupMessage] = useState('');
  const [notionUrl, setNotionUrl] = useState('');
  const nextReward = Math.max(100, Math.ceil((points + 1) / 100) * 100);

  useEffect(() => {
    fetchGoalRanking().then(setRanking).catch(() => setRanking(null));
  }, [goals.length, completed.length]);
  useEffect(() => { fetchNotionGoalsStatus().then(setNotionStatus).catch(() => setNotionStatus(null)); }, []);

  const handleNotionSetup = async () => {
    setSettingUpNotion(true);
    try {
      const result = await setupNotionGoals();
      setNotionStatus({ ready: true, databaseConfigured: true, tokenConfigured: true });
      setNotionUrl(result.databaseUrl);
      setNotionSetupMessage(`Synced ${result.goalCount} existing goal${result.goalCount === 1 ? '' : 's'}.`);
    } catch (error) {
      setNotionSetupMessage(error.message);
    } finally { setSettingUpNotion(false); }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || saving) return;
    setSaving(true);
    const result = await onSave({ subject: GOAL_SUBJECT, topic: title.trim(), date: editingGoal?.date || new Date().toISOString().slice(0, 10), durationHours: 0, durationMinutes: 0, durationSeconds: 0, priority: 'Medium', completed: editingGoal?.completed || false, completedAt: editingGoal?.completedAt || null, notes: '' }, editingGoal || false);
    if (result?.success) { setTitle(''); setEditingGoal(null); }
    setSaving(false);
  };

  return <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
    <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-pink-600 dark:hover:text-pink-400"><ArrowLeft className="w-4 h-4"/> Back to planner</button>
    <header className="rounded-3xl p-6 sm:p-8 mb-6 text-gray-900 dark:text-white bg-gradient-to-br from-pink-50 via-white to-gray-100 dark:from-pink-950/40 dark:via-slate-900 dark:to-slate-800 border border-pink-200 dark:border-pink-800 shadow-xl shadow-pink-900/10">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-sm font-bold text-pink-700 dark:text-pink-300">YOUR GOAL BOARD</p><h1 className="text-3xl font-black mt-1">Small steps. Big wins.</h1><p className="text-sm text-gray-600 dark:text-slate-300 mt-2">Complete a goal to earn {REWARD_POINTS} points and move up your personal ranking.</p></div>
        <Trophy className="w-10 h-10 shrink-0 text-pink-600 dark:text-pink-400" />
      </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <div className="rounded-2xl border border-pink-200 dark:border-pink-800/70 bg-white/80 dark:bg-slate-900/70 p-3"><p className="text-xs text-gray-500 dark:text-slate-400">Points</p><p className="text-2xl font-black text-gray-900 dark:text-white">{points}</p></div>
        <div className="rounded-2xl border border-pink-200 dark:border-pink-800/70 bg-white/80 dark:bg-slate-900/70 p-3"><p className="text-xs text-gray-500 dark:text-slate-400">Completed</p><p className="text-2xl font-black text-gray-900 dark:text-white">{completed.length}</p></div>
        <div className="rounded-2xl border border-pink-200 dark:border-pink-800/70 bg-white/80 dark:bg-slate-900/70 p-3"><p className="text-xs text-gray-500 dark:text-slate-400">Next reward</p><p className="text-2xl font-black text-gray-900 dark:text-white">{nextReward} pts</p></div>
        <div className="rounded-2xl border border-pink-200 dark:border-pink-800/70 bg-white/80 dark:bg-slate-900/70 p-3"><p className="text-xs text-gray-500 dark:text-slate-400">Your rank</p><p className="text-2xl font-black text-gray-900 dark:text-white">{ranking?.rank ? `#${ranking.rank}` : '—'}</p><p className="text-[10px] text-gray-500 dark:text-slate-400">of {ranking?.participants || 0} learners</p></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-200"><Award className="w-4 h-4 text-pink-600 dark:text-pink-400" /> {points >= 100 ? `Level ${Math.floor(points / 100) + 1} achiever` : `${100 - points % 100} points to your next level`}</div>
    </header>

    <div className="mb-5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div><p className="text-sm font-bold text-gray-900 dark:text-white">Notion goals table</p><p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{notionSetupMessage || (notionStatus?.ready ? 'Connected. Goal edits and completions sync to Notion.' : notionStatus?.tokenConfigured ? 'Create a Notion table and backfill your existing goals.' : 'Add Notion server credentials to enable sync.')}</p>{notionUrl && <a href={notionUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-pink-600 dark:text-pink-400 underline mt-1 inline-block">Open Study Goals in Notion</a>}</div>
      {notionStatus?.ready && <span className="rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 px-2.5 py-1 text-xs font-bold text-pink-700 dark:text-pink-300">Connected</span>}
      <button onClick={handleNotionSetup} disabled={settingUpNotion || !notionStatus?.tokenConfigured} className="rounded-xl bg-pink-600 hover:bg-pink-700 dark:bg-pink-600 dark:hover:bg-pink-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{settingUpNotion ? 'Setting up…' : notionStatus?.ready ? 'Sync all goals' : 'Create table & sync goals'}</button>
    </div>

    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input value={title} onChange={e => setTitle(e.target.value)} maxLength={160} placeholder={editingGoal ? 'Edit goal title…' : 'Add a goal you want to achieve...'} className="flex-1 min-w-0 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm shadow-sm focus:outline-none focus:border-pink-500" />
      <button disabled={!title.trim() || saving} className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white px-4 font-bold">{editingGoal ? <Check className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}<span className="hidden sm:inline">{editingGoal ? 'Save' : 'Add goal'}</span></button>
      {editingGoal && <button type="button" onClick={() => { setEditingGoal(null); setTitle(''); }} aria-label="Cancel goal edit" className="rounded-2xl border border-gray-200 dark:border-slate-700 p-3 text-gray-500"><X className="w-4 h-4"/></button>}
    </form>

    <section className="space-y-3">
      {goals.length ? goals.map(goal => <article key={goal.id} className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <button onClick={() => onToggle(goal.id)} aria-label={goal.completed ? 'Mark goal incomplete' : 'Complete goal'} className={`w-9 h-9 rounded-full border-2 shrink-0 flex items-center justify-center ${goal.completed ? 'bg-pink-600 border-pink-600 text-white' : 'border-gray-300 dark:border-slate-600 text-transparent hover:border-pink-500'}`}>{goal.completed ? <Check className="w-5 h-5"/> : <Circle className="w-4 h-4"/>}</button>
        <div className="flex-1 min-w-0"><p className={`font-bold ${goal.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{goal.topic}</p><p className="text-xs text-gray-500 mt-1">{goal.completed ? 'Completed' : 'In progress'}{goal.completed ? ` · +${REWARD_POINTS} points` : ''}</p></div>
        <button onClick={() => { setEditingGoal(goal); setTitle(goal.topic); }} aria-label="Edit goal" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 p-2"><Pencil className="w-4 h-4"/></button>
        <button onClick={() => onDelete(goal.id)} className="text-xs font-semibold text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 px-2 py-1">Remove</button>
      </article>) : <div className="text-center rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 p-10 text-gray-500 dark:text-slate-400"><Sparkles className="w-8 h-8 mx-auto mb-2 text-pink-500 dark:text-pink-400"/><p className="font-bold text-gray-700 dark:text-slate-200">Your next win starts here</p><p className="text-sm mt-1">Add a goal above and check it off when you finish.</p></div>}
    </section>
    <p className="text-center text-xs text-gray-400 mt-6">Rankings compare points earned from completed goals across learners.</p>
  </main>;
}
