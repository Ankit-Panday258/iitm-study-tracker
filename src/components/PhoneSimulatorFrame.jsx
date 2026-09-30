import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';

export default function PhoneSimulatorFrame({ 
  children, 
  isPhoneView, 
  onTogglePhoneView 
}) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isPhoneView) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 sm:pb-6">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
      {/* Top Simulator Control Bar for Desktop */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-semibold text-pink-400">
          <Smartphone className="w-4 h-4" />
          <span>Mobile App Mode</span>
        </div>
        <button
          onClick={onTogglePhoneView}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-all shadow-sm"
          title="Switch to Full Width View"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Expanded View</span>
        </button>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="w-full max-w-[420px] h-[890px] max-h-[95vh] bg-white dark:bg-slate-950 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-[10px] border-slate-800 relative flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Dynamic Island / Speaker Notch & Status Bar */}
        <div className="h-11 bg-white dark:bg-slate-900 px-6 flex items-center justify-between text-xs font-bold text-gray-800 dark:text-white shrink-0 z-50 select-none border-b border-gray-100 dark:border-slate-800/60">
          <span className="text-[11px] tracking-tight">{time || '09:41'}</span>
          
          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          </div>

          <div className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto relative scroll-smooth overscroll-contain pb-20">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none opacity-80" />
      </div>
    </div>
  );
}
