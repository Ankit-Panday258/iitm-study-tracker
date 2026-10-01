import React, { useState, useEffect, useRef } from 'react';
import { X, LogIn, Mail, User, ShieldCheck, Lock, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../api';
import { jwtDecode } from 'jwt-decode';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'register' | 'google'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const googleBtnRef = useRef(null);

  // Reset errors when mode changes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
  }, [authMode]);

  // Initialize official Google Identity Services button if window.google is ready
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google && clientId && googleBtnRef.current && authMode === 'google') {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });

        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 320
        });
      } catch (err) {
        console.warn('Google GSI init note:', err);
      }
    }
  }, [isOpen, authMode]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setError('');
      const decoded = jwtDecode(response.credential);
      const user = await loginWithGoogle({
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        googleId: decoded.sub,
        credential: response.credential
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Google Sign In
  const handleSimulatedGoogleSignIn = async (presetEmail, presetName) => {
    try {
      setLoading(true);
      setError('');
      const userEmail = presetEmail || email || 'student@iitm.ac.in';
      const userName = presetName || name || userEmail.split('@')[0];
      
      const user = await loginWithGoogle({
        email: userEmail,
        name: userName,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
        googleId: 'google_' + Date.now()
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Email & Password
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await loginWithEmail({
        email: email.trim(),
        password,
        name: name.trim()
      });
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Register New Account
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await registerWithEmail({
        email: email.trim(),
        password,
        name: name.trim() || email.split('@')[0]
      });
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/75 dark:bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-2 border-pink-400 dark:border-pink-600 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Top washi tape */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-pink-200 dark:bg-pink-800/80 rounded-b-lg border-x border-b border-pink-300 dark:border-pink-700 flex items-center justify-center">
          <div className="w-10 h-0.5 bg-pink-300 dark:bg-pink-600 rounded-full opacity-70" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pt-8 px-6 pb-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-700 mx-auto flex items-center justify-center mb-2 shadow-inner">
            {authMode === 'register' ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            IIT Madras Study Portal
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            {authMode === 'register' 
              ? 'Create a new account stored in local MySQL database' 
              : 'Sign in to access and sync your study tracker records'}
          </p>
        </div>

        {/* 3 Mode Selector Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 px-6 gap-2">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            onClick={() => setAuthMode('google')}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'google'
                ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {/* Google Icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {error && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold text-center animate-shake">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold text-center">
              {successMsg}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-600/20 transition-all mt-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating with MySQL...' : 'Sign In to MySQL Database'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Don't have an account yet? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-xs text-pink-600 font-bold hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ankit Pandey"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-600/20 transition-all mt-2 disabled:opacity-50"
              >
                {loading ? 'Creating in MySQL...' : 'Register & Save to MySQL'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-500">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-xs text-pink-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GOOGLE */}
          {authMode === 'google' && (
            <div className="space-y-4">
              
              <div ref={googleBtnRef} className="flex justify-center" />

              <button
                type="button"
                onClick={() => handleSimulatedGoogleSignIn('ankit.pandey@iitm.ac.in', 'Ankit Pandey')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/80 border-2 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-white font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md hover:border-pink-500"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-slate-800" /></div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] text-gray-400 font-medium">Or enter Google email directly</span>
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleSimulatedGoogleSignIn(email, '')}
                  disabled={!email.trim() || loading}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all shadow-sm shadow-pink-600/20"
                >
                  {loading ? 'Connecting...' : 'Sign In with Google Account'}
                </button>
              </div>

            </div>
          )}

          {/* MySQL Security Badge */}
          <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
            <span>🐬 MySQL Database Stored & Protected</span>
          </div>

        </div>

      </div>
    </div>
  );
}
