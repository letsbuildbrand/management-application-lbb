"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError } from "@/utils/toast";

interface RequestVideoDialogProps {
  children: React.ReactNode;
  onRequestVideo: (title: string, description: string) => Promise<void>;
}

export const RequestVideoDialog: React.FC<RequestVideoDialogProps> = ({ children, onRequestVideo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showError("Please enter a video title.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onRequestVideo(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error requesting video:", error);
      showError("Failed to request video. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request New Video</DialogTitle>
          <DialogDescription>
            Fill in the details for your new video project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[80px]"
              placeholder="Provide a brief description of your video needs..."
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Submitting Request..." : "Submit Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};