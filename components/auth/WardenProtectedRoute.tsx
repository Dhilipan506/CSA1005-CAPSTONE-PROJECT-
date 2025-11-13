
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const WardenProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'warden') {
    return <Navigate to="/warden/login" replace />;
  }

  return <>{children}</>;
};

export default WardenProtectedRoute;