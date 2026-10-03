// ─────────────────────────────────────────────
//  FLEX Compass – Global Constants
//  Change these values live during viva demos!
// ─────────────────────────────────────────────

// Minimum attendance % before a course is "at risk"
export const ATTENDANCE_THRESHOLD = 75;

// GPA scale boundaries
export const GPA_SCALE = [
  { grade: 'A',  min: 90, gpa: 4.0 },
  { grade: 'A-', min: 85, gpa: 3.7 },
  { grade: 'B+', min: 80, gpa: 3.3 },
  { grade: 'B',  min: 75, gpa: 3.0 },
  { grade: 'B-', min: 70, gpa: 2.7 },
  { grade: 'C+', min: 65, gpa: 2.3 },
  { grade: 'C',  min: 60, gpa: 2.0 },
  { grade: 'C-', min: 55, gpa: 1.7 },
  { grade: 'D+', min: 50, gpa: 1.3 },
  { grade: 'D',  min: 45, gpa: 1.0 },
  { grade: 'F',  min: 0,  gpa: 0.0 },
];

// Status colours (used in CourseCard, charts, warnings)
export const STATUS_COLOR = {
  safe:    '#22c55e', // green
  warning: '#f59e0b', // amber
  danger:  '#ef4444', // red
};

// Warning boundary: attendance below this → amber; below ATTENDANCE_THRESHOLD → red
export const WARNING_THRESHOLD = 80;
