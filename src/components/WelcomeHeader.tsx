import React from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="text-center py-8 px-4 mt-16"> {/* Reduced py-12 to py-8 */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2"> {/* Reduced text-4xl md:text-5xl to text-2xl md:text-3xl and mb-4 to mb-2 */}
        Welcome back,{' '}
        <span className="bg-gradient-to-r from-logo-red to-logo-yellow text-transparent bg-clip-text">
          {userName}
        </span>
      </h1>
      <p className="text-sm text-muted-foreground max-w-xl mx-auto"> {/* Reduced text-lg to text-sm */}
        Explore your departments and manage your operations efficiently.
      </p>
    </div>
  );
}