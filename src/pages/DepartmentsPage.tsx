import { Navbar } from "@/components/Navbar";
import Dock from "@/components/Dock"; // Import the new Dock component
import MagicBento from "@/components/MagicBento"; // Import the new MagicBento component
import { Home, LayoutGrid, User, Archive, Settings } from "lucide-react"; // Import icons for dock
import { useNavigate } from "react-router-dom"; // Import useNavigate

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

        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </div>
      <Dock items={dockItems} /> {/* Added the Dock component here */}
    </div>
  );
};

export default DepartmentsPage;