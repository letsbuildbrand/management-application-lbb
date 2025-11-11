"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Loader2, MailOpen } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  user_id: string;
  message: string;
  read_status: boolean;
  timestamp: string;
  related_project_id?: string;
}

export const NotificationsDropdown: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setIsLoadingNotifications(false);
      return;
    }

    setIsLoadingNotifications(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      showError("Failed to load notifications.");
    } else {
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read_status).length || 0);
    }
    setIsLoadingNotifications(false);
  }, [user]);

  useEffect(() => {
    if (user && !isSessionLoading) {
      fetchNotifications();

      const channel = supabase
        .channel(`notifications_for_user_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            fetchNotifications(); // Refetch when a new notification arrives
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isSessionLoading, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('id', notificationId)
      .eq('user_id', user?.id); // Ensure user can only mark their own

    if (error) {
      console.error("Error marking notification as read:", error);
      showError("Failed to mark notification as read.");
    } else {
      fetchNotifications(); // Refresh list
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read_status: true })
      .eq('user_id', user.id)
      .eq('read_status', false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      showError("Failed to mark all notifications as read.");
    } else {
      showSuccess("All notifications marked as read!");
      fetchNotifications(); // Refresh list
    }
  };

  if (isSessionLoading || !user) {
    return null; // Don't render if session is loading or no user
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-auto px-2 py-1">
              <MailOpen className="h-3 w-3 mr-1" /> Mark All Read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoadingNotifications ? (
          <DropdownMenuItem className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground text-center py-4">
            No new notifications.
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start space-y-1 p-2 ${!notification.read_status ? 'bg-accent/10' : ''}`}
              onClick={() => !notification.read_status && markAsRead(notification.id)}
            >
              <div className="flex justify-between w-full">
                <p className="text-sm font-medium">{notification.message}</p>
                {!notification.read_status && (
                  <span className="h-2 w-2 rounded-full bg-primary ml-2 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(notification.timestamp), { addSuffix: true })}
              </span>
              {notification.related_project_id && (
                <Link to={`/manager/client/${notification.related_project_id}`} className="text-xs text-primary hover:underline mt-1">
                  View Project
                </Link>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};