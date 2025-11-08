import React, { useState } from "react";
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
  CheckCircle2,
  AlertTriangle,
  Menu as MenuIcon, // Renamed to avoid conflict with react-pro-sidebar's Menu
} from "lucide-react";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; // Import react-pro-sidebar components

const VideoEditorDashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SideNavBar */}
      <Sidebar
        collapsed={collapsed}
        width="256px"
        collapsedWidth="80px"
        rootStyles={{
          backgroundColor: 'hsl(var(--sidebar-DEFAULT))',
          color: 'hsl(var(--sidebar-foreground))',
          borderRight: '1px solid hsl(var(--border))',
          transition: 'width 0.3s ease-in-out',
          flexShrink: 0, // Prevent sidebar from shrinking
        }}
        className="h-screen"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-4">
            {!collapsed && (
              <>
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
              </>
            )}
            <Button variant="ghost" size="icon" onClick={toggleCollapsed} className={collapsed ? "mx-auto" : ""}>
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>

          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled, hover }) => {
                return {
                  backgroundColor: active ? 'hsl(var(--sidebar-primary))' : undefined,
                  color: active ? 'hsl(var(--sidebar-primary-foreground))' : undefined,
                  '&:hover': {
                    backgroundColor: 'hsl(var(--sidebar-primary) / 0.6)',
                    color: 'hsl(var(--sidebar-primary-foreground))',
                  },
                };
              },
            }}
          >
            <MenuItem icon={<LayoutDashboard className="h-5 w-5" />} component={<Link to="#" />}> Dashboard </MenuItem>
            <MenuItem icon={<Folder className="h-5 w-5" />} component={<Link to="#" />}> Projects </MenuItem>
            <MenuItem icon={<CalendarDays className="h-5 w-5" />} component={<Link to="#" />}> Calendar </MenuItem>
            <MenuItem icon={<Users className="h-5 w-5" />} component={<Link to="#" />}> Clients </MenuItem>
          </Menu>

          <div className="mt-auto flex flex-col gap-4">
            {!collapsed && <Button className="w-full">New Project</Button>}
            <Menu
              menuItemStyles={{
                button: ({ level, active, disabled, hover }) => {
                  return {
                    backgroundColor: active ? 'hsl(var(--sidebar-primary))' : undefined,
                    color: active ? 'hsl(var(--sidebar-primary-foreground))' : undefined,
                    '&:hover': {
                      backgroundColor: 'hsl(var(--sidebar-primary) / 0.6)',
                      color: 'hsl(var(--sidebar-primary-foreground))',
                    },
                  };
                },
              }}
            >
              <MenuItem icon={<Settings className="h-5 w-5" />} component={<Link to="#" />}> Settings </MenuItem>
              <MenuItem icon={<HelpCircle className="h-5 w-5" />} component={<Link to="#" />}> Help </MenuItem>
            </Menu>
          </div>
        </div>
      </Sidebar>
      {/* Main Content */}
      <main className={`flex-1 flex flex-col h-screen overflow-y-auto transition-all duration-300 ease-in-out ${collapsed ? 'ml-[80px]' : 'ml-[256px]'}`}>
        <div className="p-8">
          {/* PageHeading */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-4 min-w-72">
              <div className="flex flex-col">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-foreground">
                  Project Dashboard
                </h1>
                <p className="mt-1 text-base font-normal leading-normal text-muted-foreground">
                  Manage your video editing workflow.
                </p>
              </div>
            </div>
          </div>
          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
            {/* New Column: Need changes */}
            <div className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Need changes
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  1
                </span>
              </div>
              {/* Card 7 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-destructive/20 text-destructive">
                    Urgent
                  </Badge>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Client Feedback Integration
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Global Solutions
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Due: Oct 26
                </p>
              </div>
            </div>
            {/* New Column: Completed */}
            <div className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  Completed
                </h2>
                <span className="text-sm font-medium text-muted-foreground">
                  2
                </span>
              </div>
              {/* Card 8 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-success/20 text-success">
                    Finished
                  </Badge>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Marketing Explainer Video
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Innovate Inc.
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Completed: Oct 20
                </p>
              </div>
              {/* Card 9 */}
              <div className="bg-popover p-4 rounded-lg border border-transparent hover:border-primary/50 cursor-grab">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-success/20 text-success">
                    Finished
                  </Badge>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <p className="text-lg font-bold leading-tight tracking-[-0.015em] text-foreground">
                  Company Holiday Greeting
                </p>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  Internal
                </p>
                <p className="mt-3 text-sm font-normal text-muted-foreground">
                  Completed: Oct 18
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