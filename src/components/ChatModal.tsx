"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquareText, Send, Loader2, Lock, Unlock } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/components/SessionContextProvider";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  project_id: string;
  user_id: string;
  message: string;
  is_internal_only: boolean;
  timestamp: string;
  profiles: {
    first_name: string;
    last_name?: string;
    avatar_url?: string;
    role: string;
  };
}

interface ChatModalProps {
  children: React.ReactNode;
  projectId: string;
  projectName: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ children, projectId, projectName }) => {
  const { user, profile, isLoading: isSessionLoading } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isInternalOnly, setIsInternalOnly] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isInternalRole = profile?.role === 'manager' || profile?.role === 'editor' || profile?.role === 'client_assigner';

  const fetchMessages = useCallback(async () => {
    if (!projectId || !user) return;

    setIsLoadingMessages(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles (first_name, last_name, avatar_url, role)
      `)
      .eq('project_id', projectId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      showError("Failed to load chat messages.");
    } else {
      setMessages(data as ChatMessage[]);
    }
    setIsLoadingMessages(false);
  }, [projectId, user]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();

      const channel = supabase
        .channel(`chat_room_${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            // Refetch messages to ensure RLS is applied correctly for the new message
            // and to get the full profile data.
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, projectId, fetchMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !projectId) return;

    setIsSendingMessage(true);
    try {
      const { error } = await supabase.from('chat_messages').insert({
        project_id: projectId,
        user_id: user.id,
        message: newMessage.trim(),
        is_internal_only: isInternalOnly && isInternalRole, // Only allow internal if user is an internal role
      });

      if (error) {
        throw error;
      }
      setNewMessage("");
      showSuccess("Message sent!");
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      showError("Failed to send message.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getAvatarFallback = (firstName: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const filteredMessages = messages.filter(msg => {
    if (msg.is_internal_only) {
      return isInternalRole; // Only internal roles see internal messages
    }
    return true; // Everyone sees public messages
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6" /> Chat for "{projectName}"
          </DialogTitle>
        </DialogHeader>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md bg-muted/20">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                {msg.user_id !== user?.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.profiles?.first_name}`} />
                    <AvatarFallback>{getAvatarFallback(msg.profiles?.first_name, msg.profiles?.last_name)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={
                    `max-w-[70%] p-3 rounded-lg shadow-sm relative ` +
                    (msg.user_id === user?.id
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-foreground rounded-bl-none border')
                  }
                >
                  <p className="text-xs font-semibold mb-1">
                    {msg.user_id === user?.id ? "You" : `${msg.profiles?.first_name || 'Unknown'} (${msg.profiles?.role})`}
                    {msg.is_internal_only && (
                      <span className="ml-2 text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Internal
                      </span>
                    )}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {format(new Date(msg.timestamp), 'MMM d, hh:mm a')}
                  </span>
                </div>
                {msg.user_id === user?.id && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.first_name}`} />
                    <AvatarFallback>{getAvatarFallback(profile?.first_name, profile?.last_name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-2 pt-4 border-t">
          {isInternalRole && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="internal-only"
                checked={isInternalOnly}
                onCheckedChange={(checked) => setIsInternalOnly(!!checked)}
                disabled={isSendingMessage}
              />
              <Label htmlFor="internal-only" className="flex items-center gap-1 text-sm text-muted-foreground">
                {isInternalOnly ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />} Internal
              </Label>
            </div>
          )}
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isSendingMessage || isSessionLoading || !user}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isSendingMessage || !newMessage.trim() || !user}>
            {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};