"use client";

import React, { useState } from "react";
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
import { AssignEditorDialog, Editor, mockEditors } from "@/components/AssignEditorDialog";
import { MoreVertical, User, Edit, CheckCircle, Loader, AlertCircle, Clock } from "lucide-react";
import { showSuccess } from "@/utils/toast";

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
  const assignedEditor = video.assignedEditorId ? mockEditors.find(e => e.id === video.assignedEditorId) : undefined;

  const handleAssignEditor = (editorId: string) => {
    onUpdateVideo(video.id, { assignedEditorId: editorId, currentStatus: "Assigned" });
    showSuccess(`Project ${video.title} assigned to ${mockEditors.find(e => e.id === editorId)?.name || 'an editor'}.`);
  };

  const handleStatusChange = (newStatus: string) => {
    onUpdateVideo(video.id, {
      currentStatus: newStatus,
      updates: [...(video.updates || []), {
        timestamp: new Date().toLocaleString(),
        message: `Status manually changed to: ${newStatus} by manager.`,
        status: newStatus.toLowerCase() as any, // Cast to valid status type
      }],
    });
    showSuccess(`Status for ${video.title} updated to ${newStatus}.`);
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
        {video.currentStatus.toLowerCase() === "requested" || !video.assignedEditorId ? (
          <AssignEditorDialog onAssign={handleAssignEditor}>
            <Button variant="default" size="sm" className="h-8">
              <User className="h-4 w-4 mr-2" /> Assign Editor
            </Button>
          </AssignEditorDialog>
        ) : (
          <>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{assignedEditor?.name || "Unassigned"}</span>
            </div>
            <AssignEditorDialog currentEditorId={video.assignedEditorId} onAssign={handleAssignEditor}>
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-4 w-4 mr-2" /> Reassign
              </Button>
            </AssignEditorDialog>
          </>
        )}

        <Select onValueChange={handleStatusChange} value={video.currentStatus}>
          <SelectTrigger className="w-[180px] h-8">
            <span className="flex items-center gap-2">
              {getStatusIcon(video.currentStatus)}
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
      </div>
    </div>
  );
};