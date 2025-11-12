"use client";

import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast'; // Import toast utilities
import { CreateUserDialog } from '@/components/CreateUserDialog'; // Import CreateUserDialog
import { Button } from '@/components/ui/button'; // Import Button for the dialog trigger

const LoginPage = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  // Function to handle user creation via the Edge Function
  const handleCreateUser = async (firstName: string, email: string, password: string, role: string) => {
    try {
      const companyName = role === 'client' ? `${firstName} Company` : undefined;

      const { data, error } = await supabase.functions.invoke('create-user', {
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName: '', // Assuming last name is optional or handled by trigger
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
      console.error("Error creating user via Edge Function:", error.message);
      showError(`Failed to create user: ${error.message}`);
      throw error; // Re-throw to be caught by the dialog's error handling
    }
  };

  useEffect(() => {
    if (!isLoading && session) {
      // Redirection logic is handled in SessionContextProvider
      // This page should only be accessible if not logged in
      // If session exists, it means SessionContextProvider is already redirecting
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (session) {
    return null; // SessionContextProvider handles redirection
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary dark:text-logo-yellow">LBB Management Login</h1>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Only email/password for now
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--accent))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--muted-foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--destructive-foreground))',
                  messageBackground: 'hsl(var(--destructive))',
                  anchorTextColor: 'hsl(var(--primary))',
                  anchorTextHoverColor: 'hsl(var(--accent))',
                },
              },
              dark: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--accent))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBackgroundHover: 'hsl(var(--secondary-foreground))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--muted-foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--destructive-foreground))',
                  messageBackground: 'hsl(var(--destructive))',
                  anchorTextColor: 'hsl(var(--primary))',
                  anchorTextHoverColor: 'hsl(var(--accent))',
                },
              },
            },
          }}
          theme="dark" // Use dark theme by default for consistency with app's default
          magicLink={true}
          showLinks={true}
        />
        {/* Temporary button to create first super_admin user */}
        <div className="mt-6 text-center">
          <CreateUserDialog onCreateUser={handleCreateUser}>
            <Button variant="outline" className="w-full">
              Create First Admin User
            </Button>
          </CreateUserDialog>
          <p className="text-xs text-muted-foreground mt-2">
            Use this to create your initial super admin account if you don't have one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;