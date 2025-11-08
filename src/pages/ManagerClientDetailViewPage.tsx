"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { ManagerVideoTrackingCard } from "@/components/ManagerVideoTrackingCard";
import { Video } from "@/components/VideoTrackingCard";
import { Badge } from "@/components/ui/badge";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";

// Mock data for clients and their videos
interface Client {
  id: string;
  name: string;
  activeProjects: number;
  unassignedTasks: number;
  status: "Active" | "On Hold" | "Archived";
  videos: Video[];
}

const mockClients: Client[] = [
  {
    id: "client1",
    name: "Nexus Corp",
    activeProjects: 3,
    unassignedTasks: 1,
    status: "Active",
    videos: [
      {
        id: "v1",
        title: "Q3 Brand Campaign Ad",
        description: "Promotional video for the Q3 product launch.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOnXkN9U0vyMwqiACQTcSDpB98U8jnV1S8aq8UabdfPE-GMTWycc5-7aT_2uuYRyw1okkrq4qqsQP115HSLy-hpoVQi3cerRG7pL4Bl_p6Yh2mYZVhQgtuHzIvbkoP2dUXCRcqnAoSX5s48k_Bm1Bz5lM3SYjTGzhJ9bsbBiM-dY3Klfwa1Q1zG1byZeSlJ1-19wLXlJ7tymkeg5E80rlf4Uz_DQ1a_0Prkd2zipgBjOuHv2ICt87jSglu1VSxAvv499SLrq7pzHXv",
        currentStatus: "Requested",
        updates: [
          { timestamp: "2024-10-20 10:00 AM", message: "Video request submitted.", status: "pending" },
        ],
        notes: ["Please ensure the new logo is prominently featured."],
        internalNotes: ["New request, needs assignment."],
      },
      {
        id: "v2",
        title: "Product Launch Video",
        description: "An animated video explaining the features of the new product.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIu0iAYDEOt7Y6XnCxUMYQAmKK4YRVUOHZQmqyRdNWL9Or1jEqS8f3E-ClCdU9-2B1eKkGQtrnmvLhmDVsj1w4YlYAuz1cpFBzHENbGBDQ0g5fEpA1htERd989G0-12xg5yu8TGdfMB-nMl_sWXvOHVkokBZZanMLplppk8b5NBINz5lzx5TPPbykJZfC1Az42VOeiAAXZFOErB4rsARJX4yZ9UZUVkVxBABpJx8Xjt92TOJo4GRllUS_L7oZoVAIYyUyG6lJYstrM",
        currentStatus: "Editing",
        updates: [
          { timestamp: "2024-10-15 11:00 AM", message: "Video concept approved.", status: "completed" },
          { timestamp: "2024-10-16 01:00 PM", message: "Initial animation draft completed.", status: "in-progress" },
        ],
        notes: [],
        assignedEditorId: "editor2",
        internalNotes: ["Waiting for client assets."],
      },
      {
        id: "v3",
        title: "Social Media Snippets",
        description: "Short videos for social media promotion.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AMy5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
        currentStatus: "Awaiting Feedback",
        updates: [
          { timestamp: "2024-10-10 09:00 AM", message: "Project initiated.", status: "pending" },
          { timestamp: "2024-10-12 03:00 PM", message: "Draft sent for review.", status: "review" },
        ],
        notes: ["Looks good, just need to adjust the music volume in the intro."],
        assignedEditorId: "editor1",
        internalNotes: ["Follow up with client for feedback by EOD."],
      },
    ],
  },
  {
    id: "client2",
    name: "Innovate Inc.",
    activeProjects: 2,
    unassignedTasks: 0,
    status: "Active",
    videos: [
      {
        id: "v4",
        title: "Company Overview",
        description: "A video introducing Innovate Inc. to new clients.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxmnYdQIObb4QKkEZsoehB_hG4KfblP2-u8XmVDmgyQQPd9XpFRcCGZSLAYMVIyuWkF7kzw6_jBM4KsjVFV9AoU6gbWt78A9hbmcQMMWNxLBQvGCX2NJf_4RSYwmSOMtIZow_3MfU3QJng_mAFw9h4utGDH7l07EL2Y_8vOqNxnUD5cFLdcY2ho3hCHtG-VbY284bKiSea6t8InHj0Nyrma76JB0wNTSsbyekKAF5WCS7wllj-mmPOpOTFHIrlE59TBLbJH7kt5Z6p",
        currentStatus: "Completed",
        updates: [
          { timestamp: "2024-09-20 09:00 AM", message: "Project started.", status: "pending" },
          { timestamp: "2024-09-25 02:00 PM", message: "All videos filmed.", status: "in-progress" },
        ],
        notes: [],
        assignedEditorId: "editor3",
        internalNotes: ["Archived project."],
      },
      {
        id: "v5",
        title: "Testimonial Compilation",
        description: "Compilation of client testimonials.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_s5y2ZtGyGGSskVMSsw_H6jcxMOQFEmR67ohyClIOqzEbZcXulmI25oBi5Kd_B7dRuFgbkoYUU-nyNi4QEVvVtXqiCizcRE-hT-344Y-HZ3N1jgTxzLcYWs-G6Y0fPl1u5DBNc-otBTdvZk9oW8NKe5ljJ2pI-HhEn65QkQpYJf2L7znT_soB4ksZ_gsC3PjFnn-kfkUuv2agH6IR5hyXp0VhcwukL45ORp3oUrNZZ1gkGx6GxNcwmGXMBWvCY-tEbSTKAsBZAeCB",
        currentStatus: "Editing",
        updates: [
          { timestamp: "2024-10-05 10:00 AM", message: "Footage collected.", status: "in-progress" },
          { timestamp: "2024-10-10 01:00 PM", message: "First cut complete.", status: "in-progress" },
        ],
        notes: ["Ensure smooth transitions between testimonials."],
        assignedEditorId: "editor1",
        internalNotes: ["Editor needs to focus on this next week."],
      },
    ],
  },
];

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