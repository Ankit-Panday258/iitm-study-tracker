import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, fetchAuthConfig } from '../api';
import { IITM_CURRICULUM, IITM_STUDY_GOALS } from '../data/iitmCurriculum';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(window.location.pathname === '/register' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [studyGoal, setStudyGoal] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleStatus, setGoogleStatus] = useState('Loading Google sign-in…');
  const googleRef = useRef(null);
  const register = mode === 'register';
  const selectedGoal = IITM_STUDY_GOALS.find(goal => goal.id === studyGoal);
  const availableSubjects = selectedGoal
    ? IITM_CURRICULUM.filter(course => course.level === selectedGoal.curriculumLevel)
      .filter(course => `${course.name} ${course.code} ${course.kind || ''}`.toLowerCase().includes(subjectSearch.trim().toLowerCase()))
    : [];

  function toggleSubject(code) {
    const course = IITM_CURRICULUM.find(item => item.code === code);
    const optionTrack = course?.kind?.match(/^Option [12]/)?.[0];
    setSelectedSubjects(current => {
      if (current.includes(code)) return current.filter(item => item !== code);
      const compatible = optionTrack
        ? current.filter(item => !IITM_CURRICULUM.find(existing => existing.code === item)?.kind?.match(/^Option [12]/) || IITM_CURRICULUM.find(existing => existing.code === item)?.kind?.startsWith(optionTrack))
        : current;
      return [...compatible, code];
    });
  }

  function validateStudySelection() {
    if (!studyGoal) { setError('Choose your current IITM study level or degree goal.'); return false; }
    if (!selectedSubjects.length) { setError('Choose at least one subject to track.'); return false; }
    return true;
  }

  function navigate(next) {
    if(loading) return;
    window.history.pushState({}, '', '/' + next);
    setMode(next);setError('');setPassword('');setConfirm('');
  }
  useEffect(() => {
    if(!isOpen) return;
    const next = window.location.pathname === '/register' ? 'register' : 'login';
    setMode(next);
    if(!['/login','/register'].includes(window.location.pathname)) window.history.pushState({}, '', '/login');
    const onPop=()=> {setMode(window.location.pathname === '/register' ? 'register' : 'login');setError('');};
    window.addEventListener('popstate',onPop);
    return ()=>window.removeEventListener('popstate',onPop);
  },[isOpen]);
  useEffect(() => {
    if(!isOpen) return;
    let cancelled=false, timer;
    setGoogleStatus('Loading Google sign-in…');
    async function start() {
      try {
        const config=await fetchAuthConfig();
        if(cancelled) return;
        if(!config.googleClientId) {setGoogleStatus('Google sign-in is not configured yet. You can use email below.');return;}
        let attempts=0;
        const render=()=> {
          if(cancelled) return;
          if(!window.google?.accounts?.id) {
            if(++attempts>40) {setGoogleStatus('Google could not load. Check your connection and try again.');return;}
            timer=setTimeout(render,250);return;
          }
          window.google.accounts.id.initialize({client_id:config.googleClientId,auto_select:false,callback:async response=> {
            setLoading(true);setError('');
            try {
              if (register && !validateStudySelection()) return;
              const user=await loginWithGoogle({credential:response.credential,...(register ? {studyGoal,selectedSubjects} : {})});
              if(!cancelled) {await onLoginSuccess(user);onClose();}
            }
            catch(e) {if(!cancelled) setError(e.message);}
            finally {if(!cancelled) setLoading(false);}
          }});
          if(googleRef.current) {googleRef.current.innerHTML='';window.google.accounts.id.renderButton(googleRef.current,{type:'standard',theme:'outline',size:'large',text:'continue_with',width:Math.min(320,window.innerWidth-64)});setGoogleStatus('');}
        };render();
      }catch(e) {if(!cancelled) setGoogleStatus(e.message);}
    }
    start();return ()=>{cancelled=true;clearTimeout(timer);};
  },[isOpen,mode]);
  async function submit(e) {
    e.preventDefault();
    if(loading) return;
    setError('');
    if(register && password!==confirm) {setError('Passwords do not match.');return;}
    if(register && !validateStudySelection()) return;
    setLoading(true);
    try {
      const user=register
        ? await registerWithEmail({name:name.trim(),email:email.trim(),password,studyGoal,selectedSubjects})
        : await loginWithEmail({email:email.trim(),password});
      await onLoginSuccess(user);onClose();
    }catch(e) {setError(e.message || 'Unable to sign in. Please try again.');}
    finally {setLoading(false);}
  }
  if(!isOpen) return null;
  const inputClass='w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500';
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
    <div className="min-h-full flex flex-col items-center justify-center px-5 py-10">
      <button type="button" disabled={loading} onClick={onClose} className="mb-6 flex gap-2 items-center text-sm text-gray-500 dark:text-slate-400"><ArrowLeft size={16}/> Back to study tracker</button>
      <div className="w-full max-w-md rounded-3xl border border-pink-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 shadow-xl">
        <GraduationCap className="text-pink-600 mb-5" size={36}/>
        <p className="text-xs font-bold tracking-widest text-pink-600 uppercase">IITM Study Tracker</p>
        <h1 className="text-3xl font-extrabold mt-2">{register ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 mb-6">{register ? 'A fresh start for your study routine.' : 'Sign in to your personal study workspace.'}</p>
        <div className={loading ? 'pointer-events-none opacity-60' : ''}><div ref={googleRef} className="flex justify-center"/></div>
        {googleStatus && <p className="text-xs text-gray-500 dark:text-slate-400" role="status">{googleStatus}</p>}
        <div role="separator" aria-label="Email sign-in" className="flex items-center gap-3 my-5 text-xs text-gray-400"><span aria-hidden="true" className="flex-1 border-t dark:border-slate-700"/>{googleStatus.includes('not configured') ? 'Email sign-in' : 'or continue with email'}<span aria-hidden="true" className="flex-1 border-t dark:border-slate-700"/></div>
        {error && <p role="alert" className="mb-4 rounded-xl p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          {register && <div><label htmlFor="auth-name" className="block text-sm font-semibold mb-1">Full name</label><input id="auth-name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className={inputClass}/></div>}
          {register && <div className="space-y-3 rounded-2xl border border-pink-100 dark:border-slate-700 bg-pink-50/50 dark:bg-slate-800/50 p-4">
            <div><label htmlFor="study-goal" className="block text-sm font-semibold mb-1">What are you studying?</label><select id="study-goal" required value={studyGoal} onChange={e=>{setStudyGoal(e.target.value);setSelectedSubjects([]);setSubjectSearch('');}} className={inputClass}><option value="">Select a level or degree goal</option>{IITM_STUDY_GOALS.map(goal=><option key={goal.id} value={goal.id}>{goal.label}</option>)}</select></div>
            {selectedGoal && <div>
              <label className="block text-sm font-semibold mb-1">Choose subjects to track</label>
              {(studyGoal === 'bsc-degree' || studyGoal === 'bs-degree') && <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">The official course catalogue is shared across BSc/BS Degree Level; electives offered can vary by term.</p>}
              {studyGoal === 'diploma-data-science' && <p className="mb-2 text-xs text-gray-500 dark:text-slate-400">Choose from required subjects and either Data Science option track.</p>}
              <input type="search" aria-label="Search subjects" placeholder="Find a subject or course code" value={subjectSearch} onChange={e=>setSubjectSearch(e.target.value)} className={inputClass+' mb-2'}/>
              <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
                {availableSubjects.map(course=><label key={course.code} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-slate-800"><input type="checkbox" checked={selectedSubjects.includes(course.code)} onChange={()=>toggleSubject(course.code)} className="mt-0.5 accent-pink-600"/><span className="min-w-0 flex-1"><span className="block text-xs font-semibold leading-snug">{course.name}</span><span className="mt-0.5 block text-[10px] text-gray-500 dark:text-slate-400">{course.code}{course.kind ? ` · ${course.kind}` : ''} · {course.credits} credits</span></span></label>)}
                {!availableSubjects.length && <p className="p-3 text-xs text-gray-500">No matching subjects.</p>}
              </div>
              <p className="mt-2 text-xs font-semibold text-pink-700 dark:text-pink-300">{selectedSubjects.length} subject{selectedSubjects.length===1?'':'s'} selected</p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">This saves your study preference in this tracker; it does not register you for IITM courses.</p>
            </div>}
          </div>}
          <div><label htmlFor="auth-email" className="block text-sm font-semibold mb-1">Email address</label><input id="auth-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} className={inputClass}/></div>
          <div><label htmlFor="auth-password" className="block text-sm font-semibold mb-1">Password</label><div className="relative"><input id="auth-password" type={visible ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} required minLength={register ? 8 : 1} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} className={inputClass+' pr-12'}/><button aria-label={visible ? 'Hide password' : 'Show password'} type="button" onClick={()=>setVisible(!visible)} className="absolute right-4 top-3.5 text-gray-500">{visible ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div>{register && <p className="text-xs text-gray-500 mt-1">Use at least 8 characters.</p>}</div>
          {register && <div><label htmlFor="auth-confirm" className="block text-sm font-semibold mb-1">Confirm password</label><input id="auth-confirm" type={visible ? 'text' : 'password'} autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)} className={inputClass}/></div>}
          <button disabled={loading} className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-3 font-bold disabled:opacity-60">{loading ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
        </form>
        <p className="text-sm text-center text-gray-500 dark:text-slate-400 mt-6">{register ? 'Already have an account? ' : 'New here? '}<button type="button" disabled={loading} onClick={()=>navigate(register ? 'login' : 'register')} className="font-bold text-pink-600">{register ? 'Sign in' : 'Create an account'}</button></p>
      </div>
    </div>
  </div>;
}
