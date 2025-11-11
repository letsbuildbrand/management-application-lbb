"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { CreateUserDialog } from "@/components/CreateUserDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/components/SessionContextProvider";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SuperAdminDashboardPage = () => {
  const { user, profile, isLoading: isSessionLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSessionLoading && (!user || profile?.role !== 'super_admin')) {
      showError("Access Denied: You must be a super admin to view this page.");
      navigate('/login');
    }
  }, [isSessionLoading, user, profile, navigate]);

  const handleCreateUser = async (firstName: string, email: string, password: string, role: string) => {
    try {
      const companyName = role === 'client' ? `${firstName} Company` : undefined;

      // Invoke the Edge Function to create the user
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName: '', // Can extend CreateUserDialog to include last name
          role,
          companyName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      showSuccess(`User "${firstName}" (${role}) created successfully! An email has been sent to ${email} for verification.`);
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      showError(`Failed to create user: ${error.message}`);
      throw error;
    }
  };

  if (isSessionLoading || !user || profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading super admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName={profile?.first_name || "Super Admin"} />
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 px-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tighter flex items-center gap-3">
                <Badge variant="default" className="bg-logo-purple text-white text-sm px-3 py-1">Super Admin</Badge>
                Credential Management
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Create new user accounts for all roles.
              </p>
            </div>
            <CreateUserDialog onCreateUser={handleCreateUser}>
              <Button className="h-10 px-5">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New User
              </Button>
            </CreateUserDialog>
          </div>

          <div className="p-4 text-muted-foreground">
            <p>Use the "Create New User" button to generate credentials for any role.</p>
            <p className="mt-2">New users will receive an email to verify their account and set their password.</p>
            <p className="mt-2 text-sm text-red-400">
              **Important:** For the `create-user` Edge Function to work, you need to set the `SUPABASE_SERVICE_ROLE_KEY` secret in your Supabase project.
              Go to <a href="https://app.supabase.com/project/faywcisblbmuqdfauoej/functions/secrets" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Project -> Edge Functions -> Manage Secrets</a> and add `SUPABASE_SERVICE_ROLE_KEY` with your project's service role key.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboardPage;