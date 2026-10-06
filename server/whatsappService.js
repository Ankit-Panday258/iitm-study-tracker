import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SETTINGS_FILE = path.join(__dirname, 'whatsapp_settings.json');
const LOGS_FILE = path.join(__dirname, 'whatsapp_logs.json');

// 12-Week Assignment Schedule for Term 3 (2026)
export const ASSIGNMENT_SCHEDULE = [
  {
    week: 1,
    termWeek: 'Week 1T3',
    label: 'Week 1',
    releaseDate: '2026-10-02',
    deadlineDate: '2026-10-11',
    comment: null
  },
  {
    week: 2,
    termWeek: 'Week 2 T3',
    label: 'Week 2',
    releaseDate: '2026-10-09',
    deadlineDate: '2026-10-18',
    comment: null
  },
  {
    week: 3,
    termWeek: 'Week 3T3',
    label: 'Week 3',
    releaseDate: '2026-10-16',
    deadlineDate: '2026-10-25',
    comment: null
  },
  {
    week: 4,
    termWeek: 'Week 4T3',
    label: 'Week 4',
    releaseDate: '2026-10-23',
    deadlineDate: '2026-11-01',
    comment: 'OPPE 1 eligibility closes'
  },
  {
    week: 5,
    termWeek: 'Week 5T3',
    label: 'Week 5',
    releaseDate: '2026-10-30',
    deadlineDate: '2026-11-11',
    comment: null
  },
  {
    week: 6,
    termWeek: 'Week 6T3',
    label: 'Week 6',
    releaseDate: '2026-11-06',
    deadlineDate: '2026-11-18',
    comment: null
  },
  {
    week: 7,
    termWeek: 'Week 7T3',
    label: 'Week 7',
    releaseDate: '2026-11-13',
    deadlineDate: '2026-11-25',
    comment: 'End term eligibility closes'
  },
  {
    week: 8,
    termWeek: 'Week 8T3',
    label: 'Week 8',
    releaseDate: '2026-11-20',
    deadlineDate: '2026-11-29',
    comment: 'OPPE2 - eligibility closes'
  },
  {
    week: 9,
    termWeek: 'Week 9T3',
    label: 'Week 9',
    releaseDate: '2026-11-27',
    deadlineDate: '2026-12-06',
    comment: null
  },
  {
    week: 10,
    termWeek: 'Week 10T3',
    label: 'Week 10',
    releaseDate: '2026-12-04',
    deadlineDate: '2026-12-13',
    comment: 'GAA calculation closes'
  },
  {
    week: 11,
    termWeek: 'Week 11T3',
    label: 'Week 11',
    releaseDate: '2026-12-11',
    deadlineDate: '2026-12-23',
    comment: null
  },
  {
    week: 12,
    termWeek: 'Week 12T3',
    label: 'Week 12',
    releaseDate: '2026-12-11',
    deadlineDate: '2026-12-23',
    comment: null
  }
];

// Helper to load settings
export function getWhatsAppConfig() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      return data;
    }
  } catch (err) {
    console.error('Error reading whatsapp settings:', err);
  }

  return {
    enabled: false,
    provider: 'callmebot', // 'callmebot' | 'twilio'
    phone: process.env.WHATSAPP_PHONE || '',
    apiKey: process.env.WHATSAPP_APIKEY || '',
    notifyOnRelease: true,
    notifyOnDayBeforeDeadline: true,
    notifyOnDeadlineDay: true,
    notifyOnMilestones: true,
    lastCheckedDate: null
  };
}

// Helper to save settings
export function saveWhatsAppConfig(newConfig) {
  try {
    const current = getWhatsAppConfig();
    const merged = { ...current, ...newConfig };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf8');
    return merged;
  } catch (err) {
    console.error('Error saving whatsapp settings:', err);
    throw err;
  }
}

// Helper to get logs
export function getWhatsAppLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading whatsapp logs:', err);
  }
  return [];
}

// Helper to log message
export function logWhatsAppMessage(entry) {
  try {
    const logs = getWhatsAppLogs();
    logs.unshift({
      id: 'log_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    });
    // Keep last 100 logs
    const trimmed = logs.slice(0, 100);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing whatsapp logs:', err);
  }
}

/**
 * Send WhatsApp message using CallMeBot API or other providers
 */
export async function sendWhatsAppMessage(rawMessage, customPhone = null, customApiKey = null) {
  const config = getWhatsAppConfig();
  const phone = customPhone || config.phone;
  const apiKey = customApiKey || config.apiKey;

  if (!phone || !apiKey) {
    throw new Error('Phone number and CallMeBot API Key are required. Please configure them in Settings.');
  }

  // Clean phone number: remove +, spaces, dashes
  let cleanPhone = phone.replace(/[\s\+\-\(\)]/g, '');
  // Default to +91 if 10 digits without country code
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }

  const encodedMessage = encodeURIComponent(rawMessage);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedMessage}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    const success = response.ok && !text.toLowerCase().includes('error');
    logWhatsAppMessage({
      phone: cleanPhone,
      message: rawMessage,
      status: success ? 'DELIVERED' : 'FAILED',
      response: text
    });

    if (!success) {
      throw new Error(`CallMeBot response: ${text}`);
    }

    return { success: true, text };
  } catch (err) {
    logWhatsAppMessage({
      phone: cleanPhone,
      message: rawMessage,
      status: 'FAILED',
      error: err.message
    });
    throw err;
  }
}

/**
 * Check schedule against today and dispatch alerts if due
 */
export async function checkAndSendScheduledAlerts() {
  const config = getWhatsAppConfig();
  if (!config.enabled || !config.phone || !config.apiKey) {
    return { checked: false, reason: 'Notifications not enabled or missing credentials' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const logs = getWhatsAppLogs();

  // Helper: check if we already sent alert for this week & event type today
  const alreadySent = (key) => {
    return logs.some(l => 
      l.timestamp.startsWith(todayStr) && 
      l.status === 'DELIVERED' && 
      l.message && l.message.includes(key)
    );
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const results = [];

  for (const item of ASSIGNMENT_SCHEDULE) {
    // 1. Check Content Release (Today)
    if (config.notifyOnRelease && item.releaseDate === todayStr) {
      const key = `[RELEASE-${item.termWeek}]`;
      if (!alreadySent(key)) {
        const msg = 
`🔔 *IIT Madras - Assignment Released!* ${key}

📚 *${item.label} (${item.termWeek})*
आज कंटेंट रिलीज हो गया है!
📅 सबमिशन डेडलाइन: *${item.deadlineDate}*
${item.comment ? `⚠️ गेट नोट: *${item.comment}*\n` : ''}
अपनी पढ़ाई शुरू करें: http://localhost:3000`;

        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'RELEASE', week: item.label, success: true });
        } catch (e) {
          results.push({ type: 'RELEASE', week: item.label, success: false, error: e.message });
        }
      }
    }

    // 2. Check 24 Hours Before Deadline (Tomorrow is deadline)
    if (config.notifyOnDayBeforeDeadline && item.deadlineDate === tomorrowStr) {
      const key = `[DEADLINE-24H-${item.termWeek}]`;
      if (!alreadySent(key)) {
        const msg = 
`⚠️ *IIT Madras - Assignment Due Tomorrow!* ${key}

⏰ *${item.label}* असाइनमेंट सबमिट करने की आखिरी तारीख कल (*${item.deadlineDate}*) है!
${item.comment ? `🚩 *महत्वपूर्ण गेट:* ${item.comment}\n` : ''}
कृपया समय से पहले असाइनमेंट सबमिट कर दें ताकि आपका स्कोर सुरक्षित रहे।
Portal: http://localhost:3000`;

        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: '24H_DEADLINE', week: item.label, success: true });
        } catch (e) {
          results.push({ type: '24H_DEADLINE', week: item.label, success: false, error: e.message });
        }
      }
    }

    // 3. Check Deadline Day (Today)
    if (config.notifyOnDeadlineDay && item.deadlineDate === todayStr) {
      const key = `[DEADLINE-TODAY-${item.termWeek}]`;
      if (!alreadySent(key)) {
        const msg = 
`🚨 *IIT Madras - Deadline TODAY!* ${key}

⏳ *${item.label}* असाइनमेंट का सबमिशन आज रात समाप्त हो रहा है!
${item.comment ? `🚩 *महत्वपूर्ण:* ${item.comment}\n` : ''}
अगर आपने अभी तक सबमिट नहीं किया है, तो तुरंत सबमिट करें!`;

        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'TODAY_DEADLINE', week: item.label, success: true });
        } catch (e) {
          results.push({ type: 'TODAY_DEADLINE', week: item.label, success: false, error: e.message });
        }
      }
    }
  }

  saveWhatsAppConfig({ lastCheckedDate: todayStr });
  return { checked: true, today: todayStr, dispatched: results };
}

// Background scheduler that checks periodically (every 1 hour)
let schedulerInterval = null;

export function startWhatsAppScheduler() {
  if (schedulerInterval) clearInterval(schedulerInterval);

  console.log('⏰ WhatsApp Notification Scheduler active (checks every hour)');
  // Check immediately on startup
  setTimeout(() => {
    checkAndSendScheduledAlerts().catch(err => console.error('Initial alert check failed:', err.message));
  }, 5000);

  // Check every hour (3600000 ms)
  schedulerInterval = setInterval(() => {
    checkAndSendScheduledAlerts().catch(err => console.error('Scheduled alert check failed:', err.message));
  }, 3600000);
}
