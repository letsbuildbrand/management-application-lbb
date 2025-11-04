import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface DepartmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function DepartmentCard({ title, description, icon, className, ...props }: DepartmentCardProps) {
  return (
    <Card
      className={cn(
        "h-full flex flex-col justify-between p-6 transition-all duration-200 ease-in-out hover:shadow-lg hover:border-primary",
        className
      )}
      {...props}
    >
      <CardHeader className="p-0 pb-4">
        <div className="mb-3 text-primary">{icon}</div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}