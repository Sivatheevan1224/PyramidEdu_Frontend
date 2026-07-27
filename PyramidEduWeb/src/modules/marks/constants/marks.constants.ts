export const ASSESSMENT_TYPES = [
  { value: 'MANUAL_EXAM', label: 'Manual Exam' },
  { value: 'ONLINE_EXAM', label: 'Online Exam' },
  { value: 'QUIZ', label: 'Quiz' },
];

export const getBadgeColor = (type: string) => {
  switch (type) {
    case 'MANUAL_EXAM':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/40';
    case 'ONLINE_EXAM':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/40';
    case 'QUIZ':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
  }
};

export const getScoreColor = (pct: number) => {
  if (pct >= 75) return 'text-emerald-600 dark:text-emerald-400 font-bold';
  if (pct >= 50) return 'text-slate-900 dark:text-slate-100 font-semibold';
  return 'text-rose-600 dark:text-rose-400 font-bold';
};
