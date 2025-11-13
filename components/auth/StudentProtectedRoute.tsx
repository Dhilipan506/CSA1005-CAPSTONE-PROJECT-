
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const StudentProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'student') {
    return <Navigate to="/student/login" replace />;
  }

  return <>{children}</>;
};

export default StudentProtectedRoute;