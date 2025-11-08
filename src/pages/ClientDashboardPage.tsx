"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { VideoTrackingCard, Video } from "@/components/VideoTrackingCard"; // Import Video interface
import { KanbanBoard } from "@/components/KanbanBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showSuccess } from "@/utils/toast";

// The Video interface is now imported from VideoTrackingCard.tsx

const mockVideos: Video[] = [
  {
    id: "v1",
    title: "Q3 Product Launch Ad",
    description: "Promotional video for the Q3 product launch.",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOnXkN9U0vyMwqiACQTcSDpB98U8jnV1S8aq8UabdfPE-GMTWycc5-7aT_2uuYRyw1okkrq4qqsQP115HSLy-hpoVQi3cerRG7pL4Bl_p6Yh2mYZVhQgtuHzIvbkoP2dUXCRcqnAoSX5s48k_Bm1Bz5lM3SYjTGzhJ9bsbBiM-dY3Klfwa1Q1zG1byZeSlJ1-19wLXlJ7tymkeg5E80rlf4Uz_DQ1a_0Prkd2zipgBjOuHv2ICt87jSglu1VSxAvv499SLrq7pzHXv",
    currentStatus: "Scripting",
    updates: [
      { timestamp: "2024-10-20 10:00 AM", message: "Video request submitted.", status: "pending" },
      { timestamp: "2024-10-21 02:30 PM", message: "Scripting started.", status: "in-progress" },
      { timestamp: "2024-10-23 09:00 AM", message: "Script sent for client review.", status: "review" },
    ],
    notes: ["Please ensure the new logo is prominently featured."],
    assignedEditorId: "editor1",
    internalNotes: ["Editor needs to prioritize this, client is high value."],
  },
  {
    id: "v2",
    title: "New Website Explainer",
    description: "An animated video explaining the features of the new website.",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIu0iAYDEOt7Y6XnCxUMYQAmKK4YRVUOHZQmqyRdNWL9Or1jEqS8f3E-ClCdU9-2B1eKkGQtrnmvLhmDVsj1w4YlYAuz1cpFBzHENbGBDQ0g5fEpA1htERd989G0-12xg5yu8TGdfMB-nMl_sWXvOHVkokBZZanMLplppk8b5NBINz5lzx5TPPbykJZfC1Az42VOeiAAXZFOErB4rsARJX4yZ9UZUVkVxBABpJx8Xjt92TOJo4GRllUS_L7oZoVAIYyUyG6lJYstrM",
    currentStatus: "Editing",
    updates: [
      { timestamp: "2024-10-15 11:00 AM", message: "Video concept approved.", status: "completed" },
      { timestamp: "2024-10-16 01:00 PM", message: "Initial animation draft completed.", status: "in-progress" },
      { timestamp: "2024-10-24 04:00 PM", message: "First editing pass complete.", status: "in-progress" },
    ],
    notes: [],
    assignedEditorId: "editor2",
    internalNotes: ["Waiting for client assets."],
  },
  {
    id: "v3",
    title: "Annual Conference Opener",
    description: "Opening video for the annual company conference.",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AMy5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
    currentStatus: "Awaiting Feedback",
    updates: [
      { timestamp: "2024-10-10 09:00 AM", message: "Project initiated.", status: "pending" },
      { timestamp: "2024-10-12 03:00 PM", message: "Draft sent for review.", status: "review" },
      { timestamp: "2024-10-24 06:00 PM", message: "Client feedback requested.", status: "feedback" },
    ],
    notes: ["Looks good, just need to adjust the music volume in the intro."],
    assignedEditorId: "editor1",
    internalNotes: ["Follow up with client for feedback by EOD."],
  },
  {
    id: "v4",
    title: "Employee Training Series",
    description: "Series of videos for new employee onboarding.",
    thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxmnYdQIObb4QKkEZsoehB_hG4KfblP2-u8XmVDmgyQQPd9XpFRcCGZSLAYMVIyuWkF7kzw6_jBM4KsjVFV9AoU6gbWt78A9hbmcQMMWNxLBQvGCX2NJf_4RSYwmSOMtIZow_3MfU3QJng_mAFw9h4utGDH7l07EL2Y_8vOqNxnUD5cFLdcY2ho3hCHtG-VbY284bKiSea6t8InHj0Nyrma76JB0wNTSsbyekKAF5WCS7wllj-mmPOpOTFHIrlE59TBLbJH7kt5Z6p",
    currentStatus: "Completed",
    updates: [
      { timestamp: "2024-09-20 09:00 AM", message: "Project started.", status: "pending" },
      { timestamp: "2024-09-25 02:00 PM", message: "All videos filmed.", status: "in-progress" },
      { timestamp: "2024-09-30 11:00 AM", message: "Final edits approved.", status: "completed" },
      { timestamp: "2024-10-01 10:00 AM", message: "Project delivered.", status: "completed" },
    ],
    notes: [],
    assignedEditorId: "editor3",
    internalNotes: ["Archived project."],
  },
];

const ClientDashboardPage = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [creditsUsed, setCreditsUsed] = useState(7); // Mock data for credits
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban"); // Default to Kanban

  const handleRequestNewVideo = () => {
    showSuccess("New video request initiated (form/modal needed).");
    console.log("Simulating new video request...");
    const newVideo: Video = {
      id: `v${videos.length + 1}`,
      title: "New Project Request",
      description: "Awaiting details from client.",
      thumbnailUrl: "https://via.placeholder.com/150/cccccc/ffffff?text=New+Video",
      currentStatus: "Requested",
      updates: [{ timestamp: new Date().toLocaleString(), message: "New video request submitted by client.", status: "pending" }],
      notes: [],
      internalNotes: ["New request, needs assignment."],
    };
    setVideos([newVideo, ...videos]);
    setCreditsUsed(creditsUsed + 1);
  };

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
                  <CardTitle className="text-lg font-semibold">Credits Used This Month</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-3xl font-bold text-primary">{creditsUsed} / 10</p>
                </CardContent>
              </Card>
              <Button onClick={handleRequestNewVideo} className="h-10 px-5">
                <PlusCircle className="h-4 w-4 mr-2" /> Request New Video
              </Button>
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