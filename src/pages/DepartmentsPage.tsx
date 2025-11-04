import { DepartmentCard } from "@/components/DepartmentCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Target, Share2, Handshake, MessageCircleMore, Video, Code } from "lucide-react";

const departmentsData = [
  {
    title: "Lead Generation Department",
    description: "Focuses on identifying and attracting potential customers through various channels.",
    icon: <Target className="h-8 w-8" />,
    className: "lg:col-span-1",
  },
  {
    title: "Lead Assigning Department",
    description: "Efficiently distributes qualified leads to the most suitable sales representatives.",
    icon: <Share2 className="h-8 w-8" />,
    className: "lg:col-span-1",
  },
  {
    title: "Approaching Department",
    description: "Engages with potential clients, understanding their needs and presenting tailored solutions.",
    icon: <Handshake className="h-8 w-8" />,
    className: "lg:col-span-1",
  },
  {
    title: "Client Communication and Relationship Department",
    description: "Manages all client interactions, ensuring satisfaction and fostering long-term partnerships.",
    icon: <MessageCircleMore className="h-8 w-8" />,
    className: "md:col-span-2 lg:col-span-2 flex flex-col", // Span 2 columns on medium and large screens
  },
  {
    title: "Video Editing Department",
    description: "Produces high-quality video content for marketing campaigns, presentations, and client projects.",
    icon: <Video className="h-8 w-8" />,
    className: "lg:col-span-1",
  },
  {
    title: "Web Development Department",
    description: "Designs, develops, and maintains responsive and user-friendly websites and web applications.",
    icon: <Code className="h-8 w-8" />,
    className: "lg:col-span-1",
  },
];

const DepartmentsPage = () => {
  return (
    <div className="h-screen bg-background text-foreground p-4 flex flex-col"> {/* Changed min-h-screen to h-screen and reduced padding */}
      <div className="max-w-7xl mx-auto flex-grow w-full">
        <div className="flex justify-between items-center mb-8"> {/* Reduced bottom margin */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back, Yadish
          </h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"> {/* Adjusted grid columns and gap */}
          {departmentsData.map((dept, index) => (
            <DepartmentCard
              key={index}
              title={dept.title}
              description={dept.description}
              icon={dept.icon}
              className={dept.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;