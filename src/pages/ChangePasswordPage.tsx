import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess } from "@/utils/toast";

const ChangePasswordPage = () => {
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual password change logic
    showSuccess("Password change initiated (backend logic needed).");
    console.log("Simulating password change...");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Change Password</h1>

        <form onSubmit={handleChangePassword} className="bg-card p-6 rounded-lg shadow-md max-w-md mx-auto space-y-6">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="Enter current password" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="Enter new password" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="Confirm new password" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;