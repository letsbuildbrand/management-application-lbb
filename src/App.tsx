import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartmentsPage from "./pages/DepartmentsPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import VideoEditingDepartmentPage from "./pages/VideoEditingDepartmentPage";
import VideoEditorDashboardPage from "./pages/VideoEditorDashboardPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage";
import ManagerClientDetailViewPage from "./pages/ManagerClientDetailViewPage";
import ClientAssignerDashboardPage from "./pages/ClientAssignerDashboardPage";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage"; // New import

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/departments/video-editing" element={<VideoEditingDepartmentPage />} />
          <Route path="/video-editing-dashboard" element={<VideoEditorDashboardPage />} />
          <Route path="/client-dashboard" element={<ClientDashboardPage />} />
          <Route path="/manager-dashboard" element={<ManagerDashboardPage />} />
          <Route path="/manager/client/:clientId" element={<ManagerClientDetailViewPage />} />
          <Route path="/client-assigner-dashboard" element={<ClientAssignerDashboardPage />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboardPage />} /> {/* New route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;