"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  profile: any | null; // You'll want to type this more strictly later
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      showError("Failed to load user profile.");
      setProfile(null);
    } else {
      setProfile(profileData);
      return profileData;
    }
    return null;
  }, []);

  const redirectToRoleDashboard = useCallback((userProfile: any) => {
    if (!userProfile) return;

    switch (userProfile.role) {
      case 'super_admin':
        navigate('/super-admin-dashboard');
        break;
      case 'admin': // Admin can view all departments, so redirect to departments page
        navigate('/departments');
        break;
      case 'client_assigner':
        navigate('/client-assigner-dashboard');
        break;
      case 'manager':
        navigate('/manager-dashboard');
        break;
      case 'editor':
        navigate('/video-editing-dashboard');
        break;
      case 'client':
        navigate('/client-dashboard');
        break;
      default:
        navigate('/home'); // Default redirect for unknown roles or general users
    }
  }, [navigate]);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        showError("Failed to retrieve session.");
      }
      setSession(session);
      setUser(session?.user || null);

      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        if (userProfile) {
          redirectToRoleDashboard(userProfile);
        }
      } else {
        // If no session or user, ensure we are on the login page
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        showSuccess("Welcome back!");
        if (currentSession?.user) {
          const userProfile = await fetchProfile(currentSession.user.id);
          if (userProfile) {
            redirectToRoleDashboard(userProfile);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        showSuccess("You have been logged out.");
        setProfile(null);
        navigate('/login');
      } else if (event === 'INITIAL_SESSION' && currentSession?.user) {
        // For initial session, if user is already logged in, fetch profile and redirect
        const userProfile = await fetchProfile(currentSession.user.id);
        if (userProfile) {
          redirectToRoleDashboard(userProfile);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, fetchProfile, redirectToRoleDashboard]);

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      showError("Failed to sign out.");
    } else {
      setSession(null);
      setUser(null);
      setProfile(null);
      showSuccess("Logged out successfully!");
      navigate('/login');
    }
    setIsLoading(false);
  };

  return (
    <SessionContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};