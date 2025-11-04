import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { showSuccess } from "@/utils/toast";

const ProfilePage = () => {
  const handleProfilePicChange = () => {
    // Placeholder for actual profile picture upload logic
    showSuccess("Profile picture change initiated (backend logic needed).");
    console.log("Simulating profile picture change...");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Our Profile</h1>

        <div className="bg-card p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> {/* Placeholder image */}
              <AvatarFallback className="text-4xl">CN</AvatarFallback>
            </Avatar>
            <Button onClick={handleProfilePicChange} variant="outline">
              Change Profile Picture
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Name</p>
              <p className="text-lg font-medium">Yadish</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-lg font-medium">yadish@example.com</p>
            </div>
            {/* Add more profile details here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;