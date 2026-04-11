/**
 * Report Card Utilities (React Native)
 * Same calculation logic as web version
 */

export const calculateMean = (test1, test2) => {
  const t1 = parseFloat(test1) || 0;
  const t2 = parseFloat(test2) || 0;
  return parseFloat(((t1 + t2) / 2).toFixed(1));
};

export const getOrdinal = (n) => {
  if (!n) return '—';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const getScoreColor = (score, max = 20) => {
  if (score == null) return '#6b7280';
  const pct = (score / max) * 100;
  if (pct >= 80) return '#059669';
  if (pct >= 60) return '#ca8a04';
  if (pct >= 40) return '#ea580c';
  return '#dc2626';
};

export const getMeanColor = (mean) => {
  if (mean == null) return '#6b7280';
  if (mean >= 16) return '#059669';
  if (mean >= 12) return '#ca8a04';
  if (mean >= 8) return '#ea580c';
  return '#dc2626';
};

export const getGradeColor = (grade) => {
  const colors = {
    'A+': '#059669', A: '#059669', B: '#2563eb',
    C: '#ca8a04', D: '#ea580c', E: '#dc2626', F: '#dc2626',
  };
  return colors[grade] || '#6b7280';
};

export const getRankBadge = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

export const ratingToLabel = (val) => {
  const labels = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'E' };
  return labels[val] || '—';
};

export const ratingToColor = (val) => {
  if (val >= 4) return '#059669';
  if (val >= 3) return '#ca8a04';
  if (val >= 2) return '#ea580c';
  return '#dc2626';
};

export const RATING_LABELS = {
  cognitive: {
    punctuality: 'Punctuality',
    attentiveness: 'Attentiveness',
    assignment: 'Assignment',
    classwork: 'Classwork',
    testPrep: 'Test Prep',
  },
  affective: {
    neatness: 'Neatness',
    politeness: 'Politeness',
    honesty: 'Honesty',
    teamwork: 'Teamwork',
    leadership: 'Leadership',
  },
  psychomotor: {
    sports: 'Sports',
    handwriting: 'Handwriting',
    drawing: 'Drawing',
    crafts: 'Crafts',
    verbal: 'Verbal',
  },
};
