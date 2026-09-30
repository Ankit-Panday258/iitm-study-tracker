export const getInitialTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    {
      id: '1',
      date: today,
      subject: 'MAD 1 Project',
      topic: 'Complete Flask routes and Jinja templates for Task Manager',
      durationMinutes: 90,
      priority: 'High',
      completed: true,
      completedAt: new Date().toISOString(),
      notes: 'Focus on CRUD operations and form validation'
    },
    {
      id: '2',
      date: today,
      subject: 'DBMS',
      topic: 'Normalization: 1NF, 2NF, 3NF & BCNF with examples',
      durationMinutes: 60,
      priority: 'High',
      completed: false,
      completedAt: null,
      notes: 'Solve assignment questions from Week 5'
    },
    {
      id: '3',
      date: today,
      subject: 'System Commands',
      topic: 'Shell scripting: loops, conditionals & file processing',
      durationMinutes: 45,
      priority: 'Medium',
      completed: false,
      completedAt: null,
      notes: 'Practice grep, awk, sed commands'
    },
    {
      id: '4',
      date: today,
      subject: 'DBMS',
      topic: 'SQL Joins and Subqueries practice problems',
      durationMinutes: 45,
      priority: 'Medium',
      completed: true,
      completedAt: new Date().toISOString(),
      notes: 'Completed 10 queries from practice set'
    }
  ];
};

export const SUBJECT_OPTIONS = [
  { name: 'MAD 1 Project', color: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700', icon: '💻' },
  { name: 'DBMS', color: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-200 dark:border-gray-600', icon: '🗄️' },
  { name: 'System Commands', color: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-200 dark:border-pink-800', icon: '⚙️' },
];
