import React from 'react';
import { cn } from '@/lib/utils';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClick, className }) => {
  return (
    <button
      className={cn(
        "flex flex-col justify-around w-8 h-8 bg-transparent border-none cursor-pointer p-0 focus:outline-none",
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div
        className={cn(
          "w-8 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
          isOpen && "rotate-45 translate-y-[0.56rem]" // Adjust translate-y to align for 'X'
        )}
      />
      <div
        className={cn(
          "w-8 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
          isOpen && "opacity-0"
        )}
      />
      <div
        className={cn(
          "w-8 h-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out",
          isOpen && "-rotate-45 -translate-y-[0.56rem]" // Adjust translate-y to align for 'X'
        )}
      />
    </button>
  );
};