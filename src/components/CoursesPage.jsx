import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Play, ExternalLink, Copy, Check, ArrowLeft, Plus,
  Trash2, Folder, Sparkles, Video, CheckCircle2,
  Calendar, Terminal, Cpu, HardDrive, Layers, Globe, Clock, ChevronDown, ChevronUp,
  ArrowRight, BookOpen, FileText, RotateCcw, ClipboardList
} from 'lucide-react';

export const SYSTEM_COMMANDS_DRIVE_URL = 'https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv';
const STORAGE_KEY_COURSES = 'iitm_courses_syllabus_v5';
const STORAGE_KEY_CHECKLIST = 'iitm_syllabus_checklist_v2';

const DBMS_WEEK_ONE_QUIZ = [
  {
    prompt: 'Which statement about data management is true?',
    type: 'single',
    options: [
      'The two major approaches in data management practice have been physical and mechanical.',
      'Book-keeping, from a data management perspective, is the process of physical data or records management using physical ledgers and journals.',
      'NoSQL was introduced because RDBMSs were not efficient enough to handle structured data.',
      'Electronic data is easily destroyed by moisture and termites.'
    ],
    answer: [1],
    explanation: 'Traditional book-keeping used physical ledgers and journals to manage records.'
  },
  {
    prompt: 'Spreadsheet files can be better than paper-based book-keeping in which ways?',
    type: 'multiple',
    options: ['Durability', 'Scalability', 'Security', 'Consistency'],
    answer: [0, 1, 2, 3],
    explanation: 'The source quiz marks all four properties.'
  },
  {
    prompt: 'Which are disadvantages of file systems compared with a DBMS?',
    type: 'multiple',
    options: [
      'An upper limit on the number of rows',
      'Constraint violations may go unchecked',
      'The ability to give users access at different levels',
      'Data consistency is never compromised'
    ],
    answer: [0, 1],
    explanation: 'File systems can lack scalable row handling and built-in constraint enforcement.'
  },
  {
    prompt: 'Choose the correct order of data management practices, from earliest to latest.',
    type: 'single',
    options: ['A-B-C-D', 'D-C-B-A', 'A-C-D-B', 'B-D-C-A'],
    answer: [3],
    explanation: 'The sequence is punched cards, hard disks, parallel and distributed databases, then data warehousing.'
  },
  {
    prompt: 'Which options are client/server relational database systems (RDBMSs)?',
    type: 'multiple',
    options: ['Sybase', 'MongoDB', 'Couchbase', 'PostgreSQL'],
    answer: [0, 3],
    explanation: 'Sybase and PostgreSQL are relational database systems; MongoDB and Couchbase are NoSQL databases.'
  }
];

const DBMS_12_WEEK_SYLLABUS = [
  {
    id: 'dbms_w1', weekNumber: 1, title: 'Course Overview',
    description: 'DBMS की बुनियाद, architecture, data independence और data models.',
    topics: ['D1: Introduction to DBMS', 'D2: File System vs DBMS', 'D3: Schema & Instance', 'D4: DBMS Architecture', 'D5: Data Independence', 'D6: DBA, Users, Data Models'],
    practice: 'DBMS Architecture का डायग्राम बनाएं और 20 MCQs हल करें.',
    video: { instructor: 'Gate Smashers', title: 'DBMS Introduction', highlights: 'Introduction to DBMS', notes: 'DBMS Introduction — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=140s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w2', weekNumber: 2, title: 'Relational Model & Basic SQL',
    description: 'Relations, keys, integrity constraints और SQL के आधारभूत commands.',
    topics: ['D1: Relation, Tuple, Attribute', 'D2: Primary, Foreign, Candidate Keys', 'D3: Integrity Constraints', 'D4: CREATE, ALTER, DROP', 'D5: INSERT, UPDATE, DELETE', 'D6: SELECT, WHERE, ORDER BY'],
    practice: '15 Basic SQL Queries लिखें और चलाएं.',
    video: { instructor: 'Gate Smashers', title: 'Relational Model & SQL', highlights: 'Relational Model and SQL basics', notes: 'Relational Model & SQL — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=11640s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w3', weekNumber: 3, title: 'Intermediate & Advanced SQL',
    description: 'Joins, grouping, subqueries, views, triggers, CTE और window functions.',
    topics: ['D1: INNER JOIN', 'D2: OUTER, SELF, CROSS JOIN', 'D3: GROUP BY, HAVING', 'D4: Subqueries', 'D5: Views, Triggers, CTE', 'D6: Aggregate & Window Functions'],
    practice: '20–25 Advanced SQL Queries हल करें.',
    video: { instructor: 'Gate Smashers', title: 'SQL Lectures', highlights: 'Intermediate and advanced SQL', notes: 'SQL Lectures — हिंदी वीडियो प्लेलिस्ट', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', youtubeId: '' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w4', weekNumber: 4, title: 'Query Languages & Database Design',
    description: 'Relational algebra, relational calculus, ER model और relational mapping.',
    topics: ['D1: Relational Algebra', 'D2: Relational Operators', 'D3: Tuple Relational Calculus', 'D4: Domain Relational Calculus', 'D5: ER Model & Diagrams', 'D6: ER-to-Relational Mapping'],
    practice: '10 Algebra Questions हल करें और एक ER Diagram बनाएं.',
    video: { instructor: 'Gate Smashers', title: 'Relational Algebra', highlights: 'Relational Algebra', notes: 'Relational Algebra — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=10148s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w5', weekNumber: 5, title: 'Functional Dependency & Normal Forms',
    description: 'Functional dependencies, closure, Armstrong axioms, keys और 1NF/2NF.',
    topics: ['D1: Functional Dependency', 'D2: Types of FD', 'D3: Attribute Closure', "D4: Armstrong's Axioms", 'D5: Candidate Keys', 'D6: 1NF और 2NF'],
    practice: 'Attribute closure, candidate keys और normalization के सवाल हल करें.',
    video: { instructor: 'Gate Smashers', title: 'Functional Dependency', highlights: 'Functional Dependency', notes: 'Functional Dependency — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=3008s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w6', weekNumber: 6, title: 'Normal Forms Continued',
    description: '3NF, BCNF, lossless decomposition, dependency preservation, 4NF और 5NF.',
    topics: ['D1: 3NF', 'D2: BCNF', 'D3: Lossless Decomposition', 'D4: Dependency Preservation', 'D5: Multivalued Dependency, 4NF', 'D6: 5NF, Canonical Cover'],
    practice: '15 Normalization Questions हल करें.',
    video: { instructor: 'Gate Smashers', title: 'Advanced Normalization', highlights: 'Advanced Normalization', notes: 'Advanced Normalization — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=5908s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w7', weekNumber: 7, title: 'Application Development',
    description: 'Database applications, JDBC/ODBC, connections, CRUD और prepared statements.',
    topics: ['D1: Database Applications', 'D2: JDBC, ODBC, Embedded SQL', 'D3: Database Connection', 'D4: CRUD Operations', 'D5: Prepared Statements', 'D6: Mini Project'],
    practice: 'एक छोटा Student Database Application बनाएं.',
    video: { instructor: 'Hindi tutorial', title: 'JDBC in Hindi', highlights: 'JDBC and database applications', notes: 'JDBC in Hindi — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=lZbl7Q21t4s', youtubeId: 'lZbl7Q21t4s' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w8', weekNumber: 8, title: 'Storage Management',
    description: 'Storage hierarchy, disks, records, file organization, buffers और RAID.',
    topics: ['D1: Storage Hierarchy', 'D2: Disk, Blocks, Records', 'D3: File Organization', 'D4: Heap & Sequential Files', 'D5: Buffer Management', 'D6: RAID, Storage Structures'],
    practice: 'File Organization के नोट्स बनाएं और संबंधित सवाल हल करें.',
    video: { instructor: 'Gate Smashers', title: 'DBMS Storage Lectures', highlights: 'Storage management', notes: 'DBMS Storage Lectures — हिंदी वीडियो प्लेलिस्ट', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y', youtubeId: '' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w9', weekNumber: 9, title: 'Indexing & Hashing',
    description: 'Primary/secondary indexes, dense/sparse indexes, B-trees और hashing.',
    topics: ['D1: Primary & Secondary Index', 'D2: Dense & Sparse Index', 'D3: B-Tree', 'D4: B+ Tree', 'D5: Static Hashing', 'D6: Dynamic Hashing'],
    practice: 'B+ Tree और Hashing के numericals हल करें.',
    video: { instructor: 'Gate Smashers', title: 'Indexing', highlights: 'Indexing and hashing', notes: 'Indexing — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=8372s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w10', weekNumber: 10, title: 'Transactions',
    description: 'ACID, transaction states, serializability, locks, 2PL और deadlocks.',
    topics: ['D1: Transaction & ACID', 'D2: Transaction States', 'D3: Schedules & Serializability', 'D4: Conflict & View Serializability', 'D5: Locks, 2PL', 'D6: Deadlock, Timestamp Protocols'],
    practice: '10 Serializability Questions हल करें.',
    video: { instructor: 'Gate Smashers', title: 'Transactions', highlights: 'Transactions and concurrency control', notes: 'Transactions — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=15748s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w11', weekNumber: 11, title: 'Backup & Recovery',
    description: 'Failure types, backups, log-based recovery, undo/redo और shadow paging.',
    topics: ['D1: Failure Types', 'D2: Database Backup Types', 'D3: Log-Based Recovery', 'D4: UNDO, REDO, Checkpoints', 'D5: Shadow Paging', 'D6: Backup & Restore Practical'],
    practice: 'Recovery के सवाल हल करें और Backup का अभ्यास करें.',
    video: { instructor: 'Gate Smashers', title: 'Recovery Lectures', highlights: 'Backup and recovery', notes: 'Recovery Lectures — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=YRnjGeQbsHQ&t=18062s', youtubeId: 'YRnjGeQbsHQ' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  },
  {
    id: 'dbms_w12', weekNumber: 12, title: 'Query Optimization & Conclusion',
    description: 'Query processing, execution plans, heuristic/cost-based optimization और revision.',
    topics: ['D1: Query Processing', 'D2: Query Execution Plans', 'D3: Heuristic Optimization', 'D4: Cost-Based Optimization', 'D5: Join Optimization', 'D6: Full DBMS Revision'],
    practice: 'पूरे सिलेबस का Mock Test दें.',
    video: { instructor: 'Hindi tutorial', title: 'Query Optimization', highlights: 'Query optimization', notes: 'Query Optimization — हिंदी वीडियो', url: 'https://www.youtube.com/watch?v=TyHUU05XKMY', youtubeId: 'TyHUU05XKMY' },
    notesUrl: SYSTEM_COMMANDS_DRIVE_URL, keyCommands: []
  }
];

export const INITIAL_COURSES_DATA = [
  {
    id: 'sys_cmd',
    name: 'System Commands',
    subtitle: 'Linux & Shell Scripting',
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
          notes: 'M Prashant — Linux for Beginners in One Video: 100 Commands — Covers system info, memory, packages, processes, networking (approx 2h 48m).',
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
          notes: 'M Prashant — Linux File Permissions for Beginners — Comprehensive guide to chmod, numeric/symbolic permissions & ownership.',
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
          notes: 'M Prashant — Follow lessons for Hard & Soft Links, Environment Variables, Aliases, Processes & SSH remote access.',
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
          notes: 'M Prashant — Shell Scripting Tutorial in One Video — Covers shell, scripts, variables, conditions, loops and execution permissions.',
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
          notes: 'M Prashant — Shell Scripting Tutorial continuation, followed by the dedicated Cron Job practical lesson.',
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
          notes: 'M Prashant — Master Linux AWK: From Basics to Advanced Techniques + Linux SED Command for structured data parsing.',
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
          notes: 'Linux Networking: 50 Linux Networking Commands (ip, ping, netstat/ss, dig, nslookup) + M Prashant tar/gzip compression tutorial.',
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
    subtitle: 'Flask & Web Applications',
    icon: '💻',
    description: 'IIT Madras Modern Application Development 1 — Python, Flask Backend, Jinja2 Templates, SQLite, REST APIs & Deployments.',
    driveUrl: SYSTEM_COMMANDS_DRIVE_URL,
    badge: 'Development Lab',
    weeks: [
      {
        id: 'mad_w1',
        weekNumber: 1,
        title: 'Week 1: Virtual Environments, Python & Flask Setup',
        description: 'Virtual environments, pip package management, Flask app factory, and dynamic routing.',
        topics: ['Virtualenv & pip setup', 'Flask application structure', 'Dynamic URL routing & views', 'HTTP GET & POST request handling'],
        video: {
          instructor: 'Corey Schafer / CodeWithHarry',
          title: 'Flask Tutorial for Beginners — Getting Started & Routing',
          highlights: 'Virtualenv, Flask setup, routing, request handling',
          notes: 'Flask framework setup, virtualenv isolation, and first web application routes.',
          url: 'https://youtu.be/MwZwr5Tvyxo',
          youtubeId: 'MwZwr5Tvyxo'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'python3 -m venv venv', label: 'Virtualenv', desc: 'Create virtual environment' },
          { cmd: 'pip install flask', label: 'Flask Install', desc: 'Install Flask web framework' },
          { cmd: 'python app.py', label: 'Run Server', desc: 'Start Flask development server' }
        ]
      },
      {
        id: 'mad_w2',
        weekNumber: 2,
        title: 'Week 2: Jinja2 Templates & Frontend Layouts',
        description: 'Template inheritance, blocks, variables, loops, filters, and static CSS/JS assets.',
        topics: ['Jinja2 syntax ({{ var }}, {% block %})', 'Layout base.html inheritance', 'Dynamic lists with loops', 'Custom filters & static file serving'],
        video: {
          instructor: 'Corey Schafer',
          title: 'Flask Tutorial: Templates with Jinja2 & Bootstrap Layouts',
          highlights: 'Jinja2, template inheritance, loops, conditionals, static files',
          notes: 'Mastering dynamic HTML templates and base layout inheritance with Jinja2.',
          url: 'https://youtu.be/QnDWIZuWYW8',
          youtubeId: 'QnDWIZuWYW8'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: '{% extends "base.html" %}', label: 'Jinja Extends', desc: 'Inherit template from base' },
          { cmd: 'url_for("static", filename="style.css")', label: 'Static URL', desc: 'Generate URL for static asset' }
        ]
      },
      {
        id: 'mad_w3',
        weekNumber: 3,
        title: 'Week 3: SQLite, SQLAlchemy ORM & Database Models',
        description: 'Relational database integration, SQLite setup, SQLAlchemy models, and CRUD operations.',
        topics: ['SQLite embedded database', 'Flask-SQLAlchemy configuration', 'Defining Database Models & Primary Keys', 'CRUD operations (Create, Read, Update, Delete)'],
        video: {
          instructor: 'Corey Schafer',
          title: 'Flask Tutorial: Databases with Flask-SQLAlchemy',
          highlights: 'SQLite, SQLAlchemy, models, relationships, queries',
          notes: 'Database schema design and interacting with SQLite using Python SQLAlchemy models.',
          url: 'https://youtu.be/cYWiDiIUxQc',
          youtubeId: 'cYWiDiIUxQc'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'db.create_all()', label: 'Create Tables', desc: 'Initialize database schema' },
          { cmd: 'User.query.filter_by(id=1).first()', label: 'Query ORM', desc: 'Fetch record from database' }
        ]
      },
      {
        id: 'mad_w4',
        weekNumber: 4,
        title: 'Week 4: User Authentication, Passwords & Sessions',
        description: 'Secure registration, bcrypt password hashing, Flask session management, and login protection.',
        topics: ['Bcrypt password hashing', 'User session management', 'Login and Logout workflows', 'Route protection decorators (@login_required)'],
        video: {
          instructor: 'Corey Schafer',
          title: 'Flask Tutorial: User Authentication, Registration & Login',
          highlights: 'Authentication, bcrypt, sessions, cookies, login forms',
          notes: 'Secure user login system with hashed passwords and session authentication.',
          url: 'https://youtu.be/CSHx6KKpeTY',
          youtubeId: 'CSHx6KKpeTY'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'bcrypt.generate_password_hash(pwd)', label: 'Hash Password', desc: 'Securely hash user password' },
          { cmd: 'session["user_id"] = user.id', label: 'Save Session', desc: 'Store authenticated user ID in session' }
        ]
      },
      {
        id: 'mad_w5',
        weekNumber: 5,
        title: 'Week 5: RESTful APIs, JSON Endpoints & Postman',
        description: 'Building REST APIs with Flask-RESTful, HTTP status codes, JSON request/response, and Postman testing.',
        topics: ['REST architectural principles', 'GET, POST, PUT, DELETE endpoints', 'jsonify and request.get_json()', 'API testing with Postman & curl'],
        video: {
          instructor: 'FreeCodeCamp',
          title: 'Flask REST API Tutorial — Build & Test RESTful Endpoints',
          highlights: 'REST API, JSON, Postman, status codes, endpoints',
          notes: 'Designing scalable RESTful APIs with clean JSON request and response payloads.',
          url: 'https://youtu.be/GMppyAPbLYk',
          youtubeId: 'GMppyAPbLYk'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'jsonify({"status": "success"})', label: 'JSON Response', desc: 'Return JSON serialized HTTP response' },
          { cmd: 'curl -X POST http://localhost:5000/api', label: 'cURL API', desc: 'Test API endpoint from terminal' }
        ]
      },
      {
        id: 'mad_w6',
        weekNumber: 6,
        title: 'Week 6: Frontend Integration & Fetch API',
        description: 'Connecting frontend to backend, asynchronous JavaScript fetch(), dynamic DOM manipulation, and CORS.',
        topics: ['JavaScript Fetch API & async/await', 'Sending JSON POST requests', 'Dynamic UI updates without page reload', 'CORS configuration with Flask-CORS'],
        video: {
          instructor: 'Traversy Media',
          title: 'Fetch API Introduction & Async JavaScript Integration',
          highlights: 'Fetch API, async/await, DOM updates, AJAX requests',
          notes: 'Building reactive interfaces by fetching backend JSON APIs asynchronously.',
          url: 'https://youtu.be/Oive66jrwBs',
          youtubeId: 'Oive66jrwBs'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'fetch("/api/tasks").then(r => r.json())', label: 'Fetch API', desc: 'Query backend API asynchronously' }
        ]
      },
      {
        id: 'mad_w7',
        weekNumber: 7,
        title: 'Week 7: Celery Background Tasks & Redis Broker',
        description: 'Asynchronous task workers, Celery setup, Redis in-memory message broker, and background jobs.',
        topics: ['Synchronous vs Asynchronous execution', 'Redis setup & configuration', 'Celery task definitions (@celery.task)', 'Long-running jobs & periodic scheduling'],
        video: {
          instructor: 'Tech With Tim',
          title: 'Celery & Redis Crash Course — Background Tasks with Python',
          highlights: 'Celery, Redis, background jobs, worker queues, async',
          notes: 'Offloading long background tasks and reports using Celery and Redis broker.',
          url: 'https://youtu.be/THxCy-6EnUM',
          youtubeId: 'THxCy-6EnUM'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'celery -A app.celery worker --loglevel=info', label: 'Run Worker', desc: 'Start Celery background worker' },
          { cmd: 'redis-server', label: 'Start Redis', desc: 'Launch Redis message broker' }
        ]
      },
      {
        id: 'mad_w8',
        weekNumber: 8,
        title: 'Week 8: Production Deployment & Best Practices',
        description: 'Production architecture, WSGI servers (Gunicorn), Nginx reverse proxy, and environment management.',
        topics: ['Development vs Production servers', 'WSGI with Gunicorn', 'Nginx reverse proxy configuration', 'Environment variables & security hardening'],
        video: {
          instructor: 'Corey Schafer',
          title: 'Deploy Flask Web App on Ubuntu with Gunicorn & Nginx',
          highlights: 'Gunicorn, Nginx, Ubuntu, production deployment, WSGI',
          notes: 'Complete production guide for hosting Flask apps using Gunicorn and Nginx.',
          url: 'https://youtu.be/goTo_Xb11tY',
          youtubeId: 'goTo_Xb11tY'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'gunicorn -w 4 -b 0.0.0.0:8000 app:app', label: 'Gunicorn WSGI', desc: 'Run multi-worker production WSGI server' }
        ]
      }
    ]
  },
  {
    id: 'dbms',
    name: 'DBMS',
    subtitle: 'SQL & Database Design',
    icon: '🗄️',
    description: 'IIT Madras Database Management Systems — Relational Algebra, SQL Queries, Schema Normalization (1NF to BCNF) & Transactions.',
    driveUrl: '',
    badge: 'Theory & SQL Lab',
    weeks: DBMS_12_WEEK_SYLLABUS
  }
];

export default function CoursesPage({ 
  onBack, 
  onAddTask, 
  showToast,
  initialStep = 'subject',
  initialCourseId = 'sys_cmd'
}) {
  // Load courses
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          const dbmsCourse = INITIAL_COURSES_DATA.find(course => course.id === 'dbms');
          const savedDbms = parsed.some(course => course.id === 'dbms');
          return savedDbms
            ? parsed.map(course => course.id === 'dbms' ? { ...course, ...dbmsCourse } : course)
            : [...parsed, dbmsCourse];
        }
      }
    } catch (e) {}
    return INITIAL_COURSES_DATA;
  });

  // Stage matching User's Blueprint:
  // 'subject' -> 'week' -> 'video' | 'notes'
  const [stage, setStage] = useState(initialStep === 'weeks' ? 'week' : 'subject');
  const [activeCourseId, setActiveCourseId] = useState(initialCourseId || 'sys_cmd');
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [activeVideoSubIndex, setActiveVideoSubIndex] = useState(0); // 0 = primary, 1 = extraVideo
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [quizSelections, setQuizSelections] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  
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
  const activeWeek = activeCourse?.weeks?.find(w => w.weekNumber === selectedWeekNum) || activeCourse?.weeks?.[0];
  const currentVideoObj = (activeWeek?.video?.extraVideos && activeVideoSubIndex > 0)
    ? activeWeek.video.extraVideos[activeVideoSubIndex - 1]
    : activeWeek?.video;
  const activeQuiz = activeCourseId === 'dbms' && selectedWeekNum === 1 ? DBMS_WEEK_ONE_QUIZ : null;
  const quizScore = Object.values(quizResults).filter(Boolean).length;
  const startWeekOneQuiz = () => {
    setActiveQuizQuestion(0);
    setQuizSelections({});
    setQuizResults({});
    setStage('quiz');
  };

  const toggleQuizOption = (optionIndex) => {
    setQuizSelections(prev => {
      const current = prev[activeQuizQuestion] || [];
      const next = current.includes(optionIndex)
        ? current.filter(index => index !== optionIndex)
        : [...current, optionIndex].sort((a, b) => a - b);
      return { ...prev, [activeQuizQuestion]: next };
    });
  };

  const submitQuizAnswer = () => {
    if (!activeQuiz) return;
    const selected = quizSelections[activeQuizQuestion] || [];
    const expected = activeQuiz[activeQuizQuestion].answer;
    const correct = selected.length === expected.length && expected.every(index => selected.includes(index));
    setQuizResults(prev => ({ ...prev, [activeQuizQuestion]: correct }));
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLink(text);
      if (showToast) showToast(`${label || 'Link'} copied to clipboard!`);
      setTimeout(() => setCopiedLink(''), 2000);
    });
  };

  const toggleTopicCheck = (topicKey) => {
    const next = { ...completedTopics, [topicKey]: !completedTopics[topicKey] };
    try {
      // Persist the click immediately so a quick refresh or navigation cannot lose it.
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(next));
    } catch (e) {}
    setCompletedTopics(next);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleAddWeekToToday = async (week) => {
    if (!onAddTask) return;

    const taskData = {
      subject: activeCourse.name,
      topic: `${week.title} (${week.topics.slice(0, 3).join(', ')})`,
      durationMinutes: 90,
      priority: 'High',
      notes: [
        week.video && `${week.video.instructor}: ${week.video.title} - ${week.video.url}\n${week.video.notes}`,
        week.practice && `दिन 7: ${week.practice}`
      ].filter(Boolean).join('\n') || `Syllabus Topics: ${week.topics.join(', ')}`
    };

    const result = await onAddTask(taskData);
    if (result?.success && showToast) {
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
      
      {/* ========================================================================= */}
      {/* STAGE 1: SELECT SUBJECT                                                  */}
      {/* ========================================================================= */}
      {stage === 'subject' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-pink-600 hover:border-pink-300 shadow-sm active:scale-95 transition-all"
                title="Back to Tasks"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  <span>Select a Subject</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Choose a subject to view its curriculum and start video lectures.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddWeekModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-pink-600/30 border border-pink-600 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Week</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const totalWeeks = course.weeks?.length || 0;
              let totalTopics = 0;
              let completedCount = 0;
              course.weeks?.forEach(w => {
                totalTopics += w.topics?.length || 0;
                w.topics?.forEach((_, idx) => {
                  if (completedTopics[`${w.id}_${idx}`]) completedCount++;
                });
              });
              const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
              const isCurrent = course.id === activeCourseId;

              return (
                <div
                  key={course.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                    isCurrent 
                      ? 'border-pink-500 shadow-pink-500/10' 
                      : 'border-gray-200 dark:border-slate-800 hover:border-pink-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center text-3xl shadow-md shadow-pink-600/30 group-hover:scale-110 transition-transform">
                        {course.icon}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                        {course.badge || `${totalWeeks} Weeks`}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                      {course.name}
                    </h3>
                    {course.subtitle && (
                      <p className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-1 mb-3">
                        {course.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="bg-gray-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-gray-100 dark:border-slate-800 mb-5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1.5">
                        <span>{totalWeeks} Weeks Total</span>
                        <span>{pct}% Completed</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-pink-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Next Action Button */}
                  <button
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setSelectedWeekNum(1);
                      setActiveVideoSubIndex(0);
                      setStage('week');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-sm shadow-lg shadow-pink-600/30 border border-pink-700 transition-all cursor-pointer"
                  >
                    <span>Select {course.name}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: SELECT WEEK (Step 2)               */}
      {/* ========================================================================= */}
      {stage === 'week' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Compact Top Navigation Bar */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setStage('subject')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:text-pink-600 border border-gray-200 dark:border-slate-700 font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Subjects</span>
              </button>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>{activeCourse.icon}</span>
                <span>{activeCourse.name}</span>
              </h2>
            </div>

            {activeCourse.driveUrl && (
              <a
                href={activeCourse.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 border border-pink-200 dark:border-pink-800 font-bold text-xs shadow-sm cursor-pointer"
              >
                <Folder className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Drive Notes</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Week Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(activeCourse.weeks || []).map(w => {
              const totalWeekTopics = w.topics?.length || 0;
              let checkedCount = 0;
              w.topics?.forEach((_, idx) => {
                if (completedTopics[`${w.id}_${idx}`]) checkedCount++;
              });
              const isWeekComplete = totalWeekTopics > 0 && checkedCount === totalWeekTopics;

              return (
                <div
                  key={w.id}
                  className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-600 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-xs font-black uppercase px-2.5 py-1 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                        Week {w.weekNumber}
                      </span>
                      {isWeekComplete ? (
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">
                          {checkedCount}/{totalWeekTopics} Topics
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 mb-2">
                      {w.title}
                    </h4>

                    {w.video && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 mb-3 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-xl border border-red-100 dark:border-red-900/40">
                        <Play className="w-3 h-3 fill-current shrink-0" />
                        <span className="truncate">{w.video.instructor}</span>
                      </div>
                    )}

                    <div className="space-y-1 mb-4 text-[11px] text-gray-600 dark:text-slate-400">
                      {w.topics?.slice(0, 3).map((topic, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-pink-500 font-bold">•</span>
                          <span>{topic}</span>
                        </div>
                      ))}
                      {w.topics && w.topics.length > 3 && (
                        <div className="text-[10px] font-bold text-pink-600 dark:text-pink-400 pl-3">
                          +{w.topics.length - 3} more topics
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons: lesson, notes, and the Week 1 DBMS quiz */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedWeekNum(w.weekNumber);
                        setActiveVideoSubIndex(0);
                        setStage('video');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 active:scale-95 text-white font-black text-sm shadow-md shadow-pink-600/30 border border-pink-700 transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWeekNum(w.weekNumber);
                        setStage('notes');
                      }}
                      className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer active:scale-95"
                      title="Read Notes & Syllabus"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                  {activeCourse.id === 'dbms' && w.weekNumber === 1 && (
                    <button
                      onClick={() => {
                        setSelectedWeekNum(w.weekNumber);
                        startWeekOneQuiz();
                      }}
                      className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-black text-xs border border-amber-200 dark:border-amber-800 transition-all cursor-pointer active:scale-95"
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>Week 1 Quiz · 5 Questions</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: VIDEO PAGE VIEW (Launches on Start)   */}
      {/* ========================================================================= */}
      {stage === 'video' && activeWeek && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStage('week')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-pink-600 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Weeks</span>
              </button>
              <button
                onClick={() => setStage('subject')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 font-bold text-xs border border-pink-200 dark:border-pink-800 transition-all cursor-pointer active:scale-95"
              >
                <span>Change Subject</span>
              </button>
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
                {activeCourse.name} • Week {activeWeek.weekNumber}
              </span>
            </div>

            {/* Quick Switch to Notes */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStage('notes')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>📝 View Notes & Materials</span>
              </button>
              <button
                onClick={() => handleAddWeekToToday(activeWeek)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-pink-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Tasks</span>
              </button>
            </div>
          </div>

          {/* Dedicated Video Player Card */}
          <div className="bg-white dark:bg-slate-900 border-2 border-red-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Video Lecture Page</span>
                  </span>
                  <span className="text-xs font-bold text-gray-500">
                    Week {activeWeek.weekNumber}: {activeWeek.title}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  {currentVideoObj?.title || activeWeek.title}
                </h3>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-bold mt-1">
                  Instructor / Channel: {currentVideoObj?.instructor || 'IITM Recommended'}
                </p>
              </div>

              {/* Extra Videos Switcher (if week has multiple videos like Week 7) */}
              {activeWeek.video?.extraVideos && activeWeek.video.extraVideos.length > 0 && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => setActiveVideoSubIndex(0)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeVideoSubIndex === 0
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-slate-300 hover:text-red-600'
                    }`}
                  >
                    Part 1: Primary
                  </button>
                  <button
                    onClick={() => setActiveVideoSubIndex(1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeVideoSubIndex === 1
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-slate-300 hover:text-red-600'
                    }`}
                  >
                    Part 2: {activeWeek.video.extraVideos[0].title.split('—')[0]}
                  </button>
                </div>
              )}
            </div>

            {/* Embedded Responsive Video Player */}
            {currentVideoObj?.youtubeId ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200 dark:border-slate-800 mb-6">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentVideoObj.youtubeId}?autoplay=1&rel=0`}
                  title={currentVideoObj.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700 mb-6">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-700 dark:text-slate-300">
                  Video lecture player link available below:
                </p>
              </div>
            )}

            {/* Video Info and Direct Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-slate-800/70 rounded-2xl border border-gray-100 dark:border-slate-800">
              <div className="text-xs text-gray-600 dark:text-slate-400">
                {currentVideoObj?.notes && (
                  <p className="leading-relaxed">
                    <span className="font-bold text-gray-800 dark:text-slate-200">Video Highlights: </span>
                    {currentVideoObj.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {currentVideoObj?.url && (
                  <>
                    <a
                      href={currentVideoObj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/30 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleCopy(currentVideoObj.url, 'Video link')}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:text-pink-600 font-bold text-xs transition-all cursor-pointer"
                      title="Copy URL"
                    >
                      {copiedLink === currentVideoObj.url ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: WEEK 1 DBMS QUIZ                                                */}
      {/* ========================================================================= */}
      {stage === 'quiz' && activeQuiz && (
        <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStage('week')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:text-amber-700 border border-gray-200 dark:border-slate-700 font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Week 1</span>
            </button>
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400">DBMS · Week 1</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border-2 border-amber-200 dark:border-amber-900/70 rounded-3xl p-5 sm:p-8 shadow-lg">
            {activeQuizQuestion < activeQuiz.length ? (() => {
              const question = activeQuiz[activeQuizQuestion];
              const selected = quizSelections[activeQuizQuestion] || [];
              const hasSubmitted = Object.prototype.hasOwnProperty.call(quizResults, activeQuizQuestion);
              const isCorrect = quizResults[activeQuizQuestion];
              return (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <ClipboardList className="w-3.5 h-3.5" /> Week 1 Quiz
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-3">DBMS Foundations</h3>
                    </div>
                    <span className="shrink-0 text-xs font-black text-gray-500 dark:text-slate-400">
                      {activeQuizQuestion + 1} / {activeQuiz.length}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((activeQuizQuestion + 1) / activeQuiz.length) * 100}%` }} />
                  </div>

                  <p className="text-base sm:text-lg font-bold leading-relaxed text-gray-900 dark:text-white mb-2">{question.prompt}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                    {question.type === 'multiple' ? 'Select all that apply.' : 'Select one answer.'}
                  </p>

                  <div className="space-y-2.5">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selected.includes(optionIndex);
                      const isExpected = question.answer.includes(optionIndex);
                      const optionStyle = hasSubmitted
                        ? isExpected
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800'
                          : isSelected
                            ? 'border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-900'
                            : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'
                        : isSelected
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800'
                          : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:border-amber-300';
                      return (
                        <button
                          key={optionIndex}
                          type="button"
                          disabled={hasSubmitted}
                          aria-pressed={isSelected}
                          onClick={() => {
                            if (question.type === 'single') {
                              setQuizSelections(prev => ({ ...prev, [activeQuizQuestion]: [optionIndex] }));
                            } else {
                              toggleQuizOption(optionIndex);
                            }
                          }}
                          className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all ${optionStyle} ${hasSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <span className={`mt-0.5 w-5 h-5 shrink-0 ${question.type === 'multiple' ? 'rounded-md' : 'rounded-full'} border-2 flex items-center justify-center ${isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-300 dark:border-slate-600'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span className="text-sm leading-relaxed text-gray-800 dark:text-slate-200">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {hasSubmitted && (
                    <div className={`mt-5 p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'}`}>
                      <p className="font-black text-sm">{isCorrect ? 'Correct!' : 'Not quite'}</p>
                      <p className="text-xs leading-relaxed mt-1">{question.explanation}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-6">
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Score: {quizScore} / {activeQuiz.length}</span>
                    {!hasSubmitted ? (
                      <button
                        type="button"
                        disabled={selected.length === 0}
                        onClick={submitQuizAnswer}
                        className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-slate-700 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveQuizQuestion(activeQuizQuestion + 1)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                      >
                        <span>{activeQuizQuestion === activeQuiz.length - 1 ? 'See Results' : 'Next Question'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="text-center py-5">
                <span className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </span>
                <p className="text-xs font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 mt-4">Quiz Complete</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">You scored {quizScore} / {activeQuiz.length}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Review the Week 1 DBMS foundations and try again whenever you like.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <button onClick={startWeekOneQuiz} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md transition-all cursor-pointer">
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                  <button onClick={() => setStage('week')} className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 font-black text-sm transition-all cursor-pointer">
                    Back to Week 1
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: NOTES PAGE VIEW          */}
      {/* ========================================================================= */}
      {stage === 'notes' && activeWeek && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStage('week')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-indigo-600 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Weeks</span>
              </button>
              <button
                onClick={() => setStage('subject')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer active:scale-95"
              >
                <span>Change Subject</span>
              </button>
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
                {activeCourse.name} • Week {activeWeek.weekNumber}
              </span>
            </div>

            {/* Quick Switch to Video */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStage('video')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>🎥 Watch Video Lecture</span>
              </button>
              <button
                onClick={() => handleAddWeekToToday(activeWeek)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Tasks</span>
              </button>
            </div>
          </div>

          {/* Notes & Syllabus Materials Container */}
          <div className="bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 inline-block mb-1.5">
                  📝 Notes & Materials Page
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                  Week {activeWeek.weekNumber}: {activeWeek.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                  {activeWeek.description}
                </p>
              </div>

              {/* Official Google Drive Button */}
              {activeCourse.driveUrl && (
                <a
                  href={activeCourse.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
                >
                  <Folder className="w-4 h-4" />
                  <span>Open Official Google Drive Notes</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Checklist of Syllabus Topics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Syllabus Topics Checklist</span>
                </h4>
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400">
                  {activeWeek.topics?.filter((_, idx) => completedTopics[`${activeWeek.id}_${idx}`]).length || 0} / {activeWeek.topics?.length || 0} Done
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeWeek.topics?.map((topic, idx) => {
                  const topicKey = `${activeWeek.id}_${idx}`;
                  const isChecked = !!completedTopics[topicKey];

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTopicCheck(topicKey)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                          : 'bg-gray-50/70 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 hover:border-pink-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-slate-600 cursor-pointer"
                      />
                      <span className={`text-xs leading-relaxed ${isChecked ? 'line-through opacity-80' : 'font-medium'}`}>
                        {topic}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeWeek.practice && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 sm:p-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                  <ClipboardList className="w-4 h-4" />
                  <span>दिन 7: प्रैक्टिस</span>
                </h4>
                <p className="text-sm font-medium text-amber-950 dark:text-amber-100">{activeWeek.practice}</p>
              </div>
            )}

            {/* Cheatsheet / Key Commands if available */}
            {activeWeek.keyCommands && activeWeek.keyCommands.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                  <Terminal className="w-4 h-4 text-pink-600" />
                  <span>Essential Commands & Syntax Reference</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {activeWeek.keyCommands.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <code className="text-xs font-mono font-bold text-pink-600 dark:text-pink-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-pink-100 dark:border-slate-800">
                          {item.cmd}
                        </code>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 bg-gray-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* COLLAPSIBLE FULL SYLLABUS OVERVIEW                                       */}
      {/* ========================================================================= */}
      {showFullOverview && (
        <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>📚</span>
              <span>All {activeCourse.weeks?.length || 0} Weeks Overview: {activeCourse.name}</span>
            </h3>
            <button
              onClick={() => setShowFullOverview(false)}
              className="text-xs font-bold text-gray-500 hover:text-pink-600 cursor-pointer"
            >
              Hide Overview ✕
            </button>
          </div>

          <div className="space-y-4">
            {(activeCourse.weeks || []).map(w => (
              <div
                key={w.id}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300">
                      Week {w.weekNumber}
                    </span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {w.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {w.topics?.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedWeekNum(w.weekNumber);
                      setActiveVideoSubIndex(0);
                      setStage('video');
                      setShowFullOverview(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200 dark:border-red-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Video</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWeekNum(w.weekNumber);
                      setStage('notes');
                      setShowFullOverview(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
