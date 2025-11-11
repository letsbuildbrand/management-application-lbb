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
import { Editor } from "@/data/mockData"; // Import Editor interface

interface AssignEditorDialogProps {
  children: React.ReactNode;
  projectId: string; // Added projectId prop
  currentEditorId?: string;
  onAssign: (projectId: string, editorId: string) => Promise<void>;
}

export const AssignEditorDialog: React.FC<AssignEditorDialogProps> = ({ children, projectId, currentEditorId, onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState<string | undefined>(currentEditorId);
  const [searchTerm, setSearchTerm] = useState("");
  const [editors, setEditors] = useState<Editor[]>([]);
  const [isLoadingEditors, setIsLoadingEditors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEditors = async () => {
      setIsLoadingEditors(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, role')
        .eq('role', 'editor');

      if (profilesError) {
        console.error("Error fetching editors:", profilesError);
        showError("Failed to load editors.");
        setEditors([]);
      } else {
        const editorsWithWorkload = await Promise.all(profilesData.map(async (profile) => {
          const { count, error: countError } = await supabase
            .from('projects')
            .select('id', { count: 'exact' })
            .eq('assigned_editor_id', profile.id)
            .neq('current_status', 'Completed')
            .neq('current_status', 'Approved');

          if (countError) {
            console.error(`Error counting projects for editor ${profile.id}:`, countError);
            return {
              id: profile.id,
              name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
              avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
              workload: 0,
            };
          }

          return {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.first_name}`,
            workload: count || 0,
          };
        }));
        setEditors(editorsWithWorkload);
      }
      setIsLoadingEditors(false);
    };

    if (isOpen) {
      fetchEditors();
    }
  }, [isOpen]);

  const filteredEditors = editors.filter(editor =>
    editor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (selectedEditor) {
      setIsSubmitting(true);
      try {
        await onAssign(projectId, selectedEditor);
        setIsOpen(false);
      } catch (error) {
        console.error("Error assigning editor:", error);
        showError("Failed to assign editor. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showError("Please select an editor.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentEditorId ? "Reassign Editor" : "Assign Editor"}</DialogTitle>
          <DialogDescription>
            Select an editor for this project. Consider their current workload.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search editors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            disabled={isLoadingEditors || isSubmitting}
          />
          {isLoadingEditors ? (
            <p className="text-center text-muted-foreground">Loading editors...</p>
          ) : (
            <RadioGroup
              value={selectedEditor}
              onValueChange={setSelectedEditor}
              className="grid gap-2 max-h-60 overflow-y-auto"
              disabled={isSubmitting}
            >
              {filteredEditors.length > 0 ? (
                filteredEditors.map((editor) => (
                  <div key={editor.id} className="flex items-center space-x-3 p-2 border rounded-md hover:bg-muted/50">
                    <RadioGroupItem value={editor.id} id={`editor-${editor.id}`} />
                    <Label htmlFor={`editor-${editor.id}`} className="flex items-center flex-grow cursor-pointer">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={editor.avatar} alt={editor.name} />
                        <AvatarFallback>{editor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{editor.name}</span>
                      <Badge variant={editor.workload > 2 ? "destructive" : editor.workload > 0 ? "secondary" : "outline"} className="ml-auto">
                        {editor.workload} Active Projects
                      </Badge>
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No editors found.</p>
              )}
            </RadioGroup>
          )}
        </div>
        <Button onClick={handleAssign} disabled={!selectedEditor || isLoadingEditors || isSubmitting}>
          {isSubmitting ? "Assigning..." : (currentEditorId ? "Reassign Project" : "Assign Project")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};