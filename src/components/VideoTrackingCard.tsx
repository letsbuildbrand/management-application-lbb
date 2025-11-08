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
import { showSuccess } from "@/utils/toast";

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

interface VideoTrackingCardProps {
  video: Video;
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
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

export const VideoTrackingCard: React.FC<VideoTrackingCardProps> = ({ video }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [videoNotes, setVideoNotes] = useState(video.notes);

  const handleAddNote = () => {
    if (newNote.trim()) {
      setVideoNotes([...videoNotes, newNote.trim()]);
      setNewNote("");
      showSuccess("Note added successfully!");
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-4">
          <img src={video.thumbnailUrl} alt={video.title} className="h-16 w-16 rounded-md object-cover" />
          <div>
            <CardTitle className="text-lg font-semibold">{video.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{video.description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant={getStatusBadgeVariant(video.currentStatus)}>{video.currentStatus}</Badge>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle details</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </CardHeader>
      <CollapsibleContent className="space-y-4 p-4 border-t border-border">
        {/* Tracking Timeline */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold">Project Timeline</h3>
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
            {video.updates.map((update, index) => (
              <div key={index} className="relative mb-4 last:mb-0">
                <div className="absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-background z-10">
                  {getStatusIcon(update.status)}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">{update.message}</p>
                  <p className="text-xs text-muted-foreground">{update.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-3 pt-4">
          <h3 className="text-md font-semibold">Your Notes</h3>
          <div className="space-y-2">
            {videoNotes.length > 0 ? (
              videoNotes.map((note, index) => (
                <p key={index} className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                  <MessageSquareText className="inline h-4 w-4 mr-2 text-primary" />
                  {note}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No notes added yet.</p>
            )}
          </div>
          <div className="flex space-x-2">
            <Textarea
              placeholder="Add a new note for this video..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddNote} className="shrink-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Note
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Card>
  );
};