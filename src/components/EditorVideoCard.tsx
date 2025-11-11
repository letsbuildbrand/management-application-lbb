"use client";

import React, { useState } from "react";
import { VideoTrackingCard, Video } from "@/components/VideoTrackingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader, AlertCircle, Clock, Link as LinkIcon, Save } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface EditorVideoCardProps {
  video: Video;
  onUpdateVideo: (videoId: string, updates: Partial<Video>) => void;
}

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
    case "assigned":
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

export const EditorVideoCard: React.FC<EditorVideoCardProps> = ({ video, onUpdateVideo }) => {
  const [newDraftLink, setNewDraftLink] = useState(video.draft_link || "");
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    await onUpdateVideo(video.id, {
      current_status: newStatus,
      // updates: [...(video.updates || []), { // Assuming updates are handled by backend or a separate table
      //   timestamp: new Date().toISOString(),
      //   message: `Status changed to: ${newStatus} by editor.`,
      //   status: newStatus.toLowerCase() as any,
      // }],
    });
    showSuccess(`Status for "${video.title}" updated to ${newStatus}.`);
  };

  const handleSaveDraftLink = async () => {
    if (!newDraftLink.trim()) {
      showError("Please enter a valid draft link.");
      return;
    }
    setIsSavingDraft(true);
    try {
      await onUpdateVideo(video.id, { draft_link: newDraftLink.trim() });
      showSuccess(`Draft link for "${video.title}" saved successfully!`);
    } catch (error) {
      console.error("Error saving draft link:", error);
      showError("Failed to save draft link.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const availableStatuses = [
    "Assigned", "Scripting", "In Progress", "Editing", "Animation",
    "Review", "Awaiting Feedback", "Feedback", "Completed", "Approved"
  ];

  return (
    <div className="relative group">
      <VideoTrackingCard video={video} />
      <div className="absolute top-2 right-2 flex items-center space-x-2 bg-card p-2 rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
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

        {/* Draft Submission */}
        <div className="flex items-center space-x-2">
          <Label htmlFor={`draft-link-${video.id}`} className="sr-only">Draft Link</Label>
          <Input
            id={`draft-link-${video.id}`}
            placeholder="Draft Link"
            value={newDraftLink}
            onChange={(e) => setNewDraftLink(e.target.value)}
            className="w-[200px] h-8"
            disabled={isSavingDraft}
          />
          <Button onClick={handleSaveDraftLink} size="sm" className="h-8" disabled={isSavingDraft}>
            {isSavingDraft ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="sr-only">Save Draft Link</span>
          </Button>
          {video.draft_link && (
            <Button variant="outline" size="sm" className="h-8" asChild>
              <a href={video.draft_link} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="h-4 w-4 mr-2" /> View Draft
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};