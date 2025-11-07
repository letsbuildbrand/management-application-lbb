import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Folder,
  CalendarDays,
  Users,
  Settings,
  HelpCircle,
  Bell,
} from "lucide-react";

const VideoEditorDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SideNavBar */}
      <aside className="flex flex-col w-64 bg-sidebar-DEFAULT p-4 text-sidebar-foreground shrink-0">
        <div className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_s5y2ZtGyGGSskVMSsw_H6jcxMOQFEmR67ohyClIOqzEbZcXulmI25oBi5Kd_B7dRuFgbkoYUU-nyNi4QEVvVtXqiCizcRE-hT-344Y-HZ3N1jgTxzLcYWs-G6Y0fPl1u5DBNc-otBTdvZk9oW8NKe5ljJ2pI-HhEn65QkQpYJf2L7znT_soB4ksZ_gsC3PjFnn-kfkUuv2agH6IR5hyXp0VhcwukL45ORp3oUrNZZ1gkGx6GxNcwmGXMBWvCY-tEbSTKAsBZAeCB"
                  alt="User avatar for Alex Ray"
                />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-base font-medium leading-normal text-sidebar-foreground">
                  Alex Ray
                </h1>
                <p className="text-sm font-normal leading-normal text-muted-foreground">
                  Video Editor
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                to="#"
              >
                <LayoutDashboard className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/60"
                to="#"
              >
                <Folder className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Projects</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/60"
                to="#"
              >
                <CalendarDays className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Calendar</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/60"
                to="#"
              >
                <Users className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Clients</p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-4">
            <Button className="w-full">New Project</Button>
            <div className="flex flex-col gap-1">
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/60"
                to="#"
              >
                <Settings className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-primary/60"
                to="#"
              >
                <HelpCircle className="h-5 w-5" />
                <p className="text-sm font-medium leading-normal">Help</p>
              </Link>
            </div>
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8">
          {/* PageHeading */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex flex-col min-w-72">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-foreground">
                Project Dashboard
              </h1>
              <p className="mt-1 text-base font-normal leading-normal text-muted-foreground">
                Manage your video editing workflow.
              </p>
            </div>
          </div>
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column: To-Do */}
            <div className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  To-Do / Assigned to Me
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  3
                </span>
              </div>
              {/* Card 1 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-destructive/20 text-destructive">
                    High Priority
                  </Badge>
                  <Bell className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Q3 Brand Campaign Ad
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Nexus Corp
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Oct 28
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-accent/20 text-accent">
                    Medium Priority
                  </Badge>
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Product Launch Video
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Innovate Inc.
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Nov 05
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-success/20 text-success">
                    Low Priority
                  </Badge>
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Social Media Snippets
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  QuantumLeap
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Nov 12
                </p>
              </div>
            </div>
            {/* Column: In Progress */}
            <div className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  In Progress
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  2
                </span>
              </div>
              {/* Card 4 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-destructive/20 text-destructive">
                    High Priority
                  </Badge>
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Internal Training Series
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Stellar Solutions
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Oct 30
                </p>
              </div>
              {/* Card 5 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-success/20 text-success">
                    Low Priority
                  </Badge>
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  YouTube Channel Intro
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Creator Hub
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Nov 08
                </p>
              </div>
            </div>
            {/* Column: Under Review */}
            <div className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Under Review
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  1
                </span>
              </div>
              {/* Card 6 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-accent/20 text-accent">
                    Medium Priority
                  </Badge>
                  <Bell className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  "About Us" Company Video
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Apex Dynamics
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Oct 25
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoEditorDashboardPage;