"use client";

import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, MessageSquareText, PlusCircle, CheckCircle, Clock, Loader, AlertCircle } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { LiveCountdown } from "@/components/LiveCountdown";
import { RequestChangesDialog } from "@/components/RequestChangesDialog";
import { ChatModal } from "@/components/ChatModal";

interface VideoUpdate {
  timestamp: string;
  message: string;
  status: "pending" | "in-progress" | "completed" | "review" | "feedback";
}

export interface Video { // Exported for reuse
  id: string;
  client_id: string; // Foreign key to clients table
  manager_id?: string; // New: ID of the assigned manager
  editor_id?: string; // New: ID of the assigned editor
  title: string;
  description?: string;
  raw_files_link?: string;
  instructions_link?: string;
  current_status: string;
  credits_cost: number;
  priority: string;
  submission_timestamp: string;
  initial_deadline_timestamp: string;
  adjusted_deadline_timestamp?: string;
  delivery_timestamp?: string; // Added for countdown
  draft_link?: string;
  final_delivery_link?: string;
  thumbnail_url?: string;
  updates: VideoUpdate[];
  satisfactionRating?: number;
  projectType?: string;
  notes: string[]; // Client-facing notes (will be replaced by chat_messages)
  internalNotes?: string[]; // Internal team notes (will be replaced by chat_messages with is_internal_only)
}

interface VideoTrackingCardProps {
  video: Video;
  onUpdateVideo?: (videoId: string, updates: Partial<Video>) => Promise<void>; // New prop for updating video
}

const getStatusIcon = (status: VideoUpdate['status']) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
    case "review":
    case "feedback":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "pending":
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "default"; // Use default and apply custom class for success color
    case "in-progress":
    case "editing":
    case "animation":
    case "requested":
    case "scripting":
    case "assigned":
      return "secondary";
    case "awaiting feedback":
    case "review":
    case "feedback":
    case "need changes":
      return "primary";
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

export const VideoTrackingCard: React.FC<VideoTrackingCardProps> = ({ video, onUpdateVideo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (!onUpdateVideo) return;
    setIsApproving(true);
    try {
      await onUpdateVideo(video.id, {
        current_status: 'Approved',
        delivery_timestamp: new Date().toISOString(),
      });
      showSuccess(`Video "${video.title}" approved!`);
    } catch (error) {
      console.error("Error approving video:", error);
      showError("Failed to approve video. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRequestChanges = async (feedback: string) => {
    if (!onUpdateVideo) return;
    try {
      // Instead of adding to video.notes, we'll send this as a chat message
      // This requires the ChatModal to have an external send message function or similar
      // For now, we'll just update the status and show a success message.
      await onUpdateVideo(video.id, {
        current_status: 'Need Changes',
      });
      // Ideally, here you'd also send a chat message with the feedback
      showSuccess(`Changes requested for "${video.title}". Feedback: "${feedback}"`);
    } catch (error) {
      console.error("Error requesting changes:", error);
      showError("Failed to request changes. Please try again.");
    }
  };

  const deadlineToUse = video.adjusted_deadline_timestamp || video.initial_deadline_timestamp;

  const isClientReviewMode = video.current_status.toLowerCase() === 'review'; // Client can only approve/request changes if in 'review' status

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="w-full shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <div className="flex items-center space-x-4">
            <img src={video.thumbnail_url} alt={video.title} className="h-16 w-16 rounded-md object-cover" />
            <div>
              <CardTitle className="text-lg font-semibold">{video.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{video.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge
              variant={getStatusBadgeVariant(video.current_status)}
              className={video.current_status.toLowerCase() === 'completed' || video.current_status.toLowerCase() === 'approved' ? 'bg-success text-success-foreground' : ''}
            >
              {video.current_status}
            </Badge>
            {deadlineToUse && (
              <LiveCountdown
                deadlineTimestamp={deadlineToUse}
                currentStatus={video.current_status}
                deliveryTimestamp={video.delivery_timestamp}
                className="text-sm"
              />
            )}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent className="space-y-4 p-4 border-t border-border">
          {/* Client Approval/Request Changes Buttons */}
          {isClientReviewMode && (
            <div className="flex justify-end space-x-2 mb-4">
              <RequestChangesDialog onSave={handleRequestChanges}>
                <Button variant="outline" disabled={isApproving}>Request Changes</Button>
              </RequestChangesDialog>
              <Button onClick={handleApprove} disabled={isApproving}>
                {isApproving ? "Approving..." : "Approve Video"}
              </Button>
            </div>
          )}

          {/* Chat Button */}
          <div className="flex justify-end mb-4">
            <ChatModal projectId={video.id} projectName={video.title}>
              <Button variant="outline" size="sm">
                <MessageSquareText className="h-4 w-4 mr-2" /> Open Chat
              </Button>
            </ChatModal>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Project Timeline</h3>
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
              {video.updates.length > 0 ? (
                video.updates.map((update, index) => (
                  <div key={index} className="relative mb-4 last:mb-0">
                    <div className="absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-background z-10">
                      {getStatusIcon(update.status)}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{update.message}</p>
                      <p className="text-xs text-muted-foreground">{update.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};