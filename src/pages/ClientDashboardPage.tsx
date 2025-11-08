"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, ThumbsUp } from "lucide-react"; // Using Film for logo, ThumbsUp for icon

interface ProjectCardProps {
  title: string;
  dueDate?: string;
  completedDate?: string;
  status: string;
  statusVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "primary" | "accent";
  thumbnailUrl: string;
  thumbnailAlt: string;
  highlight?: boolean;
  clientName?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  dueDate,
  completedDate,
  status,
  statusVariant,
  thumbnailUrl,
  thumbnailAlt,
  highlight = false,
  clientName,
}) => {
  return (
    <div className="p-2">
      <div
        className={`flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-card border overflow-hidden
          ${highlight ? "border-2 border-primary ring-4 ring-primary/10" : "border-border"}`}
      >
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover"
          style={{ backgroundImage: `url("${thumbnailUrl}")` }}
          data-alt={thumbnailAlt}
        ></div>
        <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
          <p className="text-base font-bold leading-tight">{title}</p>
          <div className="flex items-center justify-between">
            {dueDate && (
              <p className="text-sm text-muted-foreground">Due: {dueDate}</p>
            )}
            {completedDate && (
              <p className="text-sm text-muted-foreground">Completed: {completedDate}</p>
            )}
            <Badge variant={statusVariant}>{status}</Badge>
          </div>
          {clientName && (
            <p className="text-sm text-muted-foreground mt-1">{clientName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ClientDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 mt-16"> {/* Added mt-16 for Navbar clearance */}
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-3xl font-black leading-tight tracking-tighter">
                Video Projects Dashboard
              </h1>
              <p className="text-muted-foreground text-base font-normal leading-normal">
                Track your projects from request to completion.
              </p>
            </div>
            <div className="flex w-full sm:w-auto">
              <div className="flex h-10 w-full sm:w-auto items-center justify-center rounded-full bg-background dark:bg-card border border-border p-1">
                <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-4 has-[:checked]:bg-card has-[:checked]:dark:bg-background has-[:checked]:shadow-sm has-[:checked]:text-foreground text-muted-foreground text-sm font-medium leading-normal transition-all">
                  <span className="truncate">Variant 1</span>
                  <input checked className="invisible w-0" name="view-variant" type="radio" value="Variant 1" />
                </label>
                <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-4 has-[:checked]:bg-card has-[:checked]:dark:bg-background has-[:checked]:shadow-sm has-[:checked]:text-foreground text-muted-foreground text-sm font-medium leading-normal transition-all">
                  <span className="truncate">Variant 2</span>
                  <input className="invisible w-0" name="view-variant" type="radio" value="Variant 2" />
                </label>
                <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-4 has-[:checked]:bg-card has-[:checked]:dark:bg-background has-[:checked]:shadow-sm has-[:checked]:text-foreground text-muted-foreground text-sm font-medium leading-normal transition-all">
                  <span className="truncate">Variant 3</span>
                  <input className="invisible w-0" name="view-variant" type="radio" value="Variant 3" />
                </label>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Column: Requested */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight px-2">
                Requested
              </h3>
              <div className="space-y-4">
                <ProjectCard
                  title="Q3 Product Launch Ad"
                  dueDate="Oct 25, 2024"
                  status="Scripting"
                  statusVariant="outline"
                  thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDOnXkN9U0vyMwqiACQTcSDpB98U8jnV1S8aq8UabdfPE-GMTWycc5-7aT_2uuYRyw1okkrq4qqsQP115HSLy-hpoVQi3cerRG7pL4Bl_p6Yh2mYZVhQgtuHzIvbkoP2dUXCRcqnAoSX5s48k_Bm1Bz5lM3SYjTGzhJ9bsjBiM-dY3Klfwa1Q1zG1byZeSlJ1-19wLXlJ7tymkeg5E80rlf4Uz_DQ1a_0Prkd2zipgBjOuHv2ICt87jSglu1VSxAvv499SLrq7pzHXv"
                  thumbnailAlt="Abstract gradient thumbnail for Q3 Product Launch Ad"
                />
              </div>
            </div>
            {/* Column: In Progress */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight px-2">
                In Progress
              </h3>
              <div className="space-y-4">
                <ProjectCard
                  title="New Website Explainer"
                  dueDate="Nov 10, 2024"
                  status="Editing"
                  statusVariant="secondary" // Using secondary for blue-like
                  thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAIu0iAYDEOt7Y6XnCxUMYQAmKK4YRVUOHZQmqyRdNWL9Or1jEqS8f3E-ClCdU9-2B1eKkGQtrnmvLhmDVsj1w4YlYAuz1cpFBzHENbGBDQ0g5fEpA1htERd989G0-12xg5yu8TGdfMB-nMl_sWXvOHVkokBZZanMLplppk8b5NBINz5lzx5TPPbykJZfC1Az42VOeiAAXZFOErB4rsARJX4yZ9UZUVkVxBABpJx8Xjt92TOJo4GRllUS_L7oZoVAIYyUyG6lJYstrM"
                  thumbnailAlt="Abstract gradient thumbnail for 'New Website Explainer' video"
                />
                <ProjectCard
                  title="Social Media Campaign Clips"
                  dueDate="Nov 15, 2024"
                  status="Animation"
                  statusVariant="accent" // Using accent for yellow-like
                  thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBMspV-m4JABgkPggN9oysyekRLDBfPXYV56F7mAXlxnP--IGWeN_ixfvkMEehQ6sRL5CHeKQW8FDjiyXQGlBaCEoi9zaFyvOszPbmdpDTLXpVA_xwvCxCj2D4ioazIHs-Iuq_um7hscIFA8HMSVdOyBeF6Linzm-xomQK9oDtl0-xb5AAbB9ZDJXbbGZhqiwtb8-HelZt94em3J_0xzd6Bg4WGCOdob01W0Qm3WZzpQ2MrLskW5jXsoE3laNZA2WC-4fNjC1jCSYWe"
                  thumbnailAlt="Abstract gradient thumbnail for 'Social Media Campaign Clips'"
                />
              </div>
            </div>
            {/* Column: Ready for Your Review */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight px-2">
                Ready for Your Review
              </h3>
              <div className="space-y-4">
                <ProjectCard
                  title="Annual Conference Opener"
                  dueDate="Updated: Yesterday"
                  status="Awaiting Feedback"
                  statusVariant="primary"
                  thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDQLYpvdAgFBgCiOcVMz0nJh1R9h9CcJNxbUjmIlagIAAI6nc6hTv1g6TTXceuaedf8v0YCVulbYTeff5FiifpfKioG5oYniwUBUm6XzJ-7aycTduSeV62nvTtOQklTo3TkQDdLF2_tmzfbawDL5u8WduugiKip3BXRBrGJgCRDVX4Z59layIh3GdOLt8OJCBwvv04bUBlbshSLtmgYOJwwxKt6adPp_OdVZskgNSV7j8AMy5iDvB-IMFopD_OPL4shGC02cE4Zu41p"
                  thumbnailAlt="Abstract gradient thumbnail for 'Annual Conference Opener'"
                  highlight={true}
                />
                <div className="p-2">
                  <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-xl h-48 bg-background dark:bg-card/50">
                    <ThumbsUp className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      You have no other projects in review. Great work!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Column: Completed */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight px-2">
                Completed
              </h3>
              <div className="space-y-4">
                <ProjectCard
                  title="Employee Training Series"
                  completedDate="Oct 1, 2024"
                  status="Approved"
                  statusVariant="success"
                  thumbnailUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBxmnYdQIObb4QKkEZsoehB_hG4KfblP2-u8XmVDmgyQQPd9XpFRhCGZSLAYMVIyuWkF7kzw6_jBM4KsjVFV9AoU6gbWt78A9hbmcQMMWNxLBQvGCX2NJf_4RSYwmSOMtIZow_3MfU3QJng_mAFw9h4utGDH7l07EL2Y_8vOqNxnUD5cFLdcY2ho3hCHtG-VbY284bKiSea6t8InHj0Nyrma76JB0wNTSsbyekKAF5WCS7wllj-mmPOpOTFHIrlE59TBLbJH7kt5Z6p"
                  thumbnailAlt="Abstract gradient thumbnail for 'Employee Training Series'"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboardPage;