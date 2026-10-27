import test from 'node:test';
import assert from 'node:assert/strict';
import { generateStudyPlan, existingTopics, planToCSV } from '../src/utils/studyPlanner.js';
const subject = (overrides = {}) => ({ name: 'Java', examDate: '2026-11-05', syllabus: 'Variables\nLoops', hoursPerTopic: 1, difficulty: 'normal', ...overrides });
const makePlan = (overrides = {}) => generateStudyPlan({ startDate: '2026-11-01', dailyHours: 2, subjects: [subject()], ...overrides });

test('all study and revision effort is conserved, within daily capacity and before each exam', () => {
  const plan = makePlan({ subjects: [subject(), subject({ name: 'Python', examDate: '2026-11-03' })] });
  assert.equal(plan.feasible, true);
  assert.equal(plan.requiredMinutes, plan.scheduledMinutes);
  const learned = new Set();
  for (const day of plan.days) {
    assert.ok(day.minutes <= 120);
    for (const session of day.sessions) {
      assert.ok(day.date < (session.subject === 'Python' ? '2026-11-03' : '2026-11-05'));
      const key = session.subject + session.topic;
      if (session.activity === 'Revision & recall') assert.ok(learned.has(key));
      else learned.add(key);
    }
  }
});
test('insufficient time is reported with actual unfinished work, never fabricated completion', () => {
  const plan = makePlan({ dailyHours: 0.5, subjects: [subject({ examDate: '2026-11-02', hoursPerTopic: 4 })] });
  assert.equal(plan.feasible, false);
  assert.equal(plan.scheduledMinutes, 30);
  assert.equal(plan.remaining.reduce((sum, item) => sum + item.minutes, 0) + plan.scheduledMinutes, plan.requiredMinutes);
});
test('earlier exams keep priority including revision even when a later syllabus is large', () => {
  const plan = makePlan({ dailyHours: 1.25, subjects: [subject({ name: 'Early', examDate: '2026-11-02', syllabus: 'First' }), subject({ name: 'Later', examDate: '2026-11-10', topicCount: 4, syllabus: '' })] });
  assert.equal(plan.feasible, true);
  assert.equal(plan.days[0].sessions.every(session => session.subject === 'Early'), true);
  assert.equal(plan.days[0].minutes, 75);
});
test('imports only the requested subject and uses explicit count placeholders when unavailable', () => {
  const courses = [{ name: 'JAVA', weeks: [{ topics: ['Loops', 'Loops', 'Methods'] }] }];
  assert.deepEqual(existingTopics(' Java ', courses, [{ subject: 'Python', topic: 'Other' }]), ['Loops', 'Methods']);
  const imported = makePlan({ courses, subjects: [subject({ syllabus: '' })] });
  assert.equal(imported.subjects[0].topics, 2);
  assert.match(imported.subjects[0].source, /Existing/);
  const counted = makePlan({ subjects: [subject({ syllabus: '', topicCount: 3 })] });
  assert.equal(counted.subjects[0].topics, 3);
  assert.match(counted.subjects[0].source, /placeholders/);
});
test('rejects impossible dates, bad effort and absent topic information', () => {
  assert.throws(() => makePlan({ startDate: '2026-02-30' }), /valid date/);
  assert.throws(() => makePlan({ subjects: [subject({ examDate: '2026-11-01' })] }), /after/);
  assert.throws(() => makePlan({ dailyHours: 0 }), /Daily study time/);
  assert.throws(() => makePlan({ subjects: [subject({ syllabus: '' })] }), /no topics found/);
});
test('CSV includes scheduled minutes and escapes spreadsheet formulas', () => {
  const csv = planToCSV(makePlan({ subjects: [subject({ name: '=Java', syllabus: '"quoted", topic' })] }));
  assert.match(csv, /'\=Java/);
  assert.match(csv, /""quoted""/);
});
