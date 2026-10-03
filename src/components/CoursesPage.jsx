import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Play, ExternalLink, Copy, Check, ArrowLeft, Plus,
  Trash2, Folder, Sparkles, Search, Video, CheckCircle2,
  Calendar, Terminal, Cpu, HardDrive, Layers, Globe, Clock, ChevronDown, ChevronUp
} from 'lucide-react';

export const SYSTEM_COMMANDS_DRIVE_URL = 'https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv';
const STORAGE_KEY_COURSES = 'iitm_courses_syllabus_v4';
const STORAGE_KEY_CHECKLIST = 'iitm_syllabus_checklist_v2';

export const INITIAL_COURSES_DATA = [
  {
    id: 'sys_cmd',
    name: 'System Commands',
    hindiName: 'सिस्टम कमांड (Linux & Shell Scripting)',
    icon: '⚙️',
    description: 'IIT Madras System Commands — Complete 8-Week Curriculum with Recommended Hindi Video Masterclasses and Notes Drive.',
    driveUrl: SYSTEM_COMMANDS_DRIVE_URL,
    badge: 'Core IITM Subject',
    weeks: [
      {
        id: 'sys_w1',
        weekNumber: 1,
        title: 'Week 1: Linux Intro, Terminal & Basic Commands',
        description: 'Linux intro, terminal, basic commands, hardware/system information, packages',
        topics: [
          'Linux intro & GNU philosophy',
          'Terminal & basic navigation (pwd, ls, cd)',
          'Basic file operations (cat, touch, mkdir, cp, mv, rm)',
          'Hardware & system info (uname, lscpu, free, df, top)',
          'Package management (apt update, apt install)'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Linux for Beginners in One Video: 100 Commands',
          highlights: 'System info, memory, packages, processes, networking',
          notes: 'M Prashant — Linux for Beginners in One Video: 100 Commands — इसमें system info, memory, packages, processes, networking आदि भी हैं; लगभग 2h 48m।',
          url: 'https://youtu.be/Byx4sgLR88E',
          youtubeId: 'Byx4sgLR88E'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'uname -a / lscpu', label: 'System Info', desc: 'Kernel version & CPU specs' },
          { cmd: 'free -h / df -h', label: 'Memory & Disk', desc: 'RAM usage & disk space' },
          { cmd: 'apt update && apt install', label: 'Packages', desc: 'Software package manager' },
          { cmd: 'ps aux / top', label: 'Processes', desc: 'Active process monitor' }
        ]
      },
      {
        id: 'sys_w2',
        weekNumber: 2,
        title: 'Week 2: Packages, File Types & Permissions',
        description: 'Packages, file types, permissions, $HOME/$USER/$PATH',
        topics: [
          'Package managers & repositories',
          'File types (regular, directory, symlink, device files)',
          'Linux permissions: Read (r), Write (w), Execute (x)',
          'chmod — Numeric (755, 644) and Symbolic (u+x, g-w) mode',
          'File ownership (chown, chgrp)',
          'Environment variables: $HOME, $USER, $PATH, $SHELL'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Linux File Permissions for Beginners — chmod, numeric/symbolic, ownership',
          highlights: 'chmod, permissions, ownership, $HOME, $USER, $PATH',
          notes: 'M Prashant — Linux File Permissions for Beginners — chmod, numeric/symbolic permissions, ownership अच्छी तरह cover करता है।',
          url: 'https://youtu.be/4p2zkY8Q-LQ',
          youtubeId: '4p2zkY8Q-LQ'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'chmod 755 script.sh', label: 'chmod Numeric', desc: 'Owner rwx, Group rx, Others rx' },
          { cmd: 'chmod u+x filename', label: 'chmod Symbolic', desc: 'Add execute permission for owner' },
          { cmd: 'chown user:group file', label: 'Ownership', desc: 'Change file owner and group' },
          { cmd: 'echo $PATH', label: 'Environment', desc: 'Inspect executable binary search path' }
        ]
      },
      {
        id: 'sys_w3',
        weekNumber: 3,
        title: 'Week 3: Links, Inodes, Filesystem & Processes',
        description: 'Hard/soft links, inode, filesystem, aliases, processes, remote access',
        topics: [
          'Hard links vs Soft links (symlinks: ln vs ln -s)',
          'Inode numbers & filesystem metadata (ls -i, stat)',
          'Linux Filesystem Hierarchy Standard (FHS: /etc, /bin, /var)',
          'Bash aliases & configuration (.bashrc, alias ll="ls -la")',
          'Process management & background jobs (ps, kill, bg, fg, jobs)',
          'Remote access with SSH & SCP (ssh user@host)'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Hard & Soft Links + Environment Variables + Alias + Process + SSH',
          highlights: 'Hard/soft links, inode, filesystem, aliases, processes, SSH',
          notes: 'इसी M Prashant Linux course के Hard & Soft Links + Environment Variables + Alias + Process + SSH वाले lessons follow करो; ये topics उसके course curriculum में अलग-अलग Hindi lessons के रूप में मौजूद हैं।',
          url: 'https://youtu.be/rrw-Pv3rc0E',
          youtubeId: 'rrw-Pv3rc0E'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'ln -s source.txt link.txt', label: 'Soft Link', desc: 'Create symbolic link' },
          { cmd: 'ln file.txt hardlink.txt', label: 'Hard Link', desc: 'Create hard link pointing to same inode' },
          { cmd: 'ls -i / stat file.txt', label: 'Inode Info', desc: 'View inode number & file metadata' },
          { cmd: 'ssh user@remote_ip', label: 'SSH Remote', desc: 'Secure shell remote terminal access' }
        ]
      },
      {
        id: 'sys_w4',
        weekNumber: 4,
        title: 'Week 4: Redirection, Pipes, Regex, grep & Bash Intro',
        description: 'Redirection, pipes, regex, grep/egrep, find, editors, Bash intro',
        topics: [
          'Standard I/O streams: stdin (0), stdout (1), stderr (2)',
          'Redirection operators (>, >>, 2>, &>, <)',
          'Pipes (|) for command chaining and stream composition',
          'Regular expressions (Regex basics: ^, $, ., *, [])',
          'Pattern searching with grep and egrep (grep -r, grep -i, grep -v)',
          'File discovery with find (find . -name "*.log" -type f)',
          'Terminal text editors (nano, vim basics)'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Shell Scripting Tutorial in One Video — Shell, Scripts, Variables, Loops',
          highlights: 'Shell, scripts, variables, conditions, loops, execution',
          notes: 'M Prashant — Shell Scripting Tutorial in One Video — shell, scripts, variables, conditions, loops और execution/permissions cover करता है।',
          url: 'https://youtu.be/M6nZpfIIFEM',
          youtubeId: 'M6nZpfIIFEM'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'command > output.txt 2>&1', label: 'Redirection', desc: 'Redirect stdout & stderr to file' },
          { cmd: 'cat file.txt | grep "error"', label: 'Pipe + Grep', desc: 'Stream filtering using pipe' },
          { cmd: 'grep -E "^[0-9]+" file', label: 'Regex Egrep', desc: 'Match patterns starting with numbers' },
          { cmd: 'find /var/log -name "*.log"', label: 'Find Files', desc: 'Locate files matching name pattern' }
        ]
      },
      {
        id: 'sys_w5',
        weekNumber: 5,
        title: 'Week 5: Bash Variables, Arguments, Loops & Cron Jobs',
        description: 'Bash variables, arguments, if/else, loops, functions, scheduled tasks',
        topics: [
          'Shebang line (#!/bin/bash) & script execution',
          'Positional parameters ($0, $1, $#, $@, $?)',
          'Conditional logic: if, elif, else, test condition [ ... ]',
          'Loops in Bash: for, while, until loops',
          'Bash modular functions & return exit codes',
          'Scheduled tasks with Crontab (crontab -e, cron syntax)'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Shell Scripting Deep Dive & Dedicated Cron Job Lesson',
          highlights: 'Variables, arguments, if/else, loops, functions, Cron job schedule',
          notes: 'उसी Shell Scripting video को continue करो; इसके बाद Cron Job lesson करो। M Prashant के syllabus में Cron का dedicated Hindi practical भी है।',
          url: 'https://youtu.be/M6nZpfIIFEM',
          youtubeId: 'M6nZpfIIFEM'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'crontab -e', label: 'Edit Cron', desc: 'Open user crontab file to schedule tasks' },
          { cmd: '0 0 * * * /backup.sh', label: 'Daily Cron', desc: 'Run backup.sh every midnight' },
          { cmd: 'for i in {1..5}; do ... done', label: 'For Loop', desc: 'Bash loop iteration construct' },
          { cmd: 'if [ $# -eq 0 ]; then ... fi', label: 'Arguments Check', desc: 'Check command line argument count' }
        ]
      },
      {
        id: 'sys_w6',
        weekNumber: 6,
        title: 'Week 6: AWK, SED & Text Stream Processing',
        description: 'AWK + regex + sed + text processing',
        topics: [
          'Stream Editor (SED): substitute (s/old/new/g), delete (d)',
          'Pattern matching and in-place file editing (sed -i)',
          'AWK structure: pattern { action }',
          'AWK field variables: $0 (line), $1, $2, $NF (last field)',
          'AWK built-in variables: NR (line number), FS (field separator), OFS',
          'AWK BEGIN and END summary report generation'
        ],
        video: {
          instructor: 'M Prashant',
          title: 'Master Linux AWK: From Basics to Advanced Techniques + Linux SED Command',
          highlights: 'AWK, regex, sed, stream text processing, field extraction',
          notes: 'M Prashant — Master Linux AWK: From Basics to Advanced Techniques + Linux SED Command। AWK और SED से structured data parsing का complete Hindi practical.',
          url: 'https://youtu.be/TtGM9GfBuok',
          youtubeId: 'TtGM9GfBuok'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: "sed 's/foo/bar/g' file.txt", label: 'SED Substitute', desc: 'Replace all occurrences of foo with bar' },
          { cmd: "awk -F':' '{print $1, $3}' /etc/passwd", label: 'AWK Fields', desc: 'Extract username and UID using colon separator' },
          { cmd: "awk '{sum+=$1} END {print sum}' data.txt", label: 'AWK Sum', desc: 'Compute cumulative total using END block' }
        ]
      },
      {
        id: 'sys_w7',
        weekNumber: 7,
        title: 'Week 7: Make, Archiving, Networking & Diagnostics',
        description: 'make, tar/zip/gzip, IP, ports, DNS, networking diagnostics',
        topics: [
          'Build automation: make and Makefile target dependencies',
          'Archiving & compression: tar (-cvf, -xvf, -zcvf), gzip, zip, unzip',
          'Network addressing: IPv4, IPv6, subnets, ports & DNS',
          'Diagnostic tools: ip a, ping, netstat/ss, traceroute',
          'DNS resolution queries: dig, nslookup, host',
          'Hostname, routing table & port listening inspection'
        ],
        video: {
          instructor: 'M Prashant & Networking Guide',
          title: '50 Linux Networking Commands + Tar/Gzip/Zip Archive Tutorial',
          highlights: 'ip, ping, netstat/ss, dig, nslookup, hostname, tar/gzip/zip',
          notes: 'Linux Networking: 50 Linux Networking Commands You Need to Learn Right Now — इसमें ip, ping, netstat/ss, dig, nslookup, hostname शामिल हैं। साथ ही M Prashant का tar/gzip/zip video भी करें।',
          url: 'https://youtu.be/PCXek0zEVtc',
          youtubeId: 'PCXek0zEVtc',
          extraVideos: [
            {
              instructor: 'M Prashant',
              title: 'M Prashant — Tar, Gzip & Zip Archiving in Linux',
              url: 'https://youtu.be/q7_kgvJsk0s',
              youtubeId: 'q7_kgvJsk0s'
            }
          ]
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'tar -czvf backup.tar.gz /folder', label: 'Tar + Gzip', desc: 'Create compressed archive' },
          { cmd: 'tar -xzvf backup.tar.gz', label: 'Extract Tar', desc: 'Extract compressed archive' },
          { cmd: 'ss -tuln / netstat -tuln', label: 'Open Ports', desc: 'List listening TCP & UDP sockets' },
          { cmd: 'dig example.com / nslookup', label: 'DNS Query', desc: 'Perform DNS record lookup' }
        ]
      },
      {
        id: 'sys_w8',
        weekNumber: 8,
        title: 'Week 8: RAID Basics, Git & GitHub Collaboration',
        description: 'RAID basics + Git, branches, repositories, PR, collaboration',
        topics: [
          'RAID fundamentals: RAID 0 (striping), RAID 1 (mirroring), RAID 5 & 10',
          'Version control concepts: Working directory, Staging area, Git HEAD',
          'Core Git commands: git init, git add, git commit, git status, git log',
          'Branch management: git branch, git checkout, git switch, git merge',
          'Merge conflicts resolution & diff inspection (git diff, git stash)',
          'GitHub collaboration: git remote, push, pull, clone, Fork & Pull Requests (PR)'
        ],
        video: {
          instructor: 'Chai aur Code (Hitesh Choudhary)',
          title: 'Complete Git and GitHub Course in Hindi — From Basics to PR & Collaboration',
          highlights: 'Git basics, terminology, branches/conflicts, diff/stash/tag, rebase, GitHub',
          notes: 'Chai aur Code — Complete Git and GitHub Course in Hindi — Git basics, terminology, branches/conflicts, diff/stash/tag, rebase, GitHub. Zero to Advanced production workflow.',
          url: 'https://youtu.be/q8EevlEpQ2A',
          youtubeId: 'q8EevlEpQ2A'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'git init && git add . && git commit -m "init"', label: 'Git Commit', desc: 'Stage all files and commit' },
          { cmd: 'git branch feature && git switch feature', label: 'Branching', desc: 'Create and switch to new branch' },
          { cmd: 'git merge feature', label: 'Merge', desc: 'Merge branch into current branch' },
          { cmd: 'git remote add origin <url> && git push -u origin main', label: 'GitHub Remote', desc: 'Connect and push to GitHub' }
        ]
      }
    ]
  },
  {
    id: 'mad_1',
    name: 'MAD 1 Project',
    hindiName: 'मॉडर्न ऐप डेवलपमेंट 1',
    icon: '💻',
    description: 'Modern Application Development 1 — Python, Flask Backend, Jinja2 Templates, SQLite & REST APIs.',
    driveUrl: '',
    badge: 'Development Lab',
    weeks: [
      {
        id: 'mad_w1',
        weekNumber: 1,
        title: 'Week 1: Flask Setup, Routing & Jinja2 Templates',
        description: 'Virtual environment configuration, initializing Flask application, dynamic routing, and template inheritance.',
        topics: ['Virtualenv & pip', 'Flask app factory', 'Dynamic URL routing', 'Jinja2 layout & filters'],
        video: null,
        keyCommands: [
          { cmd: 'python3 -m venv venv', label: 'Virtual Environment', desc: 'Create isolated Python environment' },
          { cmd: 'pip install flask', label: 'Package Setup', desc: 'Install Flask web framework' }
        ]
      }
    ]
  },
  {
    id: 'dbms',
    name: 'DBMS',
    hindiName: 'डेटाबेस मैनेजमेंट सिस्टम',
    icon: '🗄️',
    description: 'Database Management Systems — Relational Algebra, SQL Queries, Schema Normalization (1NF to BCNF).',
    driveUrl: '',
    badge: 'Theory & SQL Lab',
    weeks: [
      {
        id: 'dbms_w1',
        weekNumber: 1,
        title: 'Week 1: Relational Model & SQL Fundamentals',
        description: 'Relational data models, ER diagrams to table mapping, SQL DDL/DML statements, basic queries.',
        topics: ['Relational Data Model', 'Primary & Foreign Keys', 'SQL CREATE, INSERT, SELECT', 'Filtering with WHERE & ORDER BY'],
        video: null,
        keyCommands: [
          { cmd: 'SELECT * FROM students WHERE grade = "A";', label: 'SQL Query', desc: 'Filter database table records' },
          { cmd: 'CREATE TABLE ...', label: 'DDL', desc: 'Define relational schema' }
        ]
      }
    ]
  }
];

export default function CoursesPage({ onBack, onAddTask, showToast }) {
  // Load courses
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ensure system commands has all 8 weeks with video & notes
          return parsed.map(c => {
            if (c.id === 'sys_cmd' && (!c.weeks || c.weeks.length < 8)) {
              return INITIAL_COURSES_DATA[0];
            }
            return c;
          });
        }
      }
    } catch (e) {}
    return INITIAL_COURSES_DATA;
  });

  const [activeCourseId, setActiveCourseId] = useState('sys_cmd');
  const [copiedLink, setCopiedLink] = useState('');
  const [expandedVideoWeekId, setExpandedVideoWeekId] = useState('sys_w1');
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  // Modal to add a new week or syllabus
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [newWeekNum, setNewWeekNum] = useState(2);
  const [newWeekTitle, setNewWeekTitle] = useState('');
  const [newWeekTopics, setNewWeekTopics] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoInstructor, setNewVideoInstructor] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoNotes, setNewVideoNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(completedTopics));
    } catch (e) {}
  }, [completedTopics]);

  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLink(text);
      if (showToast) showToast(`${label || 'Link'} copied to clipboard!`);
      setTimeout(() => setCopiedLink(''), 2000);
    });
  };

  const toggleTopicCheck = (topicKey) => {
    setCompletedTopics(prev => {
      const next = { ...prev, [topicKey]: !prev[topicKey] };
      return next;
    });
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleAddWeekToToday = (week) => {
    if (!onAddTask) return;

    const taskData = {
      subject: activeCourse.name,
      topic: `${week.title} (${week.topics.slice(0, 3).join(', ')})`,
      durationMinutes: 90,
      priority: 'High',
      notes: week.video 
        ? `${week.video.instructor}: ${week.video.title} - ${week.video.url}\n${week.video.notes}`
        : `Syllabus Topics: ${week.topics.join(', ')}`
    };

    onAddTask(taskData);
    if (showToast) {
      showToast(`Added ${activeCourse.name} ${week.title} to today's tasks! 🎯`);
    }
  };

  const handleSaveNewWeek = (e) => {
    e.preventDefault();
    if (!newWeekTitle.trim()) return;

    const topicsArray = newWeekTopics
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // Extract YouTube ID if valid
    let ytId = '';
    if (newVideoUrl) {
      const match = newVideoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) ytId = match[1];
    }

    const newWeekObj = {
      id: `${activeCourseId}_w${Date.now()}`,
      weekNumber: parseInt(newWeekNum, 10) || 2,
      title: newWeekTitle.trim(),
      description: `Syllabus topics for Week ${newWeekNum}`,
      topics: topicsArray.length > 0 ? topicsArray : [newWeekTitle.trim()],
      video: newVideoUrl.trim() ? {
        instructor: newVideoInstructor.trim() || 'Instructor',
        title: newVideoTitle.trim() || 'Video Lecture',
        highlights: 'Course lecture',
        notes: newVideoNotes.trim() || '',
        url: newVideoUrl.trim(),
        youtubeId: ytId
      } : null,
      keyCommands: []
    };

    setCourses(prev => prev.map(c => {
      if (c.id === activeCourseId) {
        return {
          ...c,
          weeks: [...(c.weeks || []), newWeekObj]
        };
      }
      return c;
    }));

    setNewWeekTitle('');
    setNewWeekTopics('');
    setNewVideoTitle('');
    setNewVideoInstructor('');
    setNewVideoUrl('');
    setNewVideoNotes('');
    setIsAddWeekModalOpen(false);

    if (showToast) showToast('New week syllabus added successfully!');
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 animate-fadeIn">
      
      {/* Top Header Row with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 shadow-sm active:scale-95 transition-all"
            title="Back to Tasks"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                <span>Courses & Syllabus (कोर्स एवं सिलेबस)</span>
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                IIT Madras
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Weekly Syllabus, Video Lecture Links, Recommended YouTube Tutorials & Official Materials
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddWeekModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-pink-600/30 border border-pink-600 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Week / Video</span>
          </button>
        </div>
      </div>

      {/* Course Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {courses.map(course => {
          const isActive = course.id === activeCourseId;
          return (
            <button
              key={course.id}
              onClick={() => setActiveCourseId(course.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-800'
              }`}
            >
              <span className="text-base">{course.icon}</span>
              <span>{course.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-pink-700/60 text-pink-100' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}`}>
                {course.weeks?.length || 0} {course.weeks?.length === 1 ? 'Week' : 'Weeks'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Course Overview Header Card */}
      <div className="bg-gradient-to-br from-pink-50/80 via-white to-pink-50/30 dark:from-pink-950/30 dark:via-slate-900 dark:to-pink-950/20 border-2 border-pink-300 dark:border-pink-800/80 rounded-3xl p-5 sm:p-6 mb-6 shadow-lg shadow-pink-600/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xl">{activeCourse.icon}</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                {activeCourse.name}
              </h2>
              {activeCourse.hindiName && (
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/40 px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                  {activeCourse.hindiName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {activeCourse.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeCourse.driveUrl && (
              <a
                href={activeCourse.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-pink-200 dark:border-pink-800 font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Google Drive Materials</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Weeks List / Syllabus Section */}
      <div className="space-y-6">
        {activeCourse.weeks && activeCourse.weeks.map((week) => {
          const isVideoExpanded = expandedVideoWeekId === week.id;
          const totalTopics = week.topics.length;
          const completedCount = week.topics.filter((_, idx) => completedTopics[`${week.id}_${idx}`]).length;
          const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

          return (
            <div
              key={week.id}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Card Header: Week number & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-pink-600/30">
                    W{week.weekNumber}
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                      {week.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {week.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddWeekToToday(week)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-900/30 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 font-bold text-xs border border-pink-200 dark:border-pink-800 transition-all active:scale-95 shadow-sm"
                    title="Add this week to today's study tasks"
                  >
                    <Plus className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>Add to Today's Tasks</span>
                  </button>
                </div>
              </div>

              {/* Prominent Action Pill Buttons matching User Sketch: [ Video ] and [ Notes ] */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-5 p-3 rounded-2xl bg-gray-50/90 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 shadow-sm">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Quick Access:
                </span>
                {week.video?.url && (
                  <a
                    href={week.video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/30 border-2 border-red-700 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Video</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {week.video?.extraVideos && week.video.extraVideos.map((ev, evIdx) => (
                  <a
                    key={evIdx}
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-600/20 border-2 border-red-700 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Video 2 (Tar/Zip)</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                ))}
                {week.notesUrl && (
                  <a
                    href={week.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/60 active:scale-95 text-pink-700 dark:text-pink-300 font-extrabold text-xs sm:text-sm border-2 border-pink-400 dark:border-pink-600 shadow-sm transition-all cursor-pointer"
                  >
                    <Folder className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span>Notes</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
              </div>

              {/* Syllabus Topics Section */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>📌</span>
                    <span>Syllabus Topics (सिलेबस)</span>
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-500 dark:text-slate-400">
                      Progress: {completedCount}/{totalTopics} ({progressPercent}%)
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-pink-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Topics Grid with Interactive Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {week.topics.map((topic, idx) => {
                    const topicKey = `${week.id}_${idx}`;
                    const isDone = !!completedTopics[topicKey];

                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTopicCheck(topicKey)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                          isDone
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : 'bg-gray-50 dark:bg-slate-800/70 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 hover:border-pink-300 dark:hover:border-pink-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-semibold ${isDone ? 'line-through text-emerald-700 dark:text-emerald-400' : ''}`}>
                          {topic}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIDEO RESOURCE CARD (YouTube Tutorial) */}
              {week.video && (
                <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/50 dark:from-rose-950/20 dark:via-slate-800/80 dark:to-pink-950/20 border-2 border-rose-200 dark:border-rose-900/60 rounded-3xl p-4 sm:p-5 mb-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
                        <Video className="w-5 h-5 fill-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                            YouTube Masterclass
                          </span>
                          <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
                            by {week.video.instructor}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-gray-900 dark:text-white mt-0.5">
                          {week.video.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Watch on YouTube External */}
                      <a
                        href={week.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-red-600/30 border border-red-600 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>

                      {/* Embed Toggle inside App */}
                      <button
                        onClick={() => setExpandedVideoWeekId(isVideoExpanded ? null : week.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-bold text-xs border border-gray-200 dark:border-slate-700 shadow-sm active:scale-95 transition-all"
                      >
                        <span>{isVideoExpanded ? 'Hide Player' : 'Play Inside App'}</span>
                        {isVideoExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={() => handleCopy(week.video.url, 'Video link')}
                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-all active:scale-95"
                        title="Copy video link"
                      >
                        {copiedLink === week.video.url ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Highlights and Notes provided by user */}
                  <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-3 border border-pink-100 dark:border-slate-800 text-xs text-gray-700 dark:text-slate-300 mb-2">
                    <p className="font-semibold text-pink-700 dark:text-pink-300 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{week.video.notes}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase">Topics in video:</span>
                      {week.video.highlights.split(',').map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-semibold text-[11px] border border-gray-200 dark:border-slate-700"
                        >
                          {h.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Embedded In-App YouTube Player */}
                  {isVideoExpanded && week.video.youtubeId && (
                    <div className="mt-4 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-slate-700 bg-black aspect-video max-w-3xl mx-auto animate-fadeIn">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${week.video.youtubeId}?autoplay=1&rel=0`}
                        title={week.video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Key Commands Cheatsheet for System Commands Week 1 */}
              {week.keyCommands && week.keyCommands.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                    <Terminal className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                    <span>Week 1 Essential Commands Reference</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {week.keyCommands.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <code className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-pink-100 dark:border-slate-800">
                            {item.cmd}
                          </code>
                          <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-slate-400">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Add Week / Topic */}
      {isAddWeekModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Add Week / Syllabus Topic
                </h3>
                <p className="text-xs text-gray-500">
                  Course: <span className="font-bold text-pink-600">{activeCourse.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsAddWeekModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewWeek} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">
                    Week #
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newWeekNum}
                    onChange={(e) => setNewWeekNum(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">
                    Week Title *
                  </label>
                  <input
                    type="text"
                    value={newWeekTitle}
                    onChange={(e) => setNewWeekTitle(e.target.value)}
                    placeholder="e.g. Week 2: Shell Scripting & Grep"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">
                  Syllabus Topics (comma-separated) *
                </label>
                <textarea
                  rows="2"
                  value={newWeekTopics}
                  onChange={(e) => setNewWeekTopics(e.target.value)}
                  placeholder="e.g. Bash loops, conditionals, grep regex, file processing"
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-3">
                <span className="font-bold text-red-600 dark:text-red-400 block text-xs">
                  📺 Video Lecture Resource (Optional)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300 block mb-1">
                      Instructor / Channel
                    </label>
                    <input
                      type="text"
                      value={newVideoInstructor}
                      onChange={(e) => setNewVideoInstructor(e.target.value)}
                      placeholder="e.g. M Prashant"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300 block mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="e.g. Shell Scripting Masterclass"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300 block mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://youtu.be/..."
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-slate-300 block mb-1">
                    Notes / Description
                  </label>
                  <input
                    type="text"
                    value={newVideoNotes}
                    onChange={(e) => setNewVideoNotes(e.target.value)}
                    placeholder="e.g. Covers loops, functions, variables"
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWeekModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow-md shadow-pink-600/30"
                >
                  Save Week Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
