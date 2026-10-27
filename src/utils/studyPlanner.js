const DAY = 86400000;
const roundMinutes = value => Math.ceil(value / 15) * 15;

function dayNumber(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error('Choose a valid date.');
  const time = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error('Choose a valid date.');
  return time / DAY;
}
const dateString = day => new Date(day * DAY).toISOString().slice(0, 10);
const normalize = text => String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function existingTopics(name, courses = [], tasks = []) {
  const selected = courses.filter(course => normalize(course.name) === normalize(name));
  const fromCourses = selected.flatMap(course => (course.weeks || []).flatMap(week => week.topics || []));
  const fromTasks = tasks.filter(task => normalize(task.subject) === normalize(name)).map(task => task.topic);
  const seen = new Set();
  return [...fromCourses, ...fromTasks].filter(topic => {
    if (typeof topic !== 'string' || !topic.trim() || seen.has(normalize(topic))) return false;
    seen.add(normalize(topic)); return true;
  }).map(topic => topic.trim());
}

export function generateStudyPlan({ startDate, dailyHours, subjects, courses = [], tasks = [] }) {
  const start = dayNumber(startDate);
  const dailyMinutes = Math.floor(Number(dailyHours) * 60);
  if (!Number.isFinite(dailyMinutes) || dailyMinutes < 15 || dailyMinutes > 960) throw new Error('Daily study time must be between 0.25 and 16 hours.');
  if (!Array.isArray(subjects) || !subjects.length || subjects.length > 20) throw new Error('Add between 1 and 20 subjects.');
  const jobs = [], summaries = [];
  for (const [index, subject] of subjects.entries()) {
    const name = String(subject.name || '').trim();
    if (!name) throw new Error('Enter a name for every subject.');
    const exam = dayNumber(subject.examDate), days = exam - start;
    if (days < 1) throw new Error(`${name}: exam date must be after your study start date.`);
    if (days > 366) throw new Error(`${name}: choose an exam within one year of the start date.`);
    let topics = [...new Set(String(subject.syllabus || '').split(/\r?\n/).map(line => line.trim().replace(/^[-*•]\s*/, '')).filter(Boolean))];
    let source = 'Your syllabus';
    if (!topics.length) { topics = existingTopics(name, courses, tasks); source = 'Existing app syllabus / tasks'; }
    if (!topics.length) {
      const count = Number(subject.topicCount);
      if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error(`${name}: no topics found. Paste your syllabus or enter a topic count.`);
      topics = Array.from({ length: count }, (_, i) => `Topic ${i + 1}`);
      source = 'Topic count only — replace these placeholders with your actual topics';
    }
    if (topics.length > 200 || jobs.length + topics.length * 2 > 1000) throw new Error('Use at most 200 topics per subject and 500 topics in total.');
    const estimate = Number(subject.hoursPerTopic);
    if (!Number.isFinite(estimate) || estimate <= 0 || estimate > 24) throw new Error(`${name}: estimated hours per topic must be greater than 0 and at most 24.`);
    const factor = { easy: 0.75, normal: 1, hard: 1.5 }[subject.difficulty || 'normal'];
    if (!factor) throw new Error('Choose a valid difficulty.');
    const learnMinutes = roundMinutes(estimate * factor * 60);
    // Review gets 20% of total effort; it follows each topic's first study session.
    const reviewMinutes = roundMinutes(learnMinutes / 4);
    const revisionDays = days > 1 ? Math.min(3, Math.ceil(days * 0.2), days - 1) : 0;
    const subjectId = `subject-${index}`;
    for (const [topicIndex, topic] of topics.entries()) {
      const learnId = `${subjectId}-${topicIndex}`;
      jobs.push({ id: learnId, subjectId, subject: name, topic, activity: 'Learn & practise', remaining: learnMinutes, target: Math.max(start, exam - revisionDays - 1), exam, release: start });
      jobs.push({ id: `${learnId}-review`, subjectId, subject: name, topic, activity: 'Revision & recall', remaining: reviewMinutes, target: exam - 1, exam, release: start, dependsOn: learnId });
    }
    const requiredMinutes = topics.length * (learnMinutes + reviewMinutes);
    summaries.push({ id: subjectId, name, examDate: subject.examDate, days, topics: topics.length, source, requiredMinutes, recommendedDailyHours: requiredMinutes / days / 60, scheduledMinutes: 0 });
  }
  const lastDay = Math.max(...jobs.map(job => job.exam)) - 1;
  const completed = new Set(), days = [];
  for (let day = start; day <= lastDay; day++) {
    let capacity = dailyMinutes;
    const sessions = [];
    while (capacity > 0) {
      const candidate = jobs.filter(job => job.remaining > 0 && day < job.exam && day >= job.release && (!job.dependsOn || completed.has(job.dependsOn)))
        .sort((a, b) => a.exam - b.exam || a.target - b.target || (a.activity === b.activity ? 0 : a.activity === 'Learn & practise' ? -1 : 1))[0];
      if (!candidate) break;
      const minutes = Math.min(60, capacity, candidate.remaining);
      const last = sessions[sessions.length - 1];
      if (last?.jobId === candidate.id) last.minutes += minutes;
      else sessions.push({ jobId: candidate.id, subjectId: candidate.subjectId, subject: candidate.subject, topic: candidate.topic, activity: candidate.activity, minutes });
      candidate.remaining -= minutes; capacity -= minutes;
      if (!candidate.remaining) completed.add(candidate.id);
    }
    days.push({ date: dateString(day), minutes: dailyMinutes - capacity, sessions });
  }
  for (const summary of summaries) summary.scheduledMinutes = days.reduce((total, day) => total + day.sessions.filter(session => session.subjectId === summary.id).reduce((sum, session) => sum + session.minutes, 0), 0);
  const remaining = jobs.filter(job => job.remaining > 0).map(job => ({ subject: job.subject, topic: job.topic, activity: job.activity, minutes: job.remaining }));
  const requiredMinutes = summaries.reduce((total, subject) => total + subject.requiredMinutes, 0);
  return { startDate, dailyHours: Number(dailyHours), days, subjects: summaries, requiredMinutes, scheduledMinutes: days.reduce((total, day) => total + day.minutes, 0), remaining, feasible: remaining.length === 0 };
}

export function planToCSV(plan) {
  const cell = value => '"' + String(value).replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"';
  const rows = [['Date', 'Subject', 'Activity', 'Topic', 'Minutes']];
  for (const day of plan.days) for (const session of day.sessions) rows.push([day.date, session.subject, session.activity, session.topic, session.minutes]);
  return rows.map(row => row.map(cell).join(',')).join('\r\n');
}
