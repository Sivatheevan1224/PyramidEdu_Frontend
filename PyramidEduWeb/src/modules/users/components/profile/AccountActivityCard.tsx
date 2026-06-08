import React from 'react';
import { Activity, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { User } from '../../types/user.types';

interface AccountActivityCardProps {
  user: User;
}

export const AccountActivityCard: React.FC<AccountActivityCardProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-500" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Account Activity</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Account Role</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current access level</p>
              </div>
            </div>
            <span className="text-sm font-medium">{user.role}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Account Status</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current operational state</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${user.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {user.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Member Since</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Date account was created</p>
              </div>
            </div>
            <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Last Updated</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Last profile modification</p>
              </div>
            </div>
            <span className="text-sm font-medium">{new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
