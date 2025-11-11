"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Client } from "@/data/mockData"; // Import Client interface
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { useSession } from "@/components/SessionContextProvider"; // Import useSession
import { showError } from "@/utils/toast";

const ManagerDashboardPage = () => {
  const { user, isLoading: isSessionLoading, profile } = useSession();
  const [clients, setClients] = useState<Client[]>([]);
  const [totalActiveProjects, setTotalActiveProjects] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [projectsInReview, setProjectsInReview] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchManagerData = useCallback(async () => {
    if (!user || !profile || profile.role !== 'manager') {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      // Fetch clients assigned to this manager
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('assigned_manager_id', user.id);

      if (clientsError) {
        console.error("Error fetching clients for manager:", clientsError);
        setClients([]);
        return;
      }

      let activeProjectsCount = 0;
      let pendingAssignmentsCount = 0;
      let projectsInReviewCount = 0;

      const clientsWithMetrics = await Promise.all(clientsData.map(async (client) => {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, current_status, editor_id') // Changed assigned_editor_id to editor_id
          .eq('client_id', client.id)
          .eq('manager_id', user.id); // Ensure manager can only see projects they manage for this client

        if (projectsError) {
          console.error(`Error fetching projects for client ${client.id}:`, projectsError);
          return { ...client, activeProjects: 0, unassignedTasks: 0 };
        }

        const activeProjects = projectsData.filter(p => p.current_status !== 'Completed' && p.current_status !== 'Approved').length;
        const unassignedTasks = projectsData.filter(p => p.current_status === 'Requested' && !p.editor_id).length; // Changed assigned_editor_id to editor_id
        const reviewProjects = projectsData.filter(p => p.current_status === 'Review' || p.current_status === 'Awaiting Feedback').length;

        activeProjectsCount += activeProjects;
        pendingAssignmentsCount += unassignedTasks;
        projectsInReviewCount += reviewProjects;

        return { ...client, activeProjects, unassignedTasks };
      }));

      setClients(clientsWithMetrics as Client[]);
      setTotalActiveProjects(activeProjectsCount);
      setPendingAssignments(pendingAssignmentsCount);
      setProjectsInReview(projectsInReviewCount);

    } catch (error) {
      console.error("Unexpected error fetching manager dashboard data:", error);
      showError("An unexpected error occurred.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user, profile]);

  useEffect(() => {
    if (!isSessionLoading && user && profile?.role === 'manager') {
      fetchManagerData();
    }
  }, [isSessionLoading, user, profile, fetchManagerData]);

  if (isSessionLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading manager dashboard...</p>
      </div>
    );
  }

  if (!user || profile?.role !== 'manager') {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Access Denied: You must be logged in as a manager to view this dashboard.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName={profile?.first_name || "Manager"} />
          <h2 className="text-3xl font-bold tracking-tight mb-8 text-left px-4">Manager's Command Center</h2>

          {/* Header KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-4">
            <Card className="p-4">
              <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Total Active Projects</CardTitle>
                <LayoutGrid className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-4xl font-bold text-primary">{totalActiveProjects}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Pending Assignments</CardTitle>
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-4xl font-bold text-destructive">{pendingAssignments}</p>
              </CardContent>
            </Card>
            <Card className="p-4">
              <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg font-semibold">Projects in Review</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-4xl font-bold text-accent">{projectsInReview}</p>
              </CardContent>
            </Card>
          </div>

          {/* Client List */}
          <div className="space-y-4 px-4">
            <h3 className="text-2xl font-semibold mb-4">Client Portfolio</h3>
            {clients.length > 0 ? (
              clients.map(client => (
                <Card key={client.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Link to={`/manager/client/${client.id}`} className="text-xl font-bold text-primary hover:underline">
                        {client.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{client.status}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        {client.activeProjects} Active Projects
                      </Badge>
                      {client.unassignedTasks && client.unassignedTasks > 0 && (
                        <Badge variant="destructive">
                          {client.unassignedTasks} Unassigned Tasks
                        </Badge>
                      )}
                      <Link to={`/manager/client/${client.id}`}>
                        <ArrowRight className="h-5 w-5 text-muted-foreground hover:text-primary" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No clients assigned to you yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboardPage;