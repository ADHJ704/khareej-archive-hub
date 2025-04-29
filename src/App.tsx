
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectFullDetail from "./pages/ProjectFullDetail";
import NotFound from "./pages/NotFound";
import SuggestProject from "./pages/SuggestProject";
import AIHelper from "./pages/AIHelper";
import SupervisorLogin from "./pages/SupervisorLogin";
import TraineeLogin from "./pages/TraineeLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/project-details/:id" element={<ProjectFullDetail />} />
            <Route path="/suggest-project" element={<SuggestProject />} />
            <Route path="/ai-helper" element={<AIHelper />} />
            <Route path="/trainee-login" element={<TraineeLogin />} />
            <Route path="/supervisor-login" element={<SupervisorLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
