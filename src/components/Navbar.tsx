import React from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileDropdown } from "@/components/ProfileDropdown"; // Import the new ProfileDropdown

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-background border-b border-border">
      <Link to="/" className="flex items-center space-x-2">
        {/* Placeholder for a logo image */}
        {/* <img src="/logo.svg" alt="LBB Management Logo" className="h-8 w-8" /> */}
        <span className="text-2xl font-bold text-primary dark:text-logo-yellow">LBB Management</span>
      </Link>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <ProfileDropdown /> {/* Add the ProfileDropdown here */}
      </div>
    </nav>
  );
}