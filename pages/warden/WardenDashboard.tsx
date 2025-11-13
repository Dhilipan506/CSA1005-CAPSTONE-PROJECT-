import React from 'react';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { ComplaintStatus, ComplaintCategory } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Files, Loader, CheckCircle, Clock, User, ArrowRight, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;
const MotionTbody = motion.tbody;
const MotionTr = motion.tr;

const StatCard = ({ title, value, icon: Icon, colorClass, gradient }: { title: string, value: number, icon: React.ElementType, colorClass: string, gradient: string }) => (
    <MotionDiv 
        whileHover={{ y: -5, boxShadow: `0 10px 15px -3px ${colorClass}` }}
        className={`bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between shadow-lg transition-all duration-300 overflow-hidden relative`}
    >
        <div className={`absolute top-0 left-0 right-0 h-1 ${gradient}`}></div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white/10`}>
            <Icon size={24} />
        </div>
    </MotionDiv>
);

const WardenDashboard: React.FC = () => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === ComplaintStatus.Pending).length;
  const inProgress = complaints.filter(c => c.status === ComplaintStatus.InProgress).length;
  const completed = complaints.filter(c => c.status === ComplaintStatus.Completed).length;

  const categoryData = Object.values(ComplaintCategory).map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat).length,
  }));
  const COLORS = ['#34d399', '#2dd4bf', '#38bdf8', '#fb923c', '#a3e635'];
  
  const dailyComplaintsData = [
    { day: 'Mon', count: 4 }, { day: 'Tue', count: 6 }, { day: 'Wed', count: 3 },
    { day: 'Thu', count: 8 }, { day: 'Fri', count: 5 }, { day: 'Sat', count: 7 }, { day: 'Sun', count: 2 },
  ];
  
  const recentComplaints = complaints
    .filter(c => c.status !== ComplaintStatus.Completed)
    .sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const tableContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const QuickActionCard = ({ title, to, icon: Icon }: {title: string, to: string, icon: React.ElementType}) => (
      <MotionButton
          whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 41, 59, 0.7)' }}
          onClick={() => navigate(to)}
          className="w-full flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
      >
          <div className="flex items-center gap-3">
              <Icon size={20} className="text-emerald-400"/>
              <span className="font-semibold">{title}</span>
          </div>
          <ArrowRight size={18} className="text-slate-400"/>
      </MotionButton>
  );

  return (
    <WardenLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Complaints" value={total} icon={Files} colorClass="shadow-sky-500/20" gradient="bg-gradient-to-r from-sky-500 to-cyan-400" />
          <StatCard title="Pending" value={pending} icon={Clock} colorClass="shadow-yellow-500/20" gradient="bg-gradient-to-r from-yellow-500 to-amber-400" />
          <StatCard title="In Progress" value={inProgress} icon={Loader} colorClass="shadow-teal-500/20" gradient="bg-gradient-to-r from-teal-500 to-cyan-400" />
          <StatCard title="Completed" value={completed} icon={CheckCircle} colorClass="shadow-emerald-500/20" gradient="bg-gradient-to-r from-emerald-500 to-green-400" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MotionDiv initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="lg:col-span-2 space-y-8">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Weekly Complaints</h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dailyComplaintsData}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.7}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} />
                        <Bar dataKey="count" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
            </MotionDiv>
            <MotionDiv initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="lg:col-span-1 space-y-8">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <QuickActionCard title="View All Complaints" to="/warden/complaints" icon={Files}/>
                        <QuickActionCard title="Manage Workers" to="/warden/workers" icon={Wrench}/>
                        <QuickActionCard title="Post Announcement" to="/warden/announcements" icon={User}/>
                    </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </MotionDiv>
        </div>
        
        <MotionDiv initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Recent Active Complaints</h2>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase border-b border-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3">ID</th>
                  <th scope="col" className="px-4 py-3">Student</th>
                  <th scope="col" className="px-4 py-3">Room</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <MotionTbody variants={tableContainerVariants} initial="hidden" animate="show">
                {recentComplaints.length > 0 ? recentComplaints.map(c => (
                  <MotionTr key={c.id} className="hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0" variants={tableRowVariants}>
                    <td className="px-4 py-3 font-medium text-white">{c.id}</td>
                    <td className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                            <User size={16} className="text-slate-400" />
                        </div>
                        {c.studentName}
                    </td>
                    <td className="px-4 py-3">{c.roomNumber}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3">{c.status}</td>
                    <td className="px-4 py-3">
                        <Link to="/warden/complaints" className="font-medium text-emerald-400 hover:underline">View</Link>
                    </td>
                  </MotionTr>
                )) : (
                   <tr>
                     <td colSpan={6} className="text-center py-8 text-slate-400">
                        No active complaints at the moment.
                     </td>
                   </tr>
                )}
              </MotionTbody>
            </table>
          </div>
        </MotionDiv>

      </div>
    </WardenLayout>
  );
};

export default WardenDashboard;