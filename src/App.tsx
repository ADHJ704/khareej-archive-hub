
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import Categories from "./pages/Categories";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectFullDetail from "./pages/ProjectFullDetail";
import NotFound from "./pages/NotFound";
import AIHelper from "./pages/AIHelper";
import TraineeLogin from "./pages/TraineeLogin";
import TraineeSignup from "./pages/TraineeSignup";
import SupervisorLogin from "./pages/SupervisorLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
});

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
            <Route path="/categories" element={<Categories />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/project-details/:id" element={<ProjectFullDetail />} />
            <Route path="/ai-helper" element={<AIHelper />} />
            <Route path="/trainee-login" element={<TraineeLogin />} />
            <Route path="/trainee-signup" element={<TraineeSignup />} />
            <Route path="/supervisor-login" element={<SupervisorLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
