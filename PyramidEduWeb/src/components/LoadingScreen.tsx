import React from 'react';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6 text-center">
        <div className="animate-pulse">
          <Logo />
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
};
