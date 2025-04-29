
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking authentication status, show nothing
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to home page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default RequireAuth;
