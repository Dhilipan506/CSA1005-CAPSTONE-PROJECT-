
import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileClock, User, LogOut } from 'lucide-react';

const StudentLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };
  
  const studentUser = user?.role === 'student' ? user : null;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans bg-gradient-to-br from-slate-900 to-teal-900/50">
      <header className="bg-slate-800/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-emerald-400">Student Portal</span>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink to="/student/dashboard" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}>Dashboard</NavLink>
              <NavLink to="/student/history" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}>History</NavLink>
              <NavLink to="/student/profile" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}>Profile</NavLink>
            </nav>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4 hidden sm:block">Welcome, {studentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-lg border-t border-white/10 p-2 flex justify-around">
        <NavLink to="/student/dashboard" className={({isActive}) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
          <LayoutDashboard size={24} />
          <span className="text-xs mt-1">Dashboard</span>
        </NavLink>
        <NavLink to="/student/history" className={({isActive}) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
          <FileClock size={24} />
          <span className="text-xs mt-1">History</span>
        </NavLink>
         <NavLink to="/student/profile" className={({isActive}) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </NavLink>
      </nav>
      {/* Add padding to the bottom of the main content to avoid overlap with mobile nav */}
      <div className="md:hidden h-20"></div> 
    </div>
  );
};

export default StudentLayout;