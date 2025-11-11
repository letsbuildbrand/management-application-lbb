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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { showSuccess, showError } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { Manager } from "@/data/mockData"; // Import Manager interface

interface AssignManagerDialogProps {
  children: React.ReactNode;
  clientId: string; // Added clientId prop
  currentManagerId?: string;
  onAssign: (clientId: string, managerId: string) => Promise<void>;
}

export const AssignManagerDialog: React.FC<AssignManagerDialogProps> = ({ children, clientId, currentManagerId, onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string | undefined>(currentManagerId);
  const [searchTerm, setSearchTerm] = useState("");
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoadingManagers, setIsLoadingManagers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      setIsLoadingManagers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('role', 'manager');

      if (error) {
        console.error("Error fetching managers:", error);
        showError("Failed to load managers.");
      } else {
        // For clientLoad, we'd ideally query the 'clients' table to count assigned clients per manager.
        // For now, we'll mock it or set to 0.
        const fetchedManagers: Manager[] = data.map(profile => ({
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
          avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
          clientLoad: 0, // Placeholder, will be updated in ClientAssignerDashboardPage
        }));
        setManagers(fetchedManagers);
      }
      setIsLoadingManagers(false);
    };

    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen]);

  const filteredManagers = managers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (selectedManager) {
      setIsSubmitting(true);
      try {
        await onAssign(clientId, selectedManager);
        setIsOpen(false);
      } catch (error) {
        console.error("Error assigning manager:", error);
        showError("Failed to assign manager. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showError("Please select a manager.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentManagerId ? "Reassign Manager" : "Assign Manager"}</DialogTitle>
          <DialogDescription>
            Select a manager for this client. Consider their current client load.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            disabled={isLoadingManagers || isSubmitting}
          />
          {isLoadingManagers ? (
            <p className="text-center text-muted-foreground">Loading managers...</p>
          ) : (
            <RadioGroup
              value={selectedManager}
              onValueChange={setSelectedManager}
              className="grid gap-2 max-h-60 overflow-y-auto"
              disabled={isSubmitting}
            >
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <div key={manager.id} className="flex items-center space-x-3 p-2 border rounded-md hover:bg-muted/50">
                    <RadioGroupItem value={manager.id} id={`manager-${manager.id}`} />
                    <Label htmlFor={`manager-${manager.id}`} className="flex items-center flex-grow cursor-pointer">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={manager.avatar} alt={manager.name} />
                        <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{manager.name}</span>
                      <Badge variant={manager.clientLoad > 1 ? "destructive" : manager.clientLoad > 0 ? "secondary" : "outline"} className="ml-auto">
                        {manager.clientLoad} Clients
                      </Badge>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No managers found.</p>
              )}
            </RadioGroup>
          )}
        </div>
        <Button onClick={handleAssign} disabled={!selectedManager || isLoadingManagers || isSubmitting}>
          {isSubmitting ? "Assigning..." : (currentManagerId ? "Reassign Client" : "Assign Client")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};