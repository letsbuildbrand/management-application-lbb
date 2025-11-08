"use client";

import React from "react";
import { VideoTrackingCard, Video } from "@/components/VideoTrackingCard"; // Import Video interface
import { Badge } from "@/components/ui/badge";

// VideoUpdate and Video interfaces are now imported from VideoTrackingCard.tsx

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
    case "requested":
    case "scripting":
      return "secondary";
    case "awaiting feedback":
    case "review":
    case "feedback":
      return "primary";
    case "pending":
    default:
      return "default";
  }
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ videos }) => {
  const columns = [
    { id: "in-progress", title: "In Progress", statuses: ["requested", "scripting", "in-progress", "editing", "animation"] },
    { id: "need-approval", title: "Need Approval", statuses: ["review", "awaiting feedback", "feedback"] },
    { id: "completed", title: "Completed", statuses: ["completed", "approved"] },
  ];

  const groupedVideos = columns.map(column => ({
    ...column,
    videos: videos.filter(video => column.statuses.includes(video.currentStatus.toLowerCase())),
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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