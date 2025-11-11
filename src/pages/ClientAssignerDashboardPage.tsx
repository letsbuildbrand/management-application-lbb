"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, User, Briefcase, ArrowRight } from "lucide-react";
import { Client, mockClients, mockManagers } from "@/data/mockData"; // Import Client and mockClients
import { CreateClientDialog } from "@/components/CreateClientDialog";
import { AssignManagerDialog } from "@/components/AssignManagerDialog";
import { showSuccess } from "@/utils/toast";

const ClientAssignerDashboardPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);

  const handleCreateClient = (newClientData: Omit<Client, 'id' | 'activeProjects' | 'unassignedTasks' | 'status' | 'videos'>) => {
    const newClient: Client = {
      id: `client${clients.length + 1}`,
      name: newClientData.name,
      username: newClientData.username,
      password: newClientData.password,
      activeProjects: 0,
      unassignedTasks: 0,
      status: "Active",
      videos: [],
      assignedManagerId: undefined, // Initially unassigned
    };
    setClients(prevClients => [...prevClients, newClient]);
    showSuccess(`New client "${newClient.name}" added.`);
  };

  const handleAssignManager = (clientId: string, managerId: string) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId ? { ...client, assignedManagerId: managerId } : client
      )
    );
    const managerName = mockManagers.find(m => m.id === managerId)?.name || "an unknown manager";
    showSuccess(`Client assigned to ${managerName}.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16">
        <div className="max-w-screen-2xl mx-auto">
          <WelcomeHeader userName="Yadish" />
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6 px-4">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tighter flex items-center gap-3">
                <Badge variant="default" className="bg-logo-red text-white text-sm px-3 py-1">Client Assigner</Badge>
                Client Management
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Oversee all clients and assign them to managers.
              </p>
            </div>
            <CreateClientDialog onCreateClient={handleCreateClient}>
              <Button className="h-10 px-5">
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Client
              </Button>
            </CreateClientDialog>
          </div>

          {/* Client List */}
          <div className="space-y-4 px-4">
            <h3 className="text-2xl font-semibold mb-4">Active Clients</h3>
            {clients.length > 0 ? (
              clients.map(client => {
                const assignedManager = client.assignedManagerId
                  ? mockManagers.find(m => m.id === client.assignedManagerId)
                  : undefined;
                return (
                  <Card key={client.id} className="p-4 hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-xl font-bold text-primary">{client.name}</h4>
                        <p className="text-sm text-muted-foreground">Status: {client.status}</p>
                        <p className="text-sm text-muted-foreground">Projects: {client.activeProjects}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {assignedManager ? (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Assigned to: {assignedManager.name}</span>
                          </div>
                        ) : (
                          <Badge variant="destructive">Unassigned Manager</Badge>
                        )}
                        <AssignManagerDialog
                          currentManagerId={client.assignedManagerId}
                          onAssign={(managerId) => handleAssignManager(client.id, managerId)}
                        >
                          <Button variant="outline" size="sm">
                            <Briefcase className="h-4 w-4 mr-2" /> {client.assignedManagerId ? "Reassign Manager" : "Assign Manager"}
                          </Button>
                        </AssignManagerDialog>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No clients found. Create a new client to get started!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientAssignerDashboardPage;