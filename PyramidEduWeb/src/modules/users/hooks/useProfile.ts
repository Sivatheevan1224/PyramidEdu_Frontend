import { useState, useEffect } from 'react';
import { User } from '@/modules/users/types/user.types';
import { userService } from '@/modules/users/services/user.service';
import { toast } from 'sonner';

export const useProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await userService.getProfile();
      setUser(profile);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return {
    user,
    isLoading,
    fetchProfile,
    handleProfileUpdate,
  };
};
