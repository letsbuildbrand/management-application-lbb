import { DepartmentCard } from "@/components/DepartmentCard";
import { Navbar } from "@/components/Navbar";
import Dock from "@/components/Dock"; // Import the new Dock component
import { Target, Share2, Handshake, MessageCircleMore, Video, Code, Home, LayoutGrid, User, Archive, Settings } from "lucide-react"; // Import icons for dock
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
    className: "md:col-span-2 lg:col-span-2 flex flex-col",
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
  const navigate = useNavigate();

  const dockItems = [
    { icon: <Home size={18} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <LayoutGrid size={18} />, label: 'Departments', onClick: () => navigate('/departments') },
    { icon: <User size={18} />, label: 'Profile', onClick: () => navigate('/profile') },
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive functionality coming soon!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings functionality coming soon!') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full p-4 pb-24"> {/* Added pb-24 for dock clearance */}
        <div className="flex justify-between items-center mb-8 mt-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back, Yadish
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
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
      <Dock items={dockItems} /> {/* Added the Dock component here */}
    </div>
  );
};

export default DepartmentsPage;