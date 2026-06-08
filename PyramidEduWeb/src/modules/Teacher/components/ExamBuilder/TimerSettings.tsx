import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TimerSettingsProps {
  startTime: string;
  duration: number;
  onStartTimeChange: (val: string) => void;
  onDurationChange: (val: number) => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  startTime,
  duration,
  onStartTimeChange,
  onDurationChange
}) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Timer &amp; Schedule Settings</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Start Time</label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="text-xs border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Duration (Minutes)</label>
          <Input
            type="number"
            min="1"
            placeholder="e.g., 90"
            value={duration || ''}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="text-xs border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/10 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/20">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          When the duration expires, the quiz/exam will automatically submit for the student. Please verify the start time matches class schedules.
        </span>
      </div>
    </div>
  );
};
