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
import { showSuccess } from "@/utils/toast";

export interface Editor {
  id: string;
  name: string;
  avatar: string;
  workload: number; // Number of active projects
}

const mockEditors: Editor[] = [
  { id: "editor1", name: "Alice Johnson", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Alice", workload: 2 },
  { id: "editor2", name: "Bob Smith", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Bob", workload: 1 },
  { id: "editor3", name: "Charlie Brown", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Charlie", workload: 3 },
  { id: "editor4", name: "Diana Prince", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Diana", workload: 0 },
];

interface AssignEditorDialogProps {
  children: React.ReactNode;
  currentEditorId?: string;
  onAssign: (editorId: string) => void;
}

export const AssignEditorDialog: React.FC<AssignEditorDialogProps> = ({ children, currentEditorId, onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEditor, setSelectedEditor] = useState<string | undefined>(currentEditorId);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEditors = mockEditors.filter(editor =>
    editor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (selectedEditor) {
      onAssign(selectedEditor);
      showSuccess(`Project assigned to ${mockEditors.find(e => e.id === selectedEditor)?.name || 'editor'}!`);
      setIsOpen(false);
    } else {
      // Optionally show an error if no editor is selected
      showSuccess("Please select an editor.");
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
          />
          <RadioGroup
            value={selectedEditor}
            onValueChange={setSelectedEditor}
            className="grid gap-2 max-h-60 overflow-y-auto"
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
        </div>
        <Button onClick={handleAssign} disabled={!selectedEditor}>
          {currentEditorId ? "Reassign Project" : "Assign Project"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};