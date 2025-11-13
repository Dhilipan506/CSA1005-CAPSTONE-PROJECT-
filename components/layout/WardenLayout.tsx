import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Users, LogOut, ChevronLeft, ChevronRight, Menu, Megaphone } from 'lucide-react';

const WardenLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/warden/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/warden/dashboard' },
    { name: 'Complaints', icon: FileText, path: '/warden/complaints' },
    { name: 'Workers', icon: Users, path: '/warden/workers' },
    { name: 'Announcements', icon: Megaphone, path: '/warden/announcements' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h1 className={`text-2xl font-bold text-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Warden</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-1 rounded-full hover:bg-slate-700">
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition-colors duration-200 relative ${
                isActive ? 'bg-slate-700 text-emerald-400' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              } ${isSidebarOpen ? 'justify-start' : 'justify-center'}`
            }
            title={item.name}
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full"></div>}
                <item.icon size={22} />
                <span className={`ml-4 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-4 mt-auto border-t border-slate-700">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-300 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
          title="Logout"
        >
          <LogOut size={22} />
          <span className={`ml-4 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-800 border-r border-slate-700 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <SidebarContent />
      </aside>
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'bg-black/50' : 'pointer-events-none opacity-0'}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 lg:justify-end">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-semibold">Warden Portal</h2>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WardenLayout;