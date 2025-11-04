import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="text-left py-8 px-4 mt-16"> {/* Changed text-center to text-left */}
      <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-2"> {/* Reduced font size */}
        Welcome back,{' '}
        <span className="bg-gradient-to-r from-logo-red to-logo-yellow text-transparent bg-clip-text">
          {userName}
        </span>
      </h1>
    </div>
  );
}