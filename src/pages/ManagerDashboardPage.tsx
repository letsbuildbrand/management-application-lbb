"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Video } from "@/components/VideoTrackingCard"; // Import Video interface

// Mock data for clients and their videos (re-using from ManagerClientDetailViewPage for consistency)
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
  {
    id: "client3",
    name: "Global Solutions",
    activeProjects: 1,
    unassignedTasks: 0,
    status: "On Hold",
    videos: [
      {
        id: "v6",
        title: "Company Culture Video",
        description: "Video showcasing the company culture.",
        thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AMy5iDvB-IMFopD_OPL4shGC02cE4Zu41p",
        currentStatus: "Completed",
        updates: [
          { timestamp: "2024-08-01 09:00 AM", message: "Project started.", status: "pending" },
          { timestamp: "2024-08-15 02:00 PM", message: "Final delivery.", status: "completed" },
        ],
        notes: [],
        assignedEditorId: "editor2",
        internalNotes: ["Client paused new projects."],
      },
    ],
  },
];

const ManagerDashboardPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [totalActiveProjects, setTotalActiveProjects] = useState(0);
  const [pendingAssignments, setPendingAssignments] = useState(0);
  const [projectsInReview, setProjectsInReview] = useState(0);

  useEffect(() => {
    let activeProjectsCount = 0;
    let pendingAssignmentsCount = 0;
    let projectsInReviewCount = 0;

    clients.forEach(client => {
      activeProjectsCount += client.videos.filter(video => video.currentStatus !== "Completed" && video.currentStatus !== "Approved").length;
      pendingAssignmentsCount += client.videos.filter(video => video.currentStatus === "Requested" && !video.assignedEditorId).length;
      projectsInReviewCount += client.videos.filter(video => video.currentStatus === "Review" || video.currentStatus === "Awaiting Feedback").length;
    });

    setTotalActiveProjects(activeProjectsCount);
    setPendingAssignments(pendingAssignmentsCount);
    setProjectsInReview(projectsInReviewCount);
  }, [clients]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName="Yadish" />
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
            {clients.map(client => (
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
                    {client.unassignedTasks > 0 && (
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboardPage;