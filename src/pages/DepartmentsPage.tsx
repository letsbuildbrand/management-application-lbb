import { Navbar } from "@/components/Navbar";
// import Dock from "@/components/Dock"; // Commented out the import for Dock component
import MagicBento from "@/components/MagicBento"; // Import the new MagicBento component
import { WelcomeHeader } from "@/components/WelcomeHeader"; // Import the new WelcomeHeader component
// import { Home, LayoutGrid, User, Archive, Settings } from "lucide-react"; // Commented out icons for dock
// import { useNavigate } from "react-router-dom"; // Commented out useNavigate

const DepartmentsPage = () => {
  // const navigate = useNavigate(); // Commented out useNavigate

  // const dockItems = [ // Commented out dockItems
  //   { icon: <Home size={18} />, label: 'Home', onClick: () => navigate('/') },
  //   { icon: <LayoutGrid size={18} />, label: 'Departments', onClick: () => navigate('/departments') },
  //   { icon: <User size={18} />, label: 'Profile', onClick: () => navigate('/profile') },
  //   { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive functionality coming soon!') },
  //   { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings functionality coming soon!') },
  // ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-grow max-w-7xl mx-auto w-full p-4 pb-24"> {/* Added pb-24 for dock clearance */}
        <WelcomeHeader userName="Yadish" /> {/* Integrated the new WelcomeHeader */}

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
      {/* <Dock items={dockItems} /> */} {/* Commented out the Dock component here */}
    </div>
  );
};

export default DepartmentsPage;