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
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

interface CreateClientDialogProps {
  children: React.ReactNode;
  onCreateClient: (newClient: { name: string; email: string; password: string }) => Promise<void>;
}

export const CreateClientDialog: React.FC<CreateClientDialogProps> = ({ children, onCreateClient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState(""); // Changed from username to email
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim() || !password.trim()) {
      showError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateClient({
        name: clientName.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      setClientName("");
      setEmail("");
      setPassword("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating client:", error);
      showError("Failed to create client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};