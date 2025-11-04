import React from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { OptionCard } from "@/components/OptionCard";
import { User, Briefcase, MonitorPlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoEditingDepartmentPage = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Video Editor",
      description: "Manage video editing tasks and projects.",
      icon: <MonitorPlay className="h-8 w-8" />,
      onClick: () => { /* navigate('/video-editor-dashboard') */ alert("Video Editor dashboard coming soon!"); }
    },
    {
      title: "Manager",
      description: "Oversee the video editing team and workflow.",
      icon: <Briefcase className="h-8 w-8" />,
      onClick: () => { /* navigate('/video-editing-manager-dashboard') */ alert("Manager dashboard coming soon!"); }
    },
    {
      title: "Client",
      description: "View project progress and provide feedback.",
      icon: <User className="h-8 w-8" />,
      onClick: () => { /* navigate('/video-editing-client-portal') */ alert("Client portal coming soon!"); }
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full p-4 pb-24">
        <WelcomeHeader userName="Yadish" />
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-left px-4">Video Editing Department Roles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {options.map((option, index) => (
            <OptionCard
              key={index}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={option.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoEditingDepartmentPage;