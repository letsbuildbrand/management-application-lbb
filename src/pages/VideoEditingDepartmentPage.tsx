import React, { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { User, Briefcase, MonitorPlay, Users, Crown } from "lucide-react"; // Added Crown icon for Manager
import { useNavigate } from "react-router-dom";
import { ParticleCard, BentoCardGrid, GlobalSpotlight, useMobileDetection } from "@/components/MagicBento";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const VideoEditingDepartmentPage = () => {
  const navigate = useNavigate();
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = isMobile;

  const options = [
    {
      title: "Video Editor",
      description: "Manage video editing tasks and projects.",
      icon: <MonitorPlay className="h-8 w-8" />,
      onClick: () => navigate('/video-editing-dashboard')
    },
    {
      title: "Manager",
      description: "Oversee clients and manage project assignments.",
      icon: <Crown className="h-8 w-8" />, // Using Crown icon for Manager
      onClick: () => navigate('/manager-dashboard') // Navigate to the new Manager Dashboard
    },
    {
      title: "Client",
      description: "View project progress and provide feedback.",
      icon: <User className="h-8 w-8" />,
      onClick: () => navigate('/client-dashboard')
    },
    {
      title: "Client Assigner",
      description: "Assign clients to specific video editors.",
      icon: <Users className="h-8 w-8" />,
      onClick: () => { /* navigate('/client-assigner-dashboard') */ alert("Client Assigner dashboard coming soon!"); }
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full p-4 pb-24">
        <WelcomeHeader userName="Yadish" />
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-left px-4">Video Editing Department Roles</h2>

        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={true}
          spotlightRadius={DEFAULT_SPOTLIGHT_RADIUS}
          glowColor={DEFAULT_GLOW_COLOR}
        />

        <BentoCardGrid gridRef={gridRef}>
          {options.map((option, index) => {
            const baseClassName = `magic-bento-card magic-bento-card--text-autohide magic-bento-card--border-glow`;
            const cardProps = {
              className: baseClassName,
              style: {
                backgroundColor: '#060010',
                '--glow-color': DEFAULT_GLOW_COLOR
              } as React.CSSProperties,
              onClick: option.onClick,
            };

            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={DEFAULT_PARTICLE_COUNT}
                glowColor={DEFAULT_GLOW_COLOR}
                enableTilt={true}
                clickEffect={true}
                enableMagnetism={true}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{option.icon}</div>
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{option.title}</h2>
                  <p className="magic-bento-card__description">{option.description}</p>
                </div>
              </ParticleCard>
            );
          })}
        </BentoCardGrid>
      </div>
    </div>
  );
};

export default VideoEditingDepartmentPage;