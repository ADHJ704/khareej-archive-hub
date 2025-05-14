
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import Index from '@/pages/Index';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import ProjectFullDetail from '@/pages/ProjectFullDetail';
import Categories from '@/pages/Categories';
import NotFound from '@/pages/NotFound';
import SupervisorLogin from '@/pages/SupervisorLogin';
import TraineeLogin from '@/pages/TraineeLogin';
import TraineeSignup from '@/pages/TraineeSignup';
import AIHelper from '@/pages/AIHelper';
import SuggestProject from '@/pages/SuggestProject';
import SupervisorDashboard from '@/pages/supervisor/SupervisorDashboard';
import AddProject from '@/pages/supervisor/AddProject';
import ManageProjects from '@/pages/supervisor/ManageProjects';

import RequireAuth from '@/components/RequireAuth';
import RequireSupervisor from '@/components/RequireSupervisor';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/project/:id/full" element={<ProjectFullDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/ai-helper" element={<AIHelper />} />

              {/* صفحات تسجيل الدخول */}
              <Route path="/supervisor-login" element={<SupervisorLogin />} />
              <Route path="/trainee-login" element={<TraineeLogin />} />
              <Route path="/trainee-signup" element={<TraineeSignup />} />

              {/* صفحات المستخدم المسجل */}
              <Route 
                path="/suggest-project" 
                element={
                  <RequireAuth>
                    <SuggestProject />
                  </RequireAuth>
                } 
              />

              {/* صفحات المشرف */}
              <Route 
                path="/supervisor/dashboard" 
                element={
                  <RequireSupervisor>
                    <SupervisorDashboard />
                  </RequireSupervisor>
                } 
              />
              
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

              {/* صفحة 404 والتوجيه الافتراضي */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
