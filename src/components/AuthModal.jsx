import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail, fetchAuthConfig } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(window.location.pathname === '/register' ? 'register' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleStatus, setGoogleStatus] = useState('Loading Google sign-in…');
  const googleRef = useRef(null);
  const register = mode === 'register';

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
            try { const user=await loginWithGoogle({credential:response.credential}); if(!cancelled) {await onLoginSuccess(user);onClose();} }
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
    e.preventDefault();setError('');
    if(register && password!==confirm) {setError('Passwords do not match.');return;}
    setLoading(true);
    try {
      const user=register ? await registerWithEmail({name:name.trim(),email:email.trim(),password}) : await loginWithEmail({email:email.trim(),password});
      await await onLoginSuccess(user);onClose();
    }catch(e) {setError(e.message);}
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
        <div className="flex items-center gap-3 my-5 text-xs text-gray-400"><span className="flex-1 border-t dark:border-slate-700"/>or continue with email<span className="flex-1 border-t dark:border-slate-700"/></div>
        {error && <p role="alert" className="mb-4 rounded-xl p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-sm">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          {register && <div><label htmlFor="auth-name" className="block text-sm font-semibold mb-1">Full name</label><input id="auth-name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} className={inputClass}/></div>}
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
