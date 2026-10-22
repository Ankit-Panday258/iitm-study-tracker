// Curriculum snapshot from the official IITM BS Data Science and Applications
// academics page. Electives and Diploma in Data Science options can change.
export const IITM_CURRICULUM_SOURCE = 'https://study.iitm.ac.in/ds/academics.html';

export const IITM_STUDY_GOALS = [
  { id: 'foundation', label: 'Foundation', curriculumLevel: 'Foundation' },
  { id: 'diploma-programming', label: 'Diploma in Programming', curriculumLevel: 'Diploma in Programming' },
  { id: 'diploma-data-science', label: 'Diploma in Data Science', curriculumLevel: 'Diploma in Data Science' },
  { id: 'bsc-degree', label: 'BSc Degree in Programming and Data Science', curriculumLevel: 'Degree Level' },
  { id: 'bs-degree', label: 'BS Degree in Data Science and Applications', curriculumLevel: 'Degree Level' }
];

export const IITM_CURRICULUM = [
  { level: 'Foundation', name: 'Mathematics for Data Science I', code: 'BSMA1001', credits: 4 },
  { level: 'Foundation', name: 'Statistics for Data Science I', code: 'BSMA1002', credits: 4 },
  { level: 'Foundation', name: 'Computational Thinking', code: 'BSCS1001', credits: 4 },
  { level: 'Foundation', name: 'English I', code: 'BSHS1001', credits: 4 },
  { level: 'Foundation', name: 'Mathematics for Data Science II', code: 'BSMA1003', credits: 4 },
  { level: 'Foundation', name: 'Statistics for Data Science II', code: 'BSMA1004', credits: 4 },
  { level: 'Foundation', name: 'Programming in Python', code: 'BSCS1002', credits: 4 },
  { level: 'Foundation', name: 'English II', code: 'BSHS1002', credits: 4 },

  { level: 'Diploma in Programming', name: 'Database Management Systems', code: 'BSCS2001', credits: 4 },
  { level: 'Diploma in Programming', name: 'Programming, Data Structures and Algorithms using Python', code: 'BSCS2002', credits: 4 },
  { level: 'Diploma in Programming', name: 'Modern Application Development I', code: 'BSCS2003', credits: 4 },
  { level: 'Diploma in Programming', name: 'Modern Application Development I - Project', code: 'BSCS2003P', credits: 2, kind: 'Project' },
  { level: 'Diploma in Programming', name: 'Programming Concepts using Java', code: 'BSCS2005', credits: 4 },
  { level: 'Diploma in Programming', name: 'Modern Application Development II', code: 'BSCS2006', credits: 4 },
  { level: 'Diploma in Programming', name: 'Modern Application Development II - Project', code: 'BSCS2006P', credits: 2, kind: 'Project' },
  { level: 'Diploma in Programming', name: 'System Commands', code: 'BSSE2001', credits: 3, kind: 'Skill enhancement' },

  { level: 'Diploma in Data Science', name: 'Machine Learning Foundations', code: 'BSCS2004', credits: 4, kind: 'Mandatory' },
  { level: 'Diploma in Data Science', name: 'Business Data Management', code: 'BSMS2001', credits: 4, kind: 'Mandatory' },
  { level: 'Diploma in Data Science', name: 'Machine Learning Techniques', code: 'BSCS2007', credits: 4, kind: 'Mandatory' },
  { level: 'Diploma in Data Science', name: 'Machine Learning Practice', code: 'BSCS2008', credits: 4, kind: 'Mandatory' },
  { level: 'Diploma in Data Science', name: 'Machine Learning Practice - Project', code: 'BSCS2008P', credits: 2, kind: 'Mandatory project' },
  { level: 'Diploma in Data Science', name: 'Tools in Data Science', code: 'BSSE2002', credits: 3, kind: 'Skill enhancement' },
  { level: 'Diploma in Data Science', name: 'Business Data Management - Project', code: 'BSMS2001P', credits: 2, kind: 'Option 1 project' },
  { level: 'Diploma in Data Science', name: 'Business Analytics', code: 'BSMS2002', credits: 4, kind: 'Option 1' },
  { level: 'Diploma in Data Science', name: 'Introduction to Deep Learning and Generative AI', code: 'BSDA2001', credits: 4, kind: 'Option 2' },
  { level: 'Diploma in Data Science', name: 'Deep Learning and Generative AI - Project', code: 'BSDA2001P', credits: 2, kind: 'Option 2 project' },

  { level: 'Degree Level', name: 'Software Engineering', code: 'BSCS3001', credits: 4, kind: 'Core' },
  { level: 'Degree Level', name: 'Software Testing', code: 'BSCS3002', credits: 4, kind: 'Core' },
  { level: 'Degree Level', name: 'AI: Search Methods for Problem Solving', code: 'BSCS3003', credits: 4, kind: 'Core' },
  { level: 'Degree Level', name: 'Deep Learning', code: 'BSCS3004', credits: 4, kind: 'Core' },
  { level: 'Degree Level', name: 'Strategies for Professional Growth', code: 'BSGN3001', credits: 4, kind: 'Mandatory' },
  { level: 'Degree Level', name: 'Algorithmic Thinking in Bioinformatics', code: 'BSBT4001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Big Data and Biological Networks', code: 'BSBT4002', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Data Visualization Design', code: 'BSCS4001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Speech Technology', code: 'BSEE4001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Design Thinking for Data-Driven App Development', code: 'BSMS4002', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Industry 4.0', code: 'BSMS4001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Market Research', code: 'BSMS3002', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Privacy & Security in Online Social Media', code: 'BSCS4003', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Introduction to Big Data', code: 'BSDA5001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Financial Forensics', code: 'BSMS4003', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Linear Statistical Models', code: 'BSMA3012', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Advanced Algorithms', code: 'BSCS4021', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Statistical Computing', code: 'BSMA3014', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Computer Systems Design', code: 'BSCS3031', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Programming in C', code: 'BSCS3005', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Mathematical Thinking', code: 'BSMA2001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Large Language Models', code: 'BSDA5004', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Introduction to Natural Language Processing (i-NLP)', code: 'BSDA5005', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Deep Learning for Computer Vision', code: 'BSDA5006', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Managerial Economics', code: 'BSMS3033', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Game Theory and Strategy', code: 'BSMS4023', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Corporate Finance', code: 'BSMS3034', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Deep Learning Practice', code: 'BSDA5013', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Operating Systems', code: 'BSCS4022', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Mathematical Foundations of Generative AI', code: 'BSDA5002', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Algorithms for Data Science (ADS)', code: 'BSDA5003', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Machine Learning Operations (MLOps)', code: 'BSDA5014', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Data Science and AI Lab', code: 'BSDA4001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'App Dev Lab', code: 'BSCS4010', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Computer Networks', code: 'BSCS4024', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Theory of Computation', code: 'BSCS3021', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Reinforcement Learning', code: 'BSDA5007', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Compiler Design', code: 'BSCS4032', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Discrete Mathematics', code: 'BSMA3001', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Sequential Decision Making', code: 'BSDA6004', credits: 4, kind: 'Elective' },
  { level: 'Degree Level', name: 'Linear Models with Applications', code: 'BSMA3015', credits: 4, kind: 'Elective' }
];

export const IITM_CURRICULUM_LEVELS = [
  'All levels',
  'Foundation',
  'Diploma in Programming',
  'Diploma in Data Science',
  'Degree Level'
];
