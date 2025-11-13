
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';

import StudentLogin from './pages/student/StudentLogin';
import WardenLogin from './pages/warden/WardenLogin';
import StudentDashboard from './pages/student/StudentDashboard';
import WardenDashboard from './pages/warden/WardenDashboard';
import NewComplaint from './pages/student/NewComplaint';
import ComplaintHistory from './pages/student/ComplaintHistory';
import StudentComplaintDetail from './pages/student/StudentComplaintDetail';
import StudentProfile from './pages/student/StudentProfile';
import ViewComplaints from './pages/warden/ViewComplaints';
import AssignWorker from './pages/warden/AssignWorker';
import UpdateProgress from './pages/warden/UpdateProgress';
import WorkerManagement from './pages/warden/WorkerManagement';
import AnnouncementsManagement from './pages/warden/AnnouncementsManagement';

import StudentProtectedRoute from './components/auth/StudentProtectedRoute';
import WardenProtectedRoute from './components/auth/WardenProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/student/login" replace />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/warden/login" element={<WardenLogin />} />

            {/* Student Protected Routes */}
            <Route path="/student/dashboard" element={<StudentProtectedRoute><StudentDashboard /></StudentProtectedRoute>} />
            <Route path="/student/new-complaint" element={<StudentProtectedRoute><NewComplaint /></StudentProtectedRoute>} />
            <Route path="/student/history" element={<StudentProtectedRoute><ComplaintHistory /></StudentProtectedRoute>} />
            <Route path="/student/complaint/:complaintId" element={<StudentProtectedRoute><StudentComplaintDetail /></StudentProtectedRoute>} />
            <Route path="/student/profile" element={<StudentProtectedRoute><StudentProfile /></StudentProtectedRoute>} />

            {/* Warden Protected Routes */}
            <Route path="/warden/dashboard" element={<WardenProtectedRoute><WardenDashboard /></WardenProtectedRoute>} />
            <Route path="/warden/complaints" element={<WardenProtectedRoute><ViewComplaints /></WardenProtectedRoute>} />
            <Route path="/warden/assign/:complaintId" element={<WardenProtectedRoute><AssignWorker /></WardenProtectedRoute>} />
            <Route path="/warden/update/:complaintId" element={<WardenProtectedRoute><UpdateProgress /></WardenProtectedRoute>} />
            <Route path="/warden/workers" element={<WardenProtectedRoute><WorkerManagement /></WardenProtectedRoute>} />
            <Route path="/warden/announcements" element={<WardenProtectedRoute><AnnouncementsManagement /></WardenProtectedRoute>} />


            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ComplaintProvider>
    </AuthProvider>
  );
};

export default App;