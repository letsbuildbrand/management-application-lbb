"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Briefcase } from "lucide-react";
import { Client, Manager } from "@/data/mockData"; // Import Client and Manager interfaces
import { CreateUserDialog } from "@/components/CreateUserDialog"; // Updated import
import { AssignManagerDialog } from "@/components/AssignManagerDialog";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

const ClientAssignerDashboardPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingManagers, setIsLoadingManagers] = useState(true);

  const fetchClients = useCallback(async () => {
    setIsLoadingClients(true);
    const { data: clientsData, error: clientsError } = await supabase
      .from('profiles') // Fetch from profiles table
      .select('*')
      .eq('role', 'client'); // Filter for clients

    if (clientsError) {
      console.error("Error fetching clients:", clientsError);
      showError("Failed to load clients.");
      setClients([]);
    } else {
      // Fetch projects for each client to calculate activeProjects and unassignedTasks
      const clientsWithMetrics = await Promise.all(clientsData.map(async (clientProfile) => {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, current_status, assigned_editor_id')
          .eq('client_id', clientProfile.id);

        if (projectsError) {
          console.error(`Error fetching projects for client ${clientProfile.id}:`, projectsError);
          return { ...clientProfile, activeProjects: 0, unassignedTasks: 0 };
        }

        const activeProjects = projectsData.filter(p => p.current_status !== 'Completed' && p.current_status !== 'Approved').length;
        const unassignedTasks = projectsData.filter(p => p.current_status === 'Requested' && !p.assigned_editor_id).length;

        return {
          id: clientProfile.id,
          name: `${clientProfile.first_name} ${clientProfile.last_name || ''}`.trim(),
          contact_email: clientProfile.email, // Assuming email is available in profile
          contact_phone: clientProfile.contact_phone,
          monthly_credits: clientProfile.monthly_credits,
          credits_remaining: clientProfile.credits_remaining,
          status: clientProfile.status,
          assigned_manager_id: clientProfile.assigned_manager_id,
          joinDate: clientProfile.join_date,
          lastActive: clientProfile.last_active,
          activeProjects,
          unassignedTasks,
        } as Client;
      }));
      setClients(clientsWithMetrics);
    }
    setIsLoadingClients(false);
  }, []);

  const fetchManagers = useCallback(async () => {
    setIsLoadingManagers(true);
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, role')
      .eq('role', 'manager');

    if (profilesError) {
      console.error("Error fetching managers' profiles:", profilesError);
      showError("Failed to load managers' profiles.");
      setManagers([]);
    } else {
      const managersWithLoad = await Promise.all(profilesData.map(async (profile) => {
        const { count, error: countError } = await supabase
          .from('profiles') // Count clients from profiles table
          .select('id', { count: 'exact' })
          .eq('assigned_manager_id', profile.id)
          .eq('role', 'client'); // Ensure we only count clients

        if (countError) {
          console.error(`Error counting clients for manager ${profile.id}:`, countError);
          return {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
            clientLoad: 0,
          };
        }

        return {
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
          avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
          clientLoad: count || 0,
        };
      }));
      setManagers(managersWithLoad);
    }
    setIsLoadingManagers(false);
  }, []);

  useEffect(() => {
    fetchClients();
    fetchManagers();
  }, [fetchClients, fetchManagers]);

  const handleCreateUser = async (firstName: string, email: string, password: string, role: string) => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: '', // Assuming last name is optional or handled by trigger
            role: role, // Pass the selected role
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User not created during signup.");
      }

      // The handle_new_user trigger should automatically create the profile with the correct role.
      // If the role is 'client', we also need to insert into the 'clients' table (which is now part of profiles)
      // The trigger already handles setting default monthly_credits, credits_remaining, status for clients.
      // No separate 'clients' table insertion is needed anymore.

      showSuccess(`User "${firstName}" (${role}) created successfully! An email has been sent to ${email} for verification.`);
      fetchClients(); // Refresh client list (if a client was created)
      fetchManagers(); // Refresh manager client loads (if a manager was created or assigned)
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      showError(`Failed to create user: ${error.message}`);
      throw error; // Re-throw to be caught by the dialog's error handling
    }
  };

  const handleAssignManager = async (clientId: string, managerId: string) => {
    try {
      const { error } = await supabase
        .from('profiles') // Update the profiles table
        .update({ assigned_manager_id: managerId })
        .eq('id', clientId);

      if (error) {
        throw error;
      }

      const managerName = managers.find(m => m.id === managerId)?.name || "an unknown manager";
      showSuccess(`Client assigned to ${managerName}.`);
      fetchClients(); // Refresh client list to update manager assignments
      fetchManagers(); // Refresh manager client loads
    } catch (error: any) {
      console.error("Error assigning manager:", error.message);
      showError(`Failed to assign manager: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName="Yadish" />
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 px-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tighter flex items-center gap-3">
                <Badge variant="default" className="bg-logo-red text-white text-sm px-3 py-1">Client Assigner</Badge>
                User Management
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Oversee all users and assign clients to managers.
              </p>
            </div>
            <CreateUserDialog onCreateUser={handleCreateUser}> {/* Updated component name */}
              <Button className="h-10 px-5">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New User
              </Button>
            </CreateUserDialog>
          </div>

          {/* Client List */}
          <div className="space-y-4 px-4">
            <h3 className="text-2xl font-semibold mb-4">Active Clients</h3>
            {isLoadingClients ? (
              <p className="text-center text-muted-foreground py-8">Loading clients...</p>
            ) : clients.length > 0 ? (
              clients.map(client => {
                const assignedManager = client.assigned_manager_id
                  ? managers.find(m => m.id === client.assigned_manager_id)
                  : undefined;
                return (
                  <Card key={client.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-xl font-bold text-primary">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">Status: {client.status}</p>
                        <p className="text-sm text-muted-foreground">Projects: {client.activeProjects}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {assignedManager ? (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Assigned to: {assignedManager.name}</span>
                          </div>
                        ) : (
                          <Badge variant="destructive">Unassigned Manager</Badge>
                        )}
                        <AssignManagerDialog
                          clientId={client.id}
                          currentManagerId={client.assigned_manager_id}
                          onAssign={handleAssignManager}
                        >
                          <Button variant="outline" size="sm">
                            <Briefcase className="h-4 w-4 mr-2" /> {client.assigned_manager_id ? "Reassign Manager" : "Assign Manager"}
                          </Button>
                        </AssignManagerDialog>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No clients found. Create a new user with 'client' role to get started!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientAssignerDashboardPage;