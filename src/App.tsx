import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartmentsPage from "./pages/DepartmentsPage";
import ProfilePage from "./pages/ProfilePage"; // Import the new ProfilePage
import ChangePasswordPage from "./pages/ChangePasswordPage"; // Import the new ChangePasswordPage
import VideoEditingDepartmentPage from "./pages/VideoEditingDepartmentPage"; // Import the new VideoEditingDepartmentPage
import VideoEditorDashboardPage from "./pages/VideoEditorDashboardPage"; // Import the new VideoEditorDashboardPage
import ClientDashboardPage from "./pages/ClientDashboardPage"; // Import the new ClientDashboardPage

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* New route for profile */}
          <Route path="/change-password" element={<ChangePasswordPage />} /> {/* New route for change password */}
          <Route path="/departments/video-editing" element={<VideoEditingDepartmentPage />} /> {/* New route for Video Editing Department */}
          <Route path="/video-editing-dashboard" element={<VideoEditorDashboardPage />} /> {/* New route for Video Editor Dashboard */}
          <Route path="/client-dashboard" element={<ClientDashboardPage />} /> {/* New route for Client Dashboard */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;