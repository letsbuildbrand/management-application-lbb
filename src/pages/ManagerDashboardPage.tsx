"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Video, Client, mockClients } from "@/data/mockData"; // Import Video, Client, mockClients from centralized mockData

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