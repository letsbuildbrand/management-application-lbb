"use client";

import React, { useState, useEffect } from "react";
import { differenceInSeconds, formatDuration, intervalToDuration, isAfter, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveCountdownProps {
  deadlineTimestamp: string;
  currentStatus: string;
  className?: string;
}

export const LiveCountdown: React.FC<LiveCountdownProps> = ({ deadlineTimestamp, currentStatus, className }) => {
  const [remainingTime, setRemainingTime] = useState<Duration | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  const isCompleted = currentStatus === 'Completed' || currentStatus === 'Approved';

  useEffect(() => {
    if (isCompleted) {
      setRemainingTime(null);
      setIsOverdue(false);
      return;
    }

    const calculateRemainingTime = () => {
      const now = new Date();
      const deadline = parseISO(deadlineTimestamp);

      if (isAfter(now, deadline)) {
        setIsOverdue(true);
        setRemainingTime(null); // No remaining time, it's overdue
      } else {
        setIsOverdue(false);
        const duration = intervalToDuration({ start: now, end: deadline });
        setRemainingTime(duration);
      }
    };

    calculateRemainingTime(); // Initial calculation
    const timer = setInterval(calculateRemainingTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [deadlineTimestamp, currentStatus, isCompleted]);

  const formatCountdown = (duration: Duration | null) => {
    if (!duration) return "";

    const parts: string[] = [];
    if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
    if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
    if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}m`);
    if (duration.seconds && duration.seconds > 0) parts.push(`${duration.seconds}s`);

    return parts.join(" ");
  };

  if (isCompleted) {
    return (
      <span className={cn("flex items-center gap-1 text-sm text-green-500", className)}>
        <Clock className="h-4 w-4" /> Completed
      </span>
    );
  }

  if (isOverdue) {
    return (
      <span className={cn("flex items-center gap-1 text-sm text-destructive", className)}>
        <Clock className="h-4 w-4" /> Overdue
      </span>
    );
  }

  if (!remainingTime) {
    return (
      <span className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
        <Clock className="h-4 w-4" /> Calculating...
      </span>
    );
  );
  }

  return (
    <span className={cn("flex items-center gap-1 text-sm text-primary", className)}>
      <Clock className="h-4 w-4" /> {formatCountdown(remainingTime)}
    </span>
  );
};