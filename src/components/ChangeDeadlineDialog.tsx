"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, setHours, setMinutes, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "@/utils/toast";

interface ChangeDeadlineDialogProps {
  children: React.ReactNode;
  currentDeadline: string; // ISO string
  onSave: (newDeadline: string) => Promise<void>;
}

export const ChangeDeadlineDialog: React.FC<ChangeDeadlineDialogProps> = ({ children, currentDeadline, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>(""); // HH:mm format
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentDeadline) {
      const parsedDate = parseISO(currentDeadline);
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setTime(format(parsedDate, "HH:mm"));
      }
    }
  }, [currentDeadline, isOpen]); // Reset when dialog opens

  const handleSave = async () => {
    if (!date || !time) {
      showError("Please select both a date and time.");
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      showError("Please enter a valid time (HH:mm).");
      return;
    }

    let newDateTime = setHours(date, hours);
    newDateTime = setMinutes(newDateTime, minutes);

    if (!isValid(newDateTime)) {
      showError("Invalid date or time selected.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(newDateTime.toISOString());
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving new deadline:", error);
      showError("Failed to update deadline. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Project Deadline</DialogTitle>
          <DialogDescription>
            Select a new date and time for the project's adjusted deadline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isSaving}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time (HH:mm)
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-3"
              required
              disabled={isSaving}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={!date || !time || isSaving}>
          {isSaving ? "Saving..." : "Save New Deadline"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};