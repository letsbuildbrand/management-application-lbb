"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ManagerVideoTrackingCard } from "@/components/ManagerVideoTrackingCard";
import { Video } from "@/components/VideoTrackingCard"; // Import Video from VideoTrackingCard
import { Client } from "@/data/mockData"; // Import Client interface
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";

const ManagerClientDetailViewPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { user, isLoading: isSessionLoading, profile } = useSession();
  const [client, setClient] = useState<Client | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchClientProjects = useCallback(async () => {
    if (!user || !profile || profile.role !== 'manager' || !clientId) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('assigned_manager_id', user.id)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        showError("Failed to load client data or you are not assigned to this client.");
        setClient(null);
        return;
      }
      setClient(clientData);

      // Fetch projects for this client, ensuring manager_id matches current user
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .eq('manager_id', user.id)
        .order('submission_timestamp', { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        showError("Failed to load client projects.");
        setVideos([]);
        return;
      }

      const formattedVideos: Video[] = projectsData.map(project => ({
        id: project.id,
        client_id: project.client_id,
        manager_id: project.manager_id || undefined,
        editor_id: project.editor_id || undefined,
        title: project.title,
        description: project.description || '',
        raw_files_link: project.raw_files_link || undefined,
        instructions_link: project.instructions_link || undefined,
        current_status: project.current_status,
        credits_cost: project.credits_cost,
        priority: project.priority,
        submission_timestamp: project.submission_timestamp,
        initial_deadline_timestamp: project.initial_deadline_timestamp,
        adjusted_deadline_timestamp: project.adjusted_deadline_timestamp || undefined,
        delivery_timestamp: project.delivery_timestamp || undefined,
        draft_link: project.draft_link || undefined,
        final_delivery_link: project.final_delivery_link || undefined,
        thumbnail_url: project.thumbnail_url || "https://via.placeholder.com/150/cccccc/ffffff?text=Video",
        updates: [], // Initialize updates as an empty array
        satisfactionRating: undefined,
        projectType: undefined,
        notes: [], // Initialize notes as an empty array
      }));
      setVideos(formattedVideos);

    } catch (error) {
      console.error("Unexpected error fetching client detail data:", error);
      showError("An unexpected error occurred.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user, profile, clientId]);

  useEffect(() => {
    if (!isSessionLoading && user && profile?.role === 'manager' && clientId) {
      fetchClientProjects();
    }
  }, [isSessionLoading, user, profile, clientId, fetchClientProjects]);

  const handleUpdateVideo = async (videoId: string, updates: Partial<Video>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', videoId)
        .eq('manager_id', user?.id);

      if (error) {
        throw error;
      }
      showSuccess("Project updated successfully!");
      fetchClientProjects();
    } catch (error: any) {
      console.error("Error updating video:", error.message);
      showError(`Failed to update project: ${error.message}`);
    }
  };

  if (isSessionLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading client details...</p>
      </div>
    );
  }

  if (!user || profile?.role !== 'manager' || !client) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Client not found or unauthorized access.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tighter flex items-center gap-3">
                <Badge variant="default" className="bg-logo-purple text-white text-sm px-3 py-1">Manager View</Badge>
                {client.name}'s Projects
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Oversee and manage all video projects for {client.name}.
              </p>
            </div>
            {/* Add any client-specific KPIs here if needed */}
          </div>

          <Tabs defaultValue="kanban" onValueChange={(value) => setViewMode(value as "kanban" | "list")} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban" className="mt-6">
              <KanbanBoard videos={videos} />
            </TabsContent>
            <TabsContent value="list" className="mt-6">
              <div className="space-y-6">
                {videos.map((video) => (
                  <ManagerVideoTrackingCard key={video.id} video={video} onUpdateVideo={handleUpdateVideo} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ManagerClientDetailViewPage;