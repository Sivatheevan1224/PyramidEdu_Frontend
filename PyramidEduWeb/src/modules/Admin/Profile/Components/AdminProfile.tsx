import React from 'react';
import { useProfile } from '@/modules/users/hooks/useProfile';
import { ProfileHeaderCard } from '@/modules/users/components/profile/ProfileHeaderCard';
import { ProfileInfoCard } from '@/modules/users/components/profile/ProfileInfoCard';
import { ChangePasswordCard } from '@/modules/users/components/profile/ChangePasswordCard';
import { AccountActivityCard } from '@/modules/users/components/profile/AccountActivityCard';

export const AdminProfile = () => {
  const { user, isLoading, fetchProfile, handleProfileUpdate } = useProfile();

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Profile Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400">We couldn't load your profile information.</p>
          <button 
            onClick={fetchProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
      </div>

      <ProfileHeaderCard user={user} onProfileUpdate={handleProfileUpdate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileInfoCard user={user} onProfileUpdate={handleProfileUpdate} />
        </div>
        
        <div className="space-y-6">
          <AccountActivityCard user={user} />
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  );
};
