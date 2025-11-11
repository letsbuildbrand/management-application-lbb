"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast"; // Assuming you have a toast utility
import { useSession } from "@/components/SessionContextProvider"; // Import useSession

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useSession(); // Get user and profile from session

  const handleLogout = async () => {
    await signOut(); // Use the signOut function from context
  };

  const getAvatarFallback = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (!user) {
    return null; // Don't show dropdown if not logged in
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || 'User'}`} alt={profile?.first_name || "User"} />
          <AvatarFallback>{getAvatarFallback(profile?.first_name, profile?.last_name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <p>My Account</p>
          {profile?.role && (
            <p className="text-xs text-muted-foreground capitalize">{profile.role.replace('_', ' ')}</p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Our Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/change-password">Change Password</Link>
        </DropdownMenuItem>
        {profile?.role === 'super_admin' && ( // Only show for super_admin role
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/super-admin-dashboard">Super Admin Dashboard</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}