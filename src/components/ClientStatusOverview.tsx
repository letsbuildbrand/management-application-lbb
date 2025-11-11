import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, UserX, PauseCircle } from "lucide-react";

interface ClientStatusOverviewProps {
  activeClients: number;
  onHoldClients: number;
  archivedClients: number;
  totalClients: number;
}

export const ClientStatusOverview: React.FC<ClientStatusOverviewProps> = ({
  activeClients,
  onHoldClients,
  archivedClients,
  totalClients,
}) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Client Status Overview</CardTitle>
        <CardDescription>Breakdown of your client portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <span>Active Clients</span>
          </div>
          <span className="font-bold text-lg">{activeClients}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PauseCircle className="h-5 w-5 text-yellow-500" />
            <span>On Hold Clients</span>
          </div>
          <span className="font-bold text-lg">{onHoldClients}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" />
            <span>Archived Clients</span>
          </div>
          <span className="font-bold text-lg">{archivedClients}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>Total Clients</span>
          </div>
          <span className="font-bold text-xl">{totalClients}</span>
        </div>
      </CardContent>
    </Card>
  );
};