import { DepartmentCard } from "@/components/DepartmentCard";
import { MadeWithDyad } from "@/components/made-with-dyad";
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
    className: "lg:col-span-2", 
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
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
          Our Departments
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default DepartmentsPage;