// ─────────────────────────────────────────────
//  FLEX Compass – Static Course & Semester Data
//  Edit this file to change demo data instantly.
// ─────────────────────────────────────────────

/**
 * Courses array: each course holds its own attendance
 * records (an array of booleans) and assessment breakdown.
 */
export const INITIAL_COURSES = [
  {
    id: '1',
    name: 'Software Engineering',
    code: 'SE-311',
    creditHours: 3,
    totalClasses: 40,
    // true = present, false = absent
    attendance: [
      true, true, false, true, true, true, false, true,
      true, true, true, false, true, true, true, true,
      true, false, true, true, true, true, false, true,
      true, true, true, true, false, true,
    ],
    assessments: [
      { name: 'Quiz 1',    weight: 5,  obtained: 4.5 },
      { name: 'Quiz 2',    weight: 5,  obtained: 4.0 },
      { name: 'Assignment',weight: 10, obtained: 9.0 },
      { name: 'Midterm',   weight: 30, obtained: 25.0 },
      { name: 'Final',     weight: 50, obtained: null }, // not yet taken
    ],
  },
  {
    id: '2',
    name: 'Mobile Computing',
    code: 'CS-301',
    creditHours: 3,
    totalClasses: 38,
    attendance: [
      true, true, false, false, true, true, false, true,
      false, true, true, false, false, true, true, true,
      false, false, true, true, false, true, true, false,
      true, false,
    ],
    assessments: [
      { name: 'Quiz 1',    weight: 5,  obtained: 3.0 },
      { name: 'Quiz 2',    weight: 5,  obtained: 2.5 },
      { name: 'Assignment',weight: 10, obtained: 7.5 },
      { name: 'Midterm',   weight: 30, obtained: 19.0 },
      { name: 'Final',     weight: 50, obtained: null },
    ],
  },
  {
    id: '3',
    name: 'Database Systems',
    code: 'DB-201',
    creditHours: 3,
    totalClasses: 42,
    attendance: [
      true, true, true, true, true, false, true, true,
      true, true, true, true, true, false, true, true,
      true, true, true, true, true, true, false, true,
      true, true, true, true, true, true, true, true,
      true, false, true, true,
    ],
    assessments: [
      { name: 'Quiz 1',    weight: 5,  obtained: 5.0 },
      { name: 'Quiz 2',    weight: 5,  obtained: 4.5 },
      { name: 'Assignment',weight: 10, obtained: 9.5 },
      { name: 'Midterm',   weight: 30, obtained: 27.0 },
      { name: 'Final',     weight: 50, obtained: null },
    ],
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CN-401',
    creditHours: 3,
    totalClasses: 36,
    attendance: [
      true, false, true, true, true, true, true, false,
      true, true, true, true, true, true, false, true,
      true, true, true, true, true, true, true, true,
      true, true, true, false, true, true,
    ],
    assessments: [
      { name: 'Quiz 1',    weight: 5,  obtained: 4.0 },
      { name: 'Assignment',weight: 15, obtained: 13.0 },
      { name: 'Midterm',   weight: 30, obtained: 24.0 },
      { name: 'Final',     weight: 50, obtained: null },
    ],
  },
  {
    id: '5',
    name: 'Artificial Intelligence',
    code: 'AI-501',
    creditHours: 4,
    totalClasses: 45,
    attendance: [
      true, false, false, true, false, true, true, false,
      true, true, false, false, true, true, true, false,
      true, false, true, true, false, true, true, false,
      true, true, false, true, false, true, true, false,
      true, true,
    ],
    assessments: [
      { name: 'Quiz 1',    weight: 5,  obtained: 3.5 },
      { name: 'Quiz 2',    weight: 5,  obtained: 3.0 },
      { name: 'Project',   weight: 20, obtained: 15.0 },
      { name: 'Midterm',   weight: 20, obtained: 13.0 },
      { name: 'Final',     weight: 50, obtained: null },
    ],
  },
];

/**
 * Historical semester GPA data for the LineChart trend.
 * Each entry = one past semester.
 */
export const SEMESTER_GPA_HISTORY = [
  { label: 'S1', gpa: 2.8 },
  { label: 'S2', gpa: 3.1 },
  { label: 'S3', gpa: 3.4 },
  { label: 'S4', gpa: 3.2 },
  { label: 'S5', gpa: 3.6 },
  { label: 'S6', gpa: 3.5 }, // current (partial)
];
