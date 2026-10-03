import React, { useState, useEffect } from 'react';
import {
  GraduationCap, Play, ExternalLink, Copy, Check, ArrowLeft, Plus,
  Trash2, Folder, Sparkles, Search, Video, CheckCircle2,
  Calendar, Terminal, Cpu, HardDrive, Layers, Globe, Clock, ChevronDown, ChevronUp,
  ArrowRight, BookOpen, FileText, RotateCcw
} from 'lucide-react';

export const SYSTEM_COMMANDS_DRIVE_URL = 'https://drive.google.com/drive/folders/1NZBmJYwtCreV-HCminQGxUZTYxa6zRKv';
const STORAGE_KEY_COURSES = 'iitm_courses_syllabus_v5';
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
    hindiName: 'मॉडर्न ऐप डेवलपमेंट 1 (Flask & Web Apps)',
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
    hindiName: 'डेटाबेस मैनेजमेंट सिस्टम (SQL & Database Design)',
    icon: '🗄️',
    description: 'IIT Madras Database Management Systems — Relational Algebra, SQL Queries, Schema Normalization (1NF to BCNF) & Transactions.',
    driveUrl: SYSTEM_COMMANDS_DRIVE_URL,
    badge: 'Theory & SQL Lab',
    weeks: [
      {
        id: 'dbms_w1',
        weekNumber: 1,
        title: 'Week 1: Relational Model, ER Diagrams & Schema Mapping',
        description: 'Relational data models, ER diagrams to table mapping, entity types, attributes, and cardinality.',
        topics: ['Entity-Relationship (ER) model', 'Entity types, weak entities & attributes', 'Primary key, candidate key & foreign key', 'Mapping ER diagram to relational schema'],
        video: {
          instructor: 'Gate Smashers (Varun Singla)',
          title: 'Introduction to DBMS & ER Model in Hindi — Complete Lecture',
          highlights: 'DBMS intro, 3-tier architecture, ER diagram, keys, mapping',
          notes: 'Gate Smashers DBMS Hindi Playlist — ER Modeling, Entities, Cardinality and Keys concept.',
          url: 'https://youtu.be/kBdlM6hNDAE',
          youtubeId: 'kBdlM6hNDAE'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'CREATE TABLE students (id INT PRIMARY KEY);', label: 'Primary Key', desc: 'Define unique entity identifier' }
        ]
      },
      {
        id: 'dbms_w2',
        weekNumber: 2,
        title: 'Week 2: SQL DDL, DML & Schema Constraints',
        description: 'SQL fundamentals, CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, and column constraints.',
        topics: ['Data Definition Language (DDL)', 'Data Manipulation Language (DML)', 'NOT NULL, UNIQUE, CHECK, DEFAULT', 'Referential Integrity & FOREIGN KEY ON DELETE CASCADE'],
        video: {
          instructor: 'Kudvenkat / Gate Smashers',
          title: 'SQL DDL vs DML Commands & Constraints in Hindi',
          highlights: 'DDL, DML, constraints, primary key, foreign key, cascade',
          notes: 'SQL syntax for creating tables and enforcing integrity constraints.',
          url: 'https://youtu.be/7Vtl2Wc7d-8',
          youtubeId: '7Vtl2Wc7d-8'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'ALTER TABLE users ADD COLUMN email VARCHAR(100);', label: 'ALTER Table', desc: 'Add column to existing table' }
        ]
      },
      {
        id: 'dbms_w3',
        weekNumber: 3,
        title: 'Week 3: Complex SQL Queries, Aggregation & Grouping',
        description: 'Querying tables, aggregate functions (COUNT, SUM, AVG), GROUP BY, HAVING, and filtering with WHERE.',
        topics: ['SELECT with WHERE clause', 'Aggregate functions: COUNT, SUM, AVG, MIN, MAX', 'GROUP BY clause & grouping semantics', 'HAVING clause vs WHERE clause'],
        video: {
          instructor: 'Gate Smashers',
          title: 'SQL GROUP BY and HAVING Clause with Examples in Hindi',
          highlights: 'GROUP BY, HAVING, aggregate functions, filtering',
          notes: 'Understanding data aggregation and group-level filtering with HAVING.',
          url: 'https://youtu.be/9k5d5e5bA2E',
          youtubeId: '9k5d5e5bA2E'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 50000;', label: 'GROUP BY', desc: 'Aggregate by department' }
        ]
      },
      {
        id: 'dbms_w4',
        weekNumber: 4,
        title: 'Week 4: SQL Joins & Nested Subqueries',
        description: 'Inner joins, Left outer joins, Right joins, Full joins, Cross joins, and correlated subqueries.',
        topics: ['INNER JOIN vs OUTER JOIN', 'LEFT JOIN, RIGHT JOIN & FULL JOIN', 'Natural Joins and Self Joins', 'Nested Subqueries (IN, NOT IN, EXISTS, ANY, ALL)'],
        video: {
          instructor: 'Gate Smashers',
          title: 'SQL Joins Explained in Hindi — Inner, Left, Right & Full Join',
          highlights: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, subqueries',
          notes: 'Mastering table joins and multi-table data extraction techniques.',
          url: 'https://youtu.be/2HVMiPPuPIM',
          youtubeId: '2HVMiPPuPIM'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'SELECT * FROM A INNER JOIN B ON A.id = B.a_id;', label: 'Inner Join', desc: 'Combine matching records from both tables' }
        ]
      },
      {
        id: 'dbms_w5',
        weekNumber: 5,
        title: 'Week 5: Relational Algebra & Tuple Relational Calculus',
        description: 'Formal relational query languages, Selection (σ), Projection (π), Cartesian product (×), Join (⨝), Union, Set Difference.',
        topics: ['Fundamental operators: Selection (σ) & Projection (π)', 'Set operations: Union (∪), Intersection (∩), Difference (−)', 'Cartesian product (×) & Theta Join (⨝)', 'Tuple Relational Calculus (TRC) queries'],
        video: {
          instructor: 'Gate Smashers',
          title: 'Relational Algebra in DBMS in Hindi — Complete Concept',
          highlights: 'Relational algebra, sigma, pi, join, cross product, TRC',
          notes: 'Theoretical foundations of relational queries and algebraic transformations.',
          url: 'https://youtu.be/4YilEjkNPrQ',
          youtubeId: '4YilEjkNPrQ'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'π_name (σ_age>20 (Students))', label: 'Relational Algebra', desc: 'Filter age > 20 and project name' }
        ]
      },
      {
        id: 'dbms_w6',
        weekNumber: 6,
        title: 'Week 6: Functional Dependencies & Normalization (1NF to BCNF)',
        description: 'Database anomalies, closure of functional dependencies, minimal cover, 1NF, 2NF, 3NF, and Boyce-Codd Normal Form (BCNF).',
        topics: ['Functional Dependencies (FD) & Armstrong Axioms', 'Attribute Closure & Finding Candidate Keys', 'Update, Insertion & Deletion Anomalies', '1NF, 2NF, 3NF and BCNF decomposition rules'],
        video: {
          instructor: 'Gate Smashers',
          title: 'Normalization in DBMS in Hindi — 1NF, 2NF, 3NF, BCNF Easy Explanation',
          highlights: 'Normalization, 1NF, 2NF, 3NF, BCNF, functional dependencies',
          notes: 'Eliminating redundancy and anomalies through step-by-step schema normalization.',
          url: 'https://youtu.be/5dspsycsm-s',
          youtubeId: '5dspsycsm-s'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'FD: A -> B, B -> C  => A -> C (Transitivity)', label: 'Armstrong Axiom', desc: 'Transitive functional dependency' }
        ]
      },
      {
        id: 'dbms_w7',
        weekNumber: 7,
        title: 'Week 7: Transactions, ACID Properties & Concurrency Control',
        description: 'Transaction concepts, ACID properties, serializability, Conflict Serializability, Two-Phase Locking (2PL), and Deadlocks.',
        topics: ['Transaction states: Active, Partially Committed, Failed, Aborted', 'ACID Properties: Atomicity, Consistency, Isolation, Durability', 'Schedules & Conflict Serializability', 'Concurrency control: Lock-based protocols & 2PL'],
        video: {
          instructor: 'Gate Smashers',
          title: 'Transactions and Concurrency Control in DBMS in Hindi',
          highlights: 'ACID, serializability, 2PL, locking, deadlocks',
          notes: 'Ensuring data integrity under concurrent multi-user database operations.',
          url: 'https://youtu.be/d4_Jg_l8f4Y',
          youtubeId: 'd4_Jg_l8f4Y'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'START TRANSACTION; ... COMMIT; / ROLLBACK;', label: 'Transaction SQL', desc: 'Atomic transaction boundaries' }
        ]
      },
      {
        id: 'dbms_w8',
        weekNumber: 8,
        title: 'Week 8: Indexing, B-Trees, B+ Trees & Query Optimization',
        description: 'File organizations, primary/secondary/clustering indexes, B-Trees, B+ Trees search/insertion, and query execution plans.',
        topics: ['File organization: Heap vs Ordered files', 'Index structures: Dense vs Sparse, Primary vs Secondary', 'B-Trees and B+ Trees multi-level indexing', 'Query evaluation & EXPLAIN query execution plan'],
        video: {
          instructor: 'Gate Smashers',
          title: 'Indexing in DBMS & B+ Tree Explained in Hindi',
          highlights: 'Indexing, B-Tree, B+ Tree, search time complexity, EXPLAIN',
          notes: 'Accelerating query retrieval speed using balanced tree indexes.',
          url: 'https://youtu.be/aZjYr87r1b8',
          youtubeId: 'aZjYr87r1b8'
        },
        notesUrl: SYSTEM_COMMANDS_DRIVE_URL,
        keyCommands: [
          { cmd: 'CREATE INDEX idx_user_email ON users(email);', label: 'Create Index', desc: 'Accelerate queries on email column' },
          { cmd: 'EXPLAIN SELECT * FROM users WHERE email = "...";', label: 'Query Plan', desc: 'Inspect execution plan and index usage' }
        ]
      }
    ]
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
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_COURSES_DATA;
  });

  // Stage matching User's Blueprint:
  // 'subject' -> 'week' -> 'action_choice' -> 'video' | 'notes'
  const [stage, setStage] = useState(initialStep === 'weeks' ? 'week' : 'subject');
  const [activeCourseId, setActiveCourseId] = useState(initialCourseId || 'sys_cmd');
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [activeVideoSubIndex, setActiveVideoSubIndex] = useState(0); // 0 = primary, 1 = extraVideo
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

      {/* ========================================================================= */}
      {/* BLUEPRINT INTERACTIVE STEPPER BAR                                        */}
      {/* Flow: Courses -> subjects -> Week -> Video | Notes                       */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center text-sm font-black">
              🗺️
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                Course Flow Blueprint (कोर्स नेविगेशन फ्लो)
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">
                Courses ➔ 1. Subject ➔ 2. Week ➔ 3. Video / Notes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setStage('subject');
                setSelectedWeekNum(1);
                setActiveVideoSubIndex(0);
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-950/50 text-gray-700 dark:text-slate-300 hover:text-pink-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Reset Flow to Beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Flow</span>
            </button>
            <button
              onClick={() => setShowFullOverview(prev => !prev)}
              className="px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-800 bg-pink-50/60 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showFullOverview ? 'Hide Full Syllabus' : 'All 8 Weeks Overview'}</span>
            </button>
          </div>
        </div>

        {/* Stepper Steps Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Step 0: Courses */}
          <div className="flex items-center justify-between p-3 rounded-2xl border bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                🎓
              </span>
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-400">Start</div>
                <div className="text-xs font-black text-gray-800 dark:text-white">Courses</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
          </div>

          {/* Step 1: Subjects */}
          <button
            onClick={() => setStage('subject')}
            className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              stage === 'subject'
                ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/30 font-black scale-[1.02]'
                : 'bg-white dark:bg-slate-800/90 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-700 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                stage === 'subject' ? 'bg-white text-pink-600' : 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300'
              }`}>
                1
              </span>
              <div className="truncate">
                <div className={`text-[10px] uppercase font-bold ${stage === 'subject' ? 'text-pink-100' : 'text-gray-400'}`}>Step 1</div>
                <div className="text-xs font-black truncate">
                  {stage !== 'subject' ? activeCourse.name : 'Select Subject'}
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 hidden sm:block ${stage === 'subject' ? 'text-white' : 'text-gray-400'}`} />
          </button>

          {/* Step 2: Week */}
          <button
            onClick={() => setStage('week')}
            className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              stage === 'week'
                ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/30 font-black scale-[1.02]'
                : stage === 'action_choice' || stage === 'video' || stage === 'notes'
                ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-800'
                : 'bg-white dark:bg-slate-800/90 text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                stage === 'week' 
                  ? 'bg-white text-pink-600' 
                  : (stage === 'action_choice' || stage === 'video' || stage === 'notes')
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
              }`}>
                2
              </span>
              <div className="truncate">
                <div className={`text-[10px] uppercase font-bold ${stage === 'week' ? 'text-pink-100' : 'text-gray-400'}`}>Step 2</div>
                <div className="text-xs font-black truncate">
                  {stage === 'subject' ? 'Select Week' : `Week ${selectedWeekNum}`}
                </div>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 shrink-0 hidden sm:block ${stage === 'week' ? 'text-white' : 'text-gray-400'}`} />
          </button>

          {/* Step 3: Video / Notes Choice */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              stage === 'video'
                ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                : stage === 'notes'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                : stage === 'action_choice'
                ? 'bg-pink-600 text-white border-pink-600 shadow-md shadow-pink-600/30'
                : 'bg-white dark:bg-slate-800/90 text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                stage === 'video' || stage === 'notes' || stage === 'action_choice' ? 'bg-white text-pink-600' : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
              }`}>
                3
              </span>
              <div className="truncate">
                <div className={`text-[10px] uppercase font-bold ${(stage === 'video' || stage === 'notes' || stage === 'action_choice') ? 'text-pink-100' : 'text-gray-400'}`}>
                  Step 3
                </div>
                <div className="text-xs font-black truncate">
                  {stage === 'video' ? '🎥 Video Page' : stage === 'notes' ? '📝 Notes Page' : 'Video or Notes'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE 1: SELECT SUBJECT (पहला कदम: कौन सा सब्जेक्ट लेना है)              */}
      {/* ========================================================================= */}
      {stage === 'subject' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/40 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800 inline-block mb-1.5">
                पहला कदम (Step 1)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                <span>कौन सा सब्जेक्ट लेना है? (Select Subject)</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mt-1">
                जिस विषय का अध्ययन करना चाहते हैं उस पर क्लिक करें। इसके बाद आपको हफ़्ता (Week 1–8) चुनने का विकल्प मिलेगा।
              </p>
            </div>
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-3.5 py-1.5 rounded-full border border-pink-200 dark:border-pink-800 self-start sm:self-auto">
              3 IITM Subjects Available
            </span>
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
                    {course.hindiName && (
                      <p className="text-xs font-bold text-pink-600 dark:text-pink-400 mt-1 mb-3">
                        {course.hindiName}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="bg-gray-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-gray-100 dark:border-slate-800 mb-5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-600 dark:text-slate-400 mb-1.5">
                        <span>{totalWeeks} हफ़्ते (Full 8 Weeks)</span>
                        <span>{pct}% पूर्ण</span>
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
                    <span>Select {course.name} (हफ़्ते देखें)</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 2: SELECT WEEK (दूसरा कदम: कौन सा वीक सेलेक्ट करना है)               */}
      {/* ========================================================================= */}
      {stage === 'week' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-pink-50 to-white dark:from-pink-950/30 dark:to-slate-900 border-2 border-pink-200 dark:border-pink-800 rounded-3xl p-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setStage('subject')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 border border-pink-200 dark:border-pink-800 font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back to Subjects (अन्य विषय)</span>
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/50 px-2.5 py-0.5 rounded-full">
                  दूसरा कदम (Step 2)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <span>{activeCourse.icon}</span>
                <span>{activeCourse.name} — कौन सा वीक सेलेक्ट करना है?</span>
              </h2>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                नीचे से Week 1 से Week 8 में से किसी भी वीक पर क्लिक करें। अगले कदम में आप वीडियो या नोट्स चुन सकेंगे।
              </p>
            </div>

            {activeCourse.driveUrl && (
              <a
                href={activeCourse.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 border border-pink-200 dark:border-pink-800 font-bold text-xs shadow-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
              >
                <Folder className="w-4 h-4" />
                <span>Open Google Drive Notes</span>
                <ExternalLink className="w-3.5 h-3.5" />
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

                  {/* Button to select this week and go to Step 3 */}
                  <button
                    onClick={() => {
                      setSelectedWeekNum(w.weekNumber);
                      setActiveVideoSubIndex(0);
                      setStage('action_choice');
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-black text-xs shadow-md shadow-pink-600/30 border border-pink-700 transition-all cursor-pointer"
                  >
                    <span>Select Week {w.weekNumber} (अगला कदम)</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 3: ACTION CHOICE (तीसरा कदम: वीडियो सेलेक्ट करना है या नोट्स?)        */}
      {/* ========================================================================= */}
      {stage === 'action_choice' && (
        <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border-2 border-pink-300 dark:border-pink-800 rounded-3xl p-6 text-center shadow-lg shadow-pink-600/5">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setStage('week')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-pink-600 font-bold text-xs transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Weeks (अन्य हफ़्ता चुनें)</span>
              </button>
              <span className="text-xs font-black uppercase tracking-wider text-pink-700 dark:text-pink-300 bg-pink-100 dark:bg-pink-900/50 px-3 py-1 rounded-full">
                तीसरा कदम (Step 3: Decision)
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 font-bold text-xs border border-pink-200 dark:border-pink-800 mb-2">
              <span>{activeCourse.icon} {activeCourse.name}</span>
              <span>•</span>
              <span>Week {activeWeek?.weekNumber}: {activeWeek?.title}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">
              अब आप क्या देखना चाहते हैं?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-lg mx-auto">
              ब्लूप्रिंट के अनुसार आप <strong>वीडियो लेक्चर</strong> देख सकते हैं या <strong>नोट्स एवं ड्राइव मटेरियल</strong> पढ़ सकते हैं। नीचे से चुनें:
            </p>
          </div>

          {/* Two Big Decision Choice Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CHOICE 1: VIDEO */}
            <div
              onClick={() => setStage('video')}
              className="bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-rose-950/30 dark:via-slate-900 dark:to-pink-950/20 border-2 border-red-300 hover:border-red-500 dark:border-red-900/60 dark:hover:border-red-500 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-red-600/30 mb-6 group-hover:scale-110 transition-transform">
                  ▶
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-800 inline-block mb-2">
                  Option 1: Video Lecture
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2">
                  🎥 Video (वीडियो देखें)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                  {activeWeek?.video ? (
                    <>
                      <strong>{activeWeek.video.instructor}</strong> का वीडियो लेक्चर: {activeWeek.video.title}। इनबिल्ट प्लेयर और टाइमस्टैम्प्स।
                    </>
                  ) : (
                    'इस हफ़्ते के लिए अनुशंसित वीडियो लेक्चर मास्टरक्लास खोलें।'
                  )}
                </p>
              </div>

              <div className="pt-4 border-t border-rose-200 dark:border-rose-900/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStage('video');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Video Page खोलें (Watch Video)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CHOICE 2: NOTES */}
            <div
              onClick={() => setStage('notes')}
              className="bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-pink-950/20 border-2 border-indigo-300 hover:border-indigo-500 dark:border-indigo-900/60 dark:hover:border-indigo-500 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-indigo-600/30 mb-6 group-hover:scale-110 transition-transform">
                  📝
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 inline-block mb-2">
                  Option 2: Notes & Syllabus
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  📝 Notes (नोट्स एवं सिलेबस)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Google Drive आधिकारिक नोट्स फोल्डर, {activeWeek?.topics?.length || 0} सिलेबस टॉपिक्स की इंटरैक्टिव चेकलिस्ट और महत्वपूर्ण कमांड्स।
                </p>
              </div>

              <div className="pt-4 border-t border-indigo-200 dark:border-indigo-900/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStage('notes');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Notes Page खोलें (Read Notes)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE 4: VIDEO PAGE VIEW (अगर वीडियो सेलेक्ट करेगा तो वीडियो पेज खुलेगा)  */}
      {/* ========================================================================= */}
      {stage === 'video' && activeWeek && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStage('action_choice')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-pink-600 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back (विकल्प बदलें)</span>
              </button>
              <button
                onClick={() => setStage('week')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 font-bold text-xs border border-pink-200 dark:border-pink-800 transition-all cursor-pointer active:scale-95"
              >
                <span>Week 1–8 सूची</span>
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
                <span>📝 Switch to Notes (नोट्स देखें)</span>
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
                  src={`https://www.youtube-nocookie.com/embed/${currentVideoObj.youtubeId}?rel=0`}
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
      {/* STAGE 5: NOTES PAGE VIEW (अगर नोट्स सेलेक्ट करें तो नोट्स खुलेगा)          */}
      {/* ========================================================================= */}
      {stage === 'notes' && activeWeek && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStage('action_choice')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:text-indigo-600 font-bold text-xs transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back (विकल्प बदलें)</span>
              </button>
              <button
                onClick={() => setStage('week')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer active:scale-95"
              >
                <span>Week 1–8 सूची</span>
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
                <span>🎥 Switch to Video (वीडियो देखें)</span>
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
                  <span>Syllabus Topics Checklist (चेकलिस्ट पर टिक करें)</span>
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

            {/* Cheatsheet / Key Commands if available */}
            {activeWeek.keyCommands && activeWeek.keyCommands.length > 0 && (
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5 mb-3">
                  <Terminal className="w-4 h-4 text-pink-600" />
                  <span>Essential Commands & Syntax Reference (महत्वपूर्ण कमांड्स)</span>
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
      {/* COLLAPSIBLE FULL 8-WEEK SYLLABUS OVERVIEW                                 */}
      {/* ========================================================================= */}
      {showFullOverview && (
        <div className="mt-10 pt-8 border-t-2 border-dashed border-gray-200 dark:border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>📚</span>
              <span>All 8 Weeks Overview: {activeCourse.name}</span>
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
