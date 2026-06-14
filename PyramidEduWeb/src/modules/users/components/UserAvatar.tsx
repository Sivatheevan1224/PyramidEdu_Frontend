/**
 * UserAvatar - Component for rendering user profile image with placeholder fallback
 */

'use client';

import React from 'react';
import { User2 } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  alt: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  className = 'w-10 h-10',
}) => {
  const [error, setError] = React.useState(false);

  // Reset error state if the source image changes
  React.useEffect(() => {
    setError(false);
  }, [src]);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} rounded-full object-cover border border-border shrink-0`}
        onError={() => setError(true)}
      />
    );
  }

  const isLarge = className.includes('w-12');
  const iconSize = isLarge ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className={`${className} rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0`}>
      <User2 className={iconSize} />
    </div>
  );
};
