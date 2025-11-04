import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-background border-b border-border">
      <Link to="/" className="flex items-center space-x-2">
        {/* You can add a logo here if you have one, e.g., <img src="/logo.svg" alt="Logo" className="h-8 w-8" /> */}
        <span className="text-2xl font-bold text-primary dark:text-logo-yellow">Yadish App</span>
      </Link>
      <ThemeToggle />
    </nav>
  );
}