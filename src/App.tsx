
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
import RequireAuth from "./components/RequireAuth";
import RequireSupervisor from "./components/RequireSupervisor";
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import AddProject from './pages/supervisor/AddProject';
import ManageProjects from './pages/supervisor/ManageProjects';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* مسارات محمية تتطلب تسجيل الدخول */}
              <Route path="/projects" element={
                <RequireAuth>
                  <Projects />
                </RequireAuth>
              } />
              <Route path="/categories" element={
                <RequireAuth>
                  <Categories />
                </RequireAuth>
              } />
              <Route path="/project/:id" element={
                <RequireAuth>
                  <ProjectDetail />
                </RequireAuth>
              } />
              <Route path="/project-details/:id" element={
                <RequireAuth>
                  <ProjectFullDetail />
                </RequireAuth>
              } />
              <Route path="/ai-helper" element={
                <RequireAuth>
                  <AIHelper />
                </RequireAuth>
              } />
              
              {/* مسارات تسجيل الدخول */}
              <Route path="/trainee-login" element={<TraineeLogin />} />
              <Route path="/trainee-signup" element={<TraineeSignup />} />
              <Route path="/supervisor-login" element={<SupervisorLogin />} />
              
              {/* مسارات لوحة التحكم للمشرفين - محمية */}
              <Route 
                path="/supervisor/dashboard" 
                element={
                  <RequireSupervisor>
                    <SupervisorDashboard />
                  </RequireSupervisor>
                } 
              />
              
              {/* إضافة المسارات الجديدة للمشرفين - حماية باستخدام RequireSupervisor */}
              <Route 
                path="/supervisor/add-project" 
                element={
                  <RequireSupervisor>
                    <AddProject />
                  </RequireSupervisor>
                } 
              />
              <Route 
                path="/supervisor/manage-projects" 
                element={
                  <RequireSupervisor>
                    <ManageProjects />
                  </RequireSupervisor>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
