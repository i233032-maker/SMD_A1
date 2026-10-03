// ─────────────────────────────────────────────
//  FLEX Compass – Pure Calculation Utilities
//  All functions are stateless and testable.
// ─────────────────────────────────────────────

import { ATTENDANCE_THRESHOLD, GPA_SCALE } from '../constants';

/**
 * Calculate attendance percentage for a course.
 * @param {boolean[]} attendance  array of true/false values
 * @returns {number} percentage 0-100
 */
export function calcAttendancePct(attendance) {
  if (!attendance || attendance.length === 0) return 0;
  const present = attendance.filter(Boolean).length;
  return Math.round((present / attendance.length) * 100);
}

/**
 * How many classes a student can still skip while staying above threshold.
 * Uses the formula:  skippable = floor((attended - threshold*total) / (1 - threshold))
 * Clamps to 0 minimum.
 * @param {boolean[]} attendance
 * @param {number} totalClasses   planned total classes for the semester
 * @returns {number}
 */
export function calcSkippableClasses(attendance, totalClasses) {
  const attended = attendance.filter(Boolean).length;
  const taken    = attendance.length;
  const remaining = totalClasses - taken;
  // Future classes needed to maintain threshold
  const minAttend = Math.ceil(ATTENDANCE_THRESHOLD / 100 * totalClasses);
  const skippable = attended - minAttend + remaining; // already-attended surplus + future
  // Re-derive: if student skips s more, they need (attended) >= threshold*(taken+s)
  // => s <= attended/threshold - taken  (in real terms)
  const maxSkip = Math.floor(attended / (ATTENDANCE_THRESHOLD / 100)) - taken;
  return Math.max(0, maxSkip);
}

/**
 * Calculate the total percentage obtained so far (ignoring null assessments).
 * Scales obtained marks to their weight proportionally.
 * Returns { obtained, totalWeight, pct }
 */
export function calcCurrentMarks(assessments) {
  const done = assessments.filter(a => a.obtained !== null);
  const totalWeight  = done.reduce((s, a) => s + a.weight, 0);
  const totalObtained = done.reduce((s, a) => s + a.obtained, 0);
  const maxForDone   = done.reduce((s, a) => s + a.weight, 0);
  const pct = maxForDone > 0 ? Math.round((totalObtained / maxForDone) * 100) : 0;
  return { obtained: totalObtained, totalWeight, pct };
}

/**
 * Given current marks and a target total %, calculate required % in the final.
 * @param {object[]} assessments  course assessments array
 * @param {number}   targetPct    desired final percentage (0-100)
 * @returns {{ requiredPct: number, finalWeight: number, possible: boolean }}
 */
export function calcRequiredFinalMark(assessments, targetPct) {
  // Separate completed vs pending
  const done    = assessments.filter(a => a.obtained !== null);
  const pending = assessments.filter(a => a.obtained === null);
  const finalWeight = pending.reduce((s, a) => s + a.weight, 0);

  if (finalWeight === 0) {
    // All done; calculate actual
    const total = done.reduce((s, a) => s + a.obtained, 0);
    const max   = done.reduce((s, a) => s + a.weight, 0);
    return { requiredPct: max > 0 ? Math.round((total / max) * 100) : 0, finalWeight: 0, possible: true };
  }

  // scoredSoFar = raw obtained marks (each 'obtained' is already out of its 'weight')
  // e.g. Midterm obtained=25 out of weight=30 means 25 marks contributing to 100-point total
  const scoredSoFar = done.reduce((s, a) => s + a.obtained, 0);

  // Equation: scoredSoFar + (requiredPct/100)*finalWeight = targetPct
  // => requiredPct = (targetPct - scoredSoFar) / finalWeight * 100
  const requiredPct = Math.round(((targetPct - scoredSoFar) / finalWeight) * 100);

  return {
    requiredPct,
    finalWeight,
    // Impossible if score needed exceeds 100% OR target is already achieved (negative needed)
    possible: requiredPct >= 0 && requiredPct <= 100,
    alreadyAchieved: requiredPct < 0,
  };
}

/**
 * Map a percentage to a letter grade.
 * @param {number} pct
 * @returns {string} grade letter
 */
export function pctToGrade(pct) {
  const found = GPA_SCALE.find(g => pct >= g.min);
  return found ? found.grade : 'F';
}

/**
 * Map a percentage to a GPA point.
 * @param {number} pct
 * @returns {number}
 */
export function pctToGPA(pct) {
  const found = GPA_SCALE.find(g => pct >= g.min);
  return found ? found.gpa : 0.0;
}

/**
 * Calculate weighted GPA across all courses using credit hours.
 * @param {object[]} courses
 * @returns {number} GPA rounded to 2 decimal places
 */
export function calcOverallGPA(courses) {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const { pct } = calcCurrentMarks(course.assessments);
    const gpa = pctToGPA(pct);
    totalPoints  += gpa * course.creditHours;
    totalCredits += course.creditHours;
  });

  return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
}

/**
 * Get attendance status: 'safe' | 'warning' | 'danger'
 * @param {number} pct attendance percentage
 */
export function getAttendanceStatus(pct) {
  if (pct >= 80) return 'safe';
  if (pct >= 75) return 'warning';
  return 'danger';
}

/**
 * Build dynamic warning messages for all at-risk courses.
 * @param {object[]} courses
 * @returns {string[]} array of warning strings
 */
export function buildWarnings(courses) {
  return courses
    .map(c => {
      const pct  = calcAttendancePct(c.attendance);
      const skip = calcSkippableClasses(c.attendance, c.totalClasses);
      if (pct < ATTENDANCE_THRESHOLD) {
        return `⚠️  ${c.code}: Attendance ${pct}% — BELOW ${ATTENDANCE_THRESHOLD}% threshold! You cannot miss any more classes.`;
      }
      if (pct < 80) {
        return `🔔  ${c.code}: Attendance ${pct}% — Only ${skip} class${skip === 1 ? '' : 'es'} you can still skip.`;
      }
      return null;
    })
    .filter(Boolean); // remove nulls
}

/**
 * Grade distribution: count courses in each grade band.
 * Returns array of { grade, count } sorted by GPA_SCALE order.
 */
export function gradeDistribution(courses) {
  const dist = {};
  GPA_SCALE.forEach(g => { dist[g.grade] = 0; });
  courses.forEach(c => {
    const { pct } = calcCurrentMarks(c.assessments);
    const grade = pctToGrade(pct);
    dist[grade] = (dist[grade] || 0) + 1;
  });
  return Object.entries(dist)
    .filter(([, count]) => count > 0)
    .map(([grade, count]) => ({ grade, count }));
}
