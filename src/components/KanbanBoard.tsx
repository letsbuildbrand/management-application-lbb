"use client";

import React from "react";
import { VideoTrackingCard } from "@/components/VideoTrackingCard";
import { Badge } from "@/components/ui/badge";

interface VideoUpdate {
  timestamp: string;
  message: string;
  status: "pending" | "in-progress" | "completed" | "review" | "feedback";
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  currentStatus: string;
  updates: VideoUpdate[];
  notes: string[];
}

interface KanbanBoardProps {
  videos: Video[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "approved":
      return "success";
    case "in-progress":
    case "editing":
    case "animation":
      return "secondary";
    case "awaiting feedback":
    case "review":
    case "feedback":
      return "primary";
    case "scripting":
    case "requested":
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ videos }) => {
  const columns = [
    { id: "requested", title: "Requested", statuses: ["requested"] },
    { id: "scripting", title: "Scripting", statuses: ["scripting"] },
    { id: "in-progress", title: "In Progress", statuses: ["in-progress", "editing", "animation"] },
    { id: "review", title: "Under Review", statuses: ["review", "awaiting feedback"] },
    { id: "feedback", title: "Need Changes", statuses: ["feedback"] },
    { id: "completed", title: "Completed", statuses: ["completed", "approved"] },
  ];

  const groupedVideos = columns.map(column => ({
    ...column,
    videos: videos.filter(video => column.statuses.includes(video.currentStatus.toLowerCase())),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {groupedVideos.map(column => (
        <div key={column.id} className="flex flex-col bg-card rounded-xl p-4 space-y-4 h-fit min-w-[280px]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              {column.title}
            </h2>
            <Badge variant={getStatusBadgeVariant(column.id)} className="text-sm font-medium">
              {column.videos.length}
            </Badge>
          </div>
          <div className="space-y-4">
            {column.videos.length > 0 ? (
              column.videos.map(video => (
                <VideoTrackingCard key={video.id} video={video} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No videos in this column.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};