"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Menu as MenuIcon,
} from "lucide-react";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useSession } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/data/mockData";
import { EditorVideoCard } from "@/components/EditorVideoCard"; // Import EditorVideoCard
import { showSuccess, showError } from "@/utils/toast";
import { parseISO, isBefore } from "date-fns"; // For sorting

const VideoEditorDashboardPage = () => {
  const { user, isLoading: isSessionLoading, profile } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [assignedVideos, setAssignedVideos] = useState<Video[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const fetchAssignedVideos = useCallback(async () => {
    if (!user) {
      setIsLoadingVideos(false);
      return;
    }

    setIsLoadingVideos(true);
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('assigned_editor_id', user.id)
        .neq('current_status', 'Completed') // Exclude completed projects from active view
        .neq('current_status', 'Approved'); // Exclude approved projects from active view

      if (projectsError) {
        console.error("Error fetching assigned projects:", projectsError);
        showError("Failed to load your assigned projects.");
        setAssignedVideos([]);
        return;
      }

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
        updates: [], // Assuming updates are fetched separately or managed by backend
        notes: [], // Assuming notes are fetched separately or managed by backend
        internalNotes: [], // Assuming internal notes are fetched separately or managed by backend
        satisfactionRating: undefined, // Assuming satisfaction rating is fetched separately
        projectType: undefined, // Assuming project type is fetched separately
      }));

      // Sort by deadline (adjusted_deadline_timestamp first, then initial_deadline_timestamp)
      formattedVideos.sort((a, b) => {
        const deadlineA = parseISO(a.adjusted_deadline_timestamp || a.initial_deadline_timestamp);
        const deadlineB = parseISO(b.adjusted_deadline_timestamp || b.initial_deadline_timestamp);
        return isBefore(deadlineA, deadlineB) ? -1 : 1;
      });

      setAssignedVideos(formattedVideos);
    } catch (error) {
      console.error("Unexpected error fetching editor dashboard data:", error);
      showError("An unexpected error occurred.");
    } finally {
      setIsLoadingVideos(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isSessionLoading && user) {
      fetchAssignedVideos();
    }
  }, [isSessionLoading, user, fetchAssignedVideos]);

  const handleUpdateVideo = async (videoId: string, updates: Partial<Video>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', videoId);

      if (error) {
        throw error;
      }
      showSuccess("Project updated successfully!");
      fetchAssignedVideos(); // Re-fetch to ensure UI is up-to-date
    } catch (error: any) {
      console.error("Error updating video:", error.message);
      showError(`Failed to update project: ${error.message}`);
    }
  };

  if (isSessionLoading || isLoadingVideos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading editor dashboard...</p>
      </div>
    );
  }

  if (!user || profile?.role !== 'editor') {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8 mt-16">
          <p className="text-xl text-muted-foreground">Access Denied: You must be logged in as an editor to view this page.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* SideNavBar */}
      <Sidebar
        collapsed={collapsed}
        width="256px"
        collapsedWidth="80px"
        rootStyles={{
          backgroundColor: 'hsl(var(--sidebar-background))',
          color: 'hsl(var(--sidebar-foreground))',
          borderRight: '1px solid hsl(var(--border))',
          transition: 'width 0.3s ease-in-out',
          flexShrink: 0,
        }}
        className="h-screen"
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-4">
            {!collapsed && (
              <>
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name || 'Editor'}`}
                    alt={`User avatar for ${profile?.first_name || 'Editor'}`}
                  />
                  <AvatarFallback>{profile?.first_name?.[0] || 'E'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h1 className="text-base font-medium leading-normal text-sidebar-foreground">
                    {profile?.first_name || 'Editor'} {profile?.last_name || ''}
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
            <div className="flex flex-col">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-foreground">
                My Assigned Projects
              </h1>
              <p className="mt-1 text-base font-normal leading-normal text-muted-foreground">
                Your current video editing tasks, prioritized by deadline.
              </p>
            </div>
          </div>
          {/* Assigned Projects List */}
          <div className="space-y-6">
            {assignedVideos.length > 0 ? (
              assignedVideos.map((video) => (
                <EditorVideoCard key={video.id} video={video} onUpdateVideo={handleUpdateVideo} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No projects currently assigned to you.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoEditorDashboardPage;