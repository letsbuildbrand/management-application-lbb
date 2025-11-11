"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { VideoTrackingCard, Video } from "@/components/VideoTrackingCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from "@/components/SessionContextProvider"; // Import useSession
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { RequestVideoDialog } from "@/components/RequestVideoDialog"; // Import RequestVideoDialog
import { Client } from "@/data/mockData"; // Import Client interface

const ClientDashboardPage = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [client, setClient] = useState<Client | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchClientData = useCallback(async () => {
    if (!user) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    try {
      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single();

      if (clientError) {
        console.error("Error fetching client data:", clientError);
        showError("Failed to load client data.");
        setClient(null);
      } else {
        setClient(clientData);
      }

      // Fetch client's projects (videos)
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .order('submission_timestamp', { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        showError("Failed to load your projects.");
        setVideos([]);
      } else {
        // Map Supabase project data to Video interface, adding default thumbnailUrl and notes
        const formattedVideos: Video[] = projectsData.map(project => ({
          id: project.id,
          client_id: project.client_id,
          assignedEditorId: project.assigned_editor_id || undefined,
          title: project.title,
          description: project.description || '',
          raw_files_link: project.raw_files_link || undefined,
          instructions_link: project.instructions_link || undefined,
          currentStatus: project.current_status,
          credits_cost: project.credits_cost,
          priority: project.priority,
          submission_timestamp: project.submission_timestamp,
          initial_deadline_timestamp: project.initial_deadline_timestamp,
          adjusted_deadline_timestamp: project.adjusted_deadline_timestamp || undefined,
          delivery_timestamp: project.delivery_timestamp || undefined,
          draft_link: project.draft_link || undefined,
          final_delivery_link: project.final_delivery_link || undefined,
          thumbnailUrl: project.thumbnailUrl || "https://via.placeholder.com/150/cccccc/ffffff?text=Video", // Placeholder
          updates: [], // This would typically be fetched from a separate 'project_updates' table
          notes: [], // This would typically be fetched from a separate 'chat_messages' or 'notes' table
          internalNotes: [], // Same as above
          satisfactionRating: undefined, // Same as above
          projectType: undefined, // Same as above
        }));
        setVideos(formattedVideos);
      }
    } catch (error) {
      console.error("Unexpected error fetching client dashboard data:", error);
      showError("An unexpected error occurred.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isSessionLoading && user) {
      fetchClientData();
    }
  }, [isSessionLoading, user, fetchClientData]);

  const handleRequestNewVideo = async (title: string, description: string) => {
    if (!user || !client) {
      showError("You must be logged in as a client to request a video.");
      throw new Error("User or client data not available.");
    }

    if (client.credits_remaining <= 0) {
      showError("You do not have enough credits to request a new video.");
      throw new Error("Insufficient credits.");
    }

    try {
      const now = new Date();
      const initialDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      const { data, error } = await supabase
        .from('projects')
        .insert({
          client_id: user.id,
          title: title,
          description: description,
          current_status: 'Requested',
          credits_cost: 1, // Assuming 1 credit per video request
          priority: 'Medium', // Default priority
          submission_timestamp: now.toISOString(),
          initial_deadline_timestamp: initialDeadline.toISOString(),
          adjusted_deadline_timestamp: initialDeadline.toISOString(), // Initially same as initial
          thumbnailUrl: "https://via.placeholder.com/150/cccccc/ffffff?text=New+Video", // Placeholder
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update client's credits_remaining
      const { error: creditError } = await supabase
        .from('clients')
        .update({ credits_remaining: client.credits_remaining - 1 })
        .eq('id', user.id);

      if (creditError) {
        console.error("Error updating client credits:", creditError);
        showError("Video requested, but failed to update credits.");
      } else {
        setClient(prevClient => prevClient ? { ...prevClient, credits_remaining: prevClient.credits_remaining - 1 } : null);
      }

      showSuccess("Your video request has been submitted!");
      fetchClientData(); // Refresh data to show new video and updated credits
    } catch (error: any) {
      console.error("Error submitting video request:", error.message);
      showError(`Failed to submit request: ${error.message}`);
      throw error;
    }
  };

  if (isSessionLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading client dashboard...</p>
      </div>
    );
  }

  if (!user || !client) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Please log in as a client to view this dashboard.</p>
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
              <h1 className="text-3xl font-black leading-tight tracking-tighter">
                Your Video Projects
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Track progress, add notes, and request new videos.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Card className="p-4">
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Credits Remaining</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-3xl font-bold text-primary">{client.credits_remaining} / {client.monthly_credits}</p>
                </CardContent>
              </Card>
              <RequestVideoDialog onRequestVideo={handleRequestNewVideo}>
                <Button className="h-10 px-5" disabled={client.credits_remaining <= 0}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Request New Video
                </Button>
              </RequestVideoDialog>
            </div>
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
                  <VideoTrackingCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboardPage;