import React, { useState } from 'react';
import { User, UpdateUserPayload } from '../../types/user.types';
import { userService } from '../../services/user.service';
import { toast } from 'sonner';

interface ProfileInfoCardProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const payload: UpdateUserPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      };
      const updatedUser = await userService.updateProfile(payload);
      onProfileUpdate(updatedUser);
      setIsEditing(false);
      toast.success('Profile information updated successfully');
    } catch (error) {
      toast.error('Failed to update profile information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Personal Information</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">First Name</label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 dark:text-white font-medium">{user.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 dark:text-white font-medium">{user.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address (Read Only)</label>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-slate-900 dark:text-white font-medium">{user.phoneNumber || 'Not provided'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
