
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login page with message
  if (!user) {
    // Store the attempted location for redirect after login
    const redirectPath = location.pathname + location.search;
    
    // Encode this to avoid issues with special characters
    const encodedRedirectPath = encodeURIComponent(redirectPath);
    
    return (
      <Navigate 
        to={`/trainee-login?redirect=${encodedRedirectPath}&authRequired=true`} 
        replace
      />
    );
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default RequireAuth;
