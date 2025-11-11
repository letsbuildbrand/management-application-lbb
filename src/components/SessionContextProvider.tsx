"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        showError("Failed to retrieve session.");
      }
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        showSuccess("Welcome back!");
        // Fetch profile immediately after sign-in
        if (currentSession?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            showError("Failed to load user profile.");
          } else {
            setProfile(profileData);
            // Redirect based on role
            switch (profileData.role) {
              case 'admin':
                navigate('/super-admin-dashboard'); // Redirect admin to their dashboard
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
                navigate('/');
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        showSuccess("You have been logged out.");
        setProfile(null);
        navigate('/login');
      } else if (event === 'INITIAL_SESSION' && currentSession?.user) {
        // For initial session, if user is already logged in, fetch profile and redirect
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile on initial session:", profileError);
          showError("Failed to load user profile on initial session.");
        } else {
          setProfile(profileData);
          switch (profileData.role) {
            case 'admin':
              navigate('/super-admin-dashboard'); // Redirect admin to their dashboard
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
              navigate('/');
          }
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    // Fetch profile if user is available but profile isn't set (e.g., page refresh)
    const fetchProfile = async () => {
      if (user && !profile) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profileError) {
          console.error("Error fetching profile on user change:", profileError);
          showError("Failed to load user profile.");
        } else {
          setProfile(profileData);
        }
      }
    };
    fetchProfile();
  }, [user, profile]);

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