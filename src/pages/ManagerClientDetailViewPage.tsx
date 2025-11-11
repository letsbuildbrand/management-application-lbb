"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ManagerVideoTrackingCard } from "@/components/ManagerVideoTrackingCard";
import { Video, Client, mockClients } from "@/data/mockData"; // Import Video, Client, mockClients from centralized mockData
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";

const ManagerClientDetailViewPage = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  useEffect(() => {
    const foundClient = mockClients.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
      setVideos(foundClient.videos);
    } else {
      // Handle client not found, e.g., redirect to 404 or manager dashboard
      console.error("Client not found!");
    }
  }, [clientId]);

  const handleUpdateVideo = (videoId: string, updates: Partial<Video>) => {
    setVideos(prevVideos =>
      prevVideos.map(video =>
        video.id === videoId ? { ...video, ...updates } : video
      )
    );
    // In a real app, you'd send this update to your backend
  };

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Loading client details or client not found...</p>
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
              <KanbanBoard videos={videos.map(video => ({ ...video, showInternalNotes: true }))} />
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