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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Added missing import for Badge
import { showSuccess } from "@/utils/toast";
import { mockManagers, Manager } from "@/data/mockData"; // Import from centralized mockData

interface AssignManagerDialogProps {
  children: React.ReactNode;
  currentManagerId?: string;
  onAssign: (managerId: string) => void;
}

export const AssignManagerDialog: React.FC<AssignManagerDialogProps> = ({ children, currentManagerId, onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<string | undefined>(currentManagerId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredManagers = mockManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedManager) {
      onAssign(selectedManager);
      showSuccess(`Client assigned to ${mockManagers.find(e => e.id === selectedManager)?.name || 'manager'}!`);
      setIsOpen(false);
    } else {
      showSuccess("Please select a manager.");
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
          />
          <RadioGroup
            value={selectedManager}
            onValueChange={setSelectedManager}
            className="grid gap-2 max-h-60 overflow-y-auto"
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
        </div>
        <Button onClick={handleAssign} disabled={!selectedManager}>
          {currentManagerId ? "Reassign Client" : "Assign Client"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};