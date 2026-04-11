/**
 * Report Card Utility Functions
 * 
 * Auto-calculation of:
 * - Mean = (Test1 + Test2) / 2
 * - Total score per term
 * - Performance grading
 * - Color coding helpers
 * - Ordinal position (1st, 2nd, 3rd...)
 */

// ─── Score Color Coding ────────────────────────────────────────────────

/**
 * Returns Tailwind color classes based on score (out of 20)
 * High (16-20) = green, Average (10-15) = yellow, Low (0-9) = red
 */
export const getScoreColor = (score, max = 20) => {
  if (score == null || score === '') return '';
  const pct = (score / max) * 100;
  if (pct >= 80) return 'text-emerald-700 font-semibold';
  if (pct >= 60) return 'text-yellow-700';
  if (pct >= 40) return 'text-orange-600';
  return 'text-red-600 font-semibold';
};

export const getScoreBgColor = (score, max = 20) => {
  if (score == null || score === '') return '';
  const pct = (score / max) * 100;
  if (pct >= 80) return 'bg-emerald-50';
  if (pct >= 60) return 'bg-yellow-50';
  if (pct >= 40) return 'bg-orange-50';
  return 'bg-red-50';
};

export const getMeanColorClass = (mean) => {
  if (mean == null) return '';
  if (mean >= 16) return 'text-emerald-700 bg-emerald-50 font-bold';
  if (mean >= 12) return 'text-yellow-700 bg-yellow-50 font-semibold';
  if (mean >= 8) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50 font-semibold';
};

export const getRankBadge = (rank) => {
  if (rank == null) return '';
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

// ─── Grade Helpers ─────────────────────────────────────────────────────

export const getGradeFromAverage = (avg) => {
  if (avg >= 90) return { grade: 'A+', remark: 'Outstanding' };
  if (avg >= 80) return { grade: 'A', remark: 'Excellent' };
  if (avg >= 70) return { grade: 'B', remark: 'Very Good' };
  if (avg >= 60) return { grade: 'C', remark: 'Good' };
  if (avg >= 50) return { grade: 'D', remark: 'Average' };
  if (avg >= 40) return { grade: 'E', remark: 'Below Average' };
  return { grade: 'F', remark: 'Fail' };
};

export const getGradeColor = (grade) => {
  const colors = {
    'A+': '#059669', A: '#059669', B: '#2563eb',
    C: '#ca8a04', D: '#ea580c', E: '#dc2626', F: '#dc2626',
  };
  return colors[grade] || '#6b7280';
};

// ─── Calculation Helpers ───────────────────────────────────────────────

/**
 * Calculate mean from two test scores
 */
export const calculateMean = (test1, test2) => {
  const t1 = parseFloat(test1) || 0;
  const t2 = parseFloat(test2) || 0;
  return parseFloat(((t1 + t2) / 2).toFixed(1));
};

/**
 * Calculate total score for a term across all subjects
 */
export const calculateTermTotal = (subjects, term) => {
  return subjects.reduce((total, subj) => {
    const termData = subj.terms?.[term];
    return total + (termData?.mean || 0);
  }, 0);
};

/**
 * Calculate average score for a term
 */
export const calculateTermAverage = (subjects, term) => {
  if (!subjects.length) return 0;
  const total = calculateTermTotal(subjects, term);
  return parseFloat((total / subjects.length).toFixed(1));
};

/**
 * Get ordinal suffix for position
 */
export const getOrdinal = (n) => {
  if (!n) return '—';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Calculate combined scores across all 3 terms
 */
export const calculateCombinedScores = (subjects) => {
  return subjects.map((subj) => {
    const t1Mean = subj.terms?.[1]?.mean || 0;
    const t2Mean = subj.terms?.[2]?.mean || 0;
    const t3Mean = subj.terms?.[3]?.mean || 0;
    const combined = parseFloat(((t1Mean + t2Mean + t3Mean) / 3).toFixed(1));
    return {
      subjectName: subj.subjectName,
      combined,
      ...getGradeFromAverage((combined / 20) * 100),
    };
  });
};

/**
 * Auto-calculate all means for a report card data object
 * Returns new data with means calculated
 */
export const recalculateAllMeans = (reportData) => {
  const updated = { ...reportData };
  updated.subjects = reportData.subjects.map((subj) => {
    const newTerms = {};
    [1, 2, 3].forEach((term) => {
      const t = subj.terms?.[term] || {};
      newTerms[term] = {
        ...t,
        mean: calculateMean(t.test1, t.test2),
      };
    });
    return { ...subj, terms: newTerms };
  });
  return updated;
};

/**
 * Rating value to label
 */
export const ratingToLabel = (val) => {
  const labels = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'E' };
  return labels[val] || '—';
};

export const ratingToColor = (val) => {
  if (val >= 4) return 'text-emerald-700 bg-emerald-50';
  if (val >= 3) return 'text-yellow-700 bg-yellow-50';
  if (val >= 2) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};
