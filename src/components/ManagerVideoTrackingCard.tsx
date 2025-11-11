"use client";

import React, { useState, useEffect } from "react";
import { VideoTrackingCard, Video } from "@/components/VideoTrackingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssignEditorDialog } from "@/components/AssignEditorDialog";
import { ChangeDeadlineDialog } from "@/components/ChangeDeadlineDialog"; // Import ChangeDeadlineDialog
import { MoreVertical, User, Edit, CheckCircle, Loader, AlertCircle, Clock, CalendarDays } from "lucide-react"; // Added CalendarDays icon
import { showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

interface ManagerVideoTrackingCardProps {
  video: Video;
  onUpdateVideo: (videoId: string, updates: Partial<Video>) => void;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "success";
    case "in-progress":
    case "editing":
    case "animation":
    case "requested":
    case "scripting":
      return "secondary";
    case "awaiting feedback":
    case "review":
    case "feedback":
      return "primary";
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in-progress":
    case "editing":
    case "animation":
    case "scripting":
      return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
    case "review":
    case "awaiting feedback":
    case "feedback":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "pending":
    case "requested":
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export const ManagerVideoTrackingCard: React.FC<ManagerVideoTrackingCardProps> = ({ video, onUpdateVideo }) => {
  const [assignedEditorName, setAssignedEditorName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchEditorName = async () => {
      if (video.assigned_editor_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', video.assigned_editor_id)
          .single();

        if (error) {
          console.error("Error fetching editor name:", error);
          setAssignedEditorName("Unknown Editor");
        } else if (data) {
          setAssignedEditorName(`${data.first_name} ${data.last_name || ''}`.trim());
        }
      } else {
        setAssignedEditorName(undefined);
      }
    };

    fetchEditorName();
  }, [video.assigned_editor_id]);

  const handleAssignEditor = async (projectId: string, editorId: string) => {
    await onUpdateVideo(projectId, { assigned_editor_id: editorId, current_status: "Assigned" });
    const editorProfile = await supabase.from('profiles').select('first_name, last_name').eq('id', editorId).single();
    showSuccess(`Project ${video.title} assigned to ${editorProfile.data?.first_name || 'an editor'}.`);
  };

  const handleStatusChange = async (newStatus: string) => {
    await onUpdateVideo(video.id, {
      current_status: newStatus,
      // updates: [...(video.updates || []), { // Assuming updates are handled by backend or a separate table
      //   timestamp: new Date().toISOString(),
      //   message: `Status manually changed to: ${newStatus} by manager.`,
      //   status: newStatus.toLowerCase() as any,
      // }],
    });
    showSuccess(`Status for ${video.title} updated to ${newStatus}.`);
  };

  const handleDeadlineChange = async (newDeadline: string) => {
    await onUpdateVideo(video.id, { adjusted_deadline_timestamp: newDeadline });
    showSuccess(`Deadline for ${video.title} updated to ${new Date(newDeadline).toLocaleString()}.`);
  };

  const handleAddInternalNote = (videoId: string, note: string) => {
    onUpdateVideo(videoId, { internalNotes: [...(video.internalNotes || []), note] });
  };

  const availableStatuses = [
    "Requested", "Scripting", "In Progress", "Editing", "Animation",
    "Review", "Awaiting Feedback", "Feedback", "Completed", "Approved"
  ];

  return (
    <div className="relative group">
      <VideoTrackingCard
        video={video}
        showInternalNotes={true}
        onAddNote={handleAddInternalNote}
      />
      <div className="absolute top-2 right-2 flex items-center space-x-2 bg-card p-2 rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        {/* Editor Assignment */}
        {video.current_status.toLowerCase() === "requested" || !video.assigned_editor_id ? (
          <AssignEditorDialog projectId={video.id} onAssign={handleAssignEditor}>
            <Button variant="default" size="sm" className="h-8">
              <User className="h-4 w-4 mr-2" /> Assign Editor
            </Button>
          </AssignEditorDialog>
        ) : (
          <>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{assignedEditorName || "Unassigned"}</span>
            </div>
            <AssignEditorDialog projectId={video.id} currentEditorId={video.assigned_editor_id} onAssign={handleAssignEditor}>
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-4 w-4 mr-2" /> Reassign
              </Button>
            </AssignEditorDialog>
          </>
        )}

        {/* Status Change */}
        <Select onValueChange={handleStatusChange} value={video.current_status}>
          <SelectTrigger className="w-[180px] h-8">
            <span className="flex items-center gap-2">
              {getStatusIcon(video.current_status)}
              <SelectValue placeholder="Change Status" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {availableStatuses.map(status => (
              <SelectItem key={status} value={status}>
                <span className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  {status}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Deadline Management */}
        <ChangeDeadlineDialog
          currentDeadline={video.adjusted_deadline_timestamp || video.initial_deadline_timestamp}
          onSave={handleDeadlineChange}
        >
          <Button variant="outline" size="sm" className="h-8">
            <CalendarDays className="h-4 w-4 mr-2" /> Change Deadline
          </Button>
        </ChangeDeadlineDialog>
      </div>
    </div>
  );
};