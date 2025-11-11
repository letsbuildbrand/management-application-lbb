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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/toast";

interface RequestChangesDialogProps {
  children: React.ReactNode;
  onSave: (feedback: string) => Promise<void>;
}

export const RequestChangesDialog: React.FC<RequestChangesDialogProps> = ({ children, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      showError("Please provide feedback before requesting changes.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(feedback.trim());
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      showError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Changes</DialogTitle>
          <DialogDescription>
            Please provide detailed feedback for the requested changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="e.g., 'Please adjust the color grading in scene 3' or 'The intro music is too loud.'"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={!feedback.trim() || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Changes Request"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};