export function formatTaskDuration(task) {
  if (!task) return '0 min';

  let hrs = Number(task.durationHours) || 0;
  let mins = Number(task.durationMinutes) || 0;
  let secs = Number(task.durationSeconds) || 0;

  // If task only has legacy durationMinutes without hours/seconds specified
  if (task.durationHours === undefined && task.durationSeconds === undefined) {
    hrs = Math.floor(mins / 60);
    mins = Math.floor(mins % 60);
  }

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} hr`);
  if (mins > 0 || (hrs === 0 && secs === 0)) parts.push(`${mins} min`);
  if (secs > 0) parts.push(`${secs} sec`);

  return parts.join(' ');
}

export function getTotalDurationSeconds(task) {
  if (!task) return 0;
  const hrs = Number(task.durationHours) || 0;
  const mins = Number(task.durationMinutes) || 0;
  const secs = Number(task.durationSeconds) || 0;

  if (task.durationHours === undefined && task.durationSeconds === undefined) {
    return Math.round(mins * 60);
  }

  return (hrs * 3600) + (mins * 60) + secs;
}

export function formatTotalTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  const parts = [];
  if (hrs > 0) parts.push(`${hrs}h`);
  if (mins > 0 || (hrs === 0 && secs === 0)) parts.push(`${mins}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

export function getLocalDateString(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
