import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="text-center py-12 px-4 mt-16"> {/* Added mt-16 to push content down from fixed navbar */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Welcome back,{' '}
        <span className="bg-gradient-to-r from-logo-red to-logo-yellow text-transparent bg-clip-text">
          {userName}
        </span>
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        Explore your departments and manage your operations efficiently.
      </p>
    </div>
  );
}