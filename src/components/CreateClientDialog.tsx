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
import { showSuccess, showError } from "@/utils/toast";
import { Client } from "@/data/mockData"; // Import Client interface

interface CreateClientDialogProps {
  children: React.ReactNode;
  onCreateClient: (newClient: Omit<Client, 'id' | 'activeProjects' | 'unassignedTasks' | 'status' | 'videos'>) => void;
}

export const CreateClientDialog: React.FC<CreateClientDialogProps> = ({ children, onCreateClient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !username.trim() || !password.trim()) {
      showError("Please fill in all fields.");
      return;
    }

    onCreateClient({
      name: clientName.trim(),
      username: username.trim(),
      password: password.trim(),
    });

    showSuccess(`Client "${clientName}" created successfully!`);
    setClientName("");
    setUsername("");
    setPassword("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Client Account</DialogTitle>
          <DialogDescription>
            Enter details for the new client. A dashboard will be created for them.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientName" className="text-right">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">Create Client</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};