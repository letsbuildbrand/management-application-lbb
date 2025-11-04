import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="text-center py-8 px-4 mt-16">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
        Welcome back,{' '}
        <span className="bg-gradient-to-r from-logo-red to-logo-yellow text-transparent bg-clip-text">
          {userName}
        </span>
      </h1>
    </div>
  );
}