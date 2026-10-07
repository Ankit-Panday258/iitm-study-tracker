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

export const OFFICIAL_EXAMS = [
  {
    id: 'quiz1',
    name: 'Quiz 1',
    dateStr: 'Sunday, November 15, 2026',
    date: '2026-11-15',
    scope: 'Weeks 1 to 4 Content'
  },
  {
    id: 'quiz2',
    name: 'Quiz 2',
    dateStr: 'Saturday, December 5, 2026',
    date: '2026-12-05',
    scope: 'Weeks 5 to 8 Content'
  },
  {
    id: 'endterm',
    name: 'End Term Exam',
    dateStr: 'Sunday, January 10, 2027',
    date: '2027-01-10',
    scope: 'All Weeks 1 to 12'
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
Content has been released today!
📅 Submission Deadline: *${item.deadlineDate}*
${item.comment ? `⚠️ Milestone Gate: *${item.comment}*\n` : ''}
Start studying now: http://localhost:3000`;

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

⏰ *${item.label}* assignment submission deadline is tomorrow (*${item.deadlineDate}*)!
${item.comment ? `🚩 *Important Gate:* ${item.comment}\n` : ''}
Please submit before the deadline to protect your score!
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

⏳ *${item.label}* assignment submission closes tonight!
${item.comment ? `🚩 *Important:* ${item.comment}\n` : ''}
If you haven't submitted yet, please submit immediately!`;

        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'TODAY_DEADLINE', week: item.label, success: true });
        } catch (e) {
          results.push({ type: 'TODAY_DEADLINE', week: item.label, success: false, error: e.message });
        }
      }
    }
  }

  // 4. Check Official Exams Alerts (Today, 1 day before, 7 days before)
  const in7Days = new Date();
  in7Days.setDate(in7Days.getDate() + 7);
  const in7DaysStr = in7Days.toISOString().split('T')[0];

  for (const exam of OFFICIAL_EXAMS) {
    if (exam.date === todayStr) {
      const key = `[EXAM-TODAY-${exam.id}]`;
      if (!alreadySent(key)) {
        const msg = 
`🏆 *IIT Madras - Official Exam TODAY!* ${key}

📝 *${exam.name}* is taking place TODAY (*${exam.dateStr}*)!
📚 Scope: ${exam.scope}
Wishing you the very best of luck! You've prepared well! 🚀`;
        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'EXAM_TODAY', exam: exam.name, success: true });
        } catch (e) {
          results.push({ type: 'EXAM_TODAY', exam: exam.name, success: false, error: e.message });
        }
      }
    } else if (exam.date === tomorrowStr) {
      const key = `[EXAM-TOMORROW-${exam.id}]`;
      if (!alreadySent(key)) {
        const msg = 
`⚠️ *IIT Madras - Official Exam Tomorrow!* ${key}

📝 *${exam.name}* takes place TOMORROW (*${exam.dateStr}*)!
📚 Scope: ${exam.scope}
Please verify your hall ticket / admit card & exam center or portal link. Best of luck!`;
        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'EXAM_TOMORROW', exam: exam.name, success: true });
        } catch (e) {
          results.push({ type: 'EXAM_TOMORROW', exam: exam.name, success: false, error: e.message });
        }
      }
    } else if (exam.date === in7DaysStr) {
      const key = `[EXAM-7DAYS-${exam.id}]`;
      if (!alreadySent(key)) {
        const msg = 
`📅 *IIT Madras - 7-Day Exam Alert!* ${key}

📝 *${exam.name}* is in exactly 7 days (*${exam.dateStr}*)!
📚 Scope: ${exam.scope}
Start your final revision topics on your Study Tracker portal!
Portal: http://localhost:3000`;
        try {
          await sendWhatsAppMessage(msg);
          results.push({ type: 'EXAM_7DAYS', exam: exam.name, success: true });
        } catch (e) {
          results.push({ type: 'EXAM_7DAYS', exam: exam.name, success: false, error: e.message });
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
