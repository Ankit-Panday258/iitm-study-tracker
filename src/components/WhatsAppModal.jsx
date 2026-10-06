import React, { useState, useEffect } from 'react';
import { 
  X, Bell, CheckCircle2, AlertTriangle, Send, ShieldCheck, 
  Sparkles, ExternalLink, RefreshCw, MessageSquare, Phone, Key
} from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose, showToast }) {
  const [phone, setPhone] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [notifyOnRelease, setNotifyOnRelease] = useState(true);
  const [notifyOnDayBeforeDeadline, setNotifyOnDayBeforeDeadline] = useState(true);
  const [notifyOnDeadlineDay, setNotifyOnDeadlineDay] = useState(true);
  const [notifyOnMilestones, setNotifyOnMilestones] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(null);
  const [testError, setTestError] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      loadLogs();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/whatsapp/config');
      if (res.ok) {
        const data = await res.json();
        setPhone(data.phone || '');
        setApiKey(data.apiKey || '');
        setEnabled(!!data.enabled);
        if (data.notifyOnRelease !== undefined) setNotifyOnRelease(data.notifyOnRelease);
        if (data.notifyOnDayBeforeDeadline !== undefined) setNotifyOnDayBeforeDeadline(data.notifyOnDayBeforeDeadline);
        if (data.notifyOnDeadlineDay !== undefined) setNotifyOnDeadlineDay(data.notifyOnDeadlineDay);
        if (data.notifyOnMilestones !== undefined) setNotifyOnMilestones(data.notifyOnMilestones);
      }
    } catch (err) {
      console.error('Failed to load whatsapp config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch('/api/whatsapp/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data || []);
      }
    } catch (err) {}
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const payload = {
        phone: phone.trim(),
        apiKey: apiKey.trim(),
        enabled: enabled && !!phone && !!apiKey,
        notifyOnRelease,
        notifyOnDayBeforeDeadline,
        notifyOnDeadlineDay,
        notifyOnMilestones
      };

      const res = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        if (showToast) showToast('WhatsApp Notification settings saved! ✅');
        onClose();
      } else {
        const err = await res.json();
        alert('Error saving settings: ' + (err.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error while saving settings: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!phone || !apiKey) {
      alert('कृपया पहले अपना फ़ोन नंबर और CallMeBot API Key भरें!');
      return;
    }

    try {
      setIsTesting(true);
      setTestSuccess(null);
      setTestError('');

      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), apiKey: apiKey.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestSuccess(true);
        if (showToast) showToast('Test WhatsApp message delivered! 🚀');
        loadLogs();
      } else {
        setTestSuccess(false);
        setTestError(data.error || 'संदेश भेजने में त्रुटि हुई। कृपया नंबर और API Key जांचें।');
      }
    } catch (err) {
      setTestSuccess(false);
      setTestError(err.message);
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 text-xl font-bold">
              💬
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>WhatsApp Alerts Setup</span>
                {enabled && phone && apiKey ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    🟢 Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    ⚪ Setup Needed
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                IIT Madras असाइनमेंट रिलीज़ व डेडलाइन सीधे आपके WhatsApp पर
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Quick Guide Box */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>मुफ़्त CallMeBot API Key कैसे प्राप्त करें (सिर्फ 1 मिनट):</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] sm:text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
              <li>
                WhatsApp पर इस नंबर को सेव करें या चैट खोलें: 
                <a 
                  href="https://wa.me/34644444946?text=I%20allow%20callmebot%20to%20send%20me%20messages" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold underline ml-1 text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 inline-flex items-center gap-0.5"
                >
                  <span>+34 644 44 49 46</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>चैट में यह मैसेज भेजें: <code className="bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900 dark:text-emerald-200">I allow callmebot to send me messages</code></li>
              <li>CallMeBot आपको तुरंत आपकी <strong>API Key</strong> का रिप्लाई भेज देगा।</li>
              <li>उसे नीचे पेस्ट करें और <strong>"Send Test WhatsApp Message"</strong> दबाकर टेस्ट करें!</li>
            </ol>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>आपका WhatsApp मोबाइल नंबर (With Country Code)</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="उदा. +91 9876543210 या 919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>CallMeBot API Key</span>
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="उदा. 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 font-medium font-mono"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <h5 className="font-bold text-gray-900 dark:text-white text-xs mb-2">अलर्ट प्राथमिकताएँ (Notification Triggers):</h5>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs text-gray-700 dark:text-slate-300">
                🔔 <strong>Content Release Day Alert</strong> (हर शुक्रवार असाइनमेंट आते ही)
              </span>
              <input
                type="checkbox"
                checked={notifyOnRelease}
                onChange={(e) => setNotifyOnRelease(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs text-gray-700 dark:text-slate-300">
                ⚠️ <strong>24 Hours Before Deadline</strong> (डेडलाइन से 1 दिन पहले चेतावनी)
              </span>
              <input
                type="checkbox"
                checked={notifyOnDayBeforeDeadline}
                onChange={(e) => setNotifyOnDayBeforeDeadline(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs text-gray-700 dark:text-slate-300">
                🚨 <strong>Deadline Day Alert</strong> (सबमिशन के अंतिम दिन)
              </span>
              <input
                type="checkbox"
                checked={notifyOnDeadlineDay}
                onChange={(e) => setNotifyOnDeadlineDay(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 cursor-pointer">
              <span className="text-xs text-gray-700 dark:text-slate-300">
                🚩 <strong>Milestone Gates</strong> (OPPE 1, End Term, OPPE 2, GAA)
              </span>
              <input
                type="checkbox"
                checked={notifyOnMilestones}
                onChange={(e) => setNotifyOnMilestones(e.target.checked)}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Test Status Banner */}
          {testSuccess === true && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold">
                सफलता! टेस्ट मैसेज आपके WhatsApp पर भेज दिया गया है। अपने फ़ोन में चेक करें! 🎉
              </span>
            </div>
          )}

          {testSuccess === false && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-xs font-semibold">
                त्रुटि: {testError || 'मैसेज नहीं भेजा जा सका। कृपया नंबर व API Key जांचें।'}
              </span>
            </div>
          )}

          {/* Active Status Switch */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">ऑटोमैटिक WhatsApp नोटिफिकेशन सक्रिय करें</p>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">रोज़ाना बैकएंड शेड्यूलर ऑटोमैटिक अलर्ट भेजेगा</p>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="accent-emerald-600 w-5 h-5 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isTesting || !phone || !apiKey}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {isTesting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isTesting ? 'भेजा जा रहा है...' : 'Test WhatsApp Message'}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              {isLoading ? 'सहेज रहे हैं...' : 'Save Settings'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
