import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { userService } from '../../services/user.service';
import { toast } from 'sonner';

export const ChangePasswordCard: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    return score;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsUpdating(true);
      await userService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success('Password changed successfully');
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  const strength = getPasswordStrength(formData.newPassword);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <Shield className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Change Password</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.newPassword.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className={`h-1.5 w-full rounded-full ${strength >= 1 ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <div className={`h-1.5 w-full rounded-full ${strength >= 2 ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <div className={`h-1.5 w-full rounded-full ${strength >= 3 ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
              <div className={`h-1.5 w-full rounded-full ${strength >= 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
