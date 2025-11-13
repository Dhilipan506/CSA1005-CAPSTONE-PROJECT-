import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import StudentLayout from '../../components/layout/StudentLayout';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ComplaintStatus, Student, ComplaintCategory } from '../../types';
import { motion } from 'framer-motion';
import { Plus, User, Building, Phone, ArrowRight, Clock, FilePlus, History, Megaphone } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getComplaintsByStudent, announcements } = useComplaints();
  const student = user as Student;

  const myComplaints = getComplaintsByStudent(student.id);
  const activeComplaints = myComplaints.filter(c => c.status !== ComplaintStatus.Completed);

  const statusColors: { [key in ComplaintStatus]: string } = {
    [ComplaintStatus.Pending]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [ComplaintStatus.InProgress]: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    [ComplaintStatus.Completed]: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const categoryData = Object.values(ComplaintCategory).map(cat => ({
    name: cat,
    value: myComplaints.filter(c => c.category === cat).length,
  }));
  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#84cc16'];
  
  const myComplaintStats = {
      total: myComplaints.length,
      pending: myComplaints.filter(c => c.status === ComplaintStatus.Pending).length,
      inProgress: myComplaints.filter(c => c.status === ComplaintStatus.InProgress).length,
      completed: myComplaints.filter(c => c.status === ComplaintStatus.Completed).length,
  };

  const ProfileCard = () => (
    <MotionDiv 
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-slate-700 rounded-full flex items-center justify-center w-14 h-14">
            <User className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{student.name}</h2>
          <p className="text-slate-400">{student.registerNumber}</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-3">
          <Building className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300">Room: {student.roomNumber}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-slate-400" />
          <span className="text-slate-300">{student.phoneNumber}</span>
        </div>
      </div>
    </MotionDiv>
  );
  
  const QuickActions = () => (
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
          <div className="space-y-3">
              <MotionButton
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/student/new-complaint')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500/80 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-500"
              >
                  <FilePlus size={18} /> File New Complaint
              </MotionButton>
              <MotionButton
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/student/history')}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-slate-600"
              >
                  <History size={18} /> View Full History
              </MotionButton>
          </div>
      </div>
  );

  const AnnouncementsCard = () => (
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2"><Megaphone size={20} className="text-teal-400" /> Hostel Announcements</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {announcements.slice(0, 5).map(ann => (
                  <div key={ann.id} className="p-3 bg-slate-700/50 rounded-lg border-l-4 border-teal-500">
                      <p className="font-semibold text-teal-300">{ann.title}</p>
                      <p className="text-sm text-slate-300 mt-1">{ann.content}</p>
                      <p className="text-xs text-slate-500 text-right mt-2">{new Date(ann.timestamp).toLocaleDateString()}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const TrackingProgressBox = () => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
        <h3 className="text-xl font-bold mb-4">Active Complaints Tracking</h3>
        {activeComplaints.length > 0 ? (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                {activeComplaints.map(complaint => (
                    <MotionDiv
                        key={complaint.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 p-4 rounded-xl border border-white/10"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-white">{complaint.category}</p>
                                <p className="text-xs text-slate-400">ID: {complaint.id}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[complaint.status]}`}>{complaint.status}</span>
                        </div>
                        <p className="text-sm text-slate-300 my-2">{complaint.description.substring(0, 50)}...</p>
                        
                        <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{new Date(complaint.lastUpdatedAt).toLocaleString()}</span>
                            </div>
                            <button onClick={() => navigate(`/student/complaint/${complaint.id}`)} className="text-teal-400 hover:underline font-semibold flex items-center gap-1">
                                View Details <ArrowRight size={12}/>
                            </button>
                        </div>
                    </MotionDiv>
                ))}
            </div>
        ) : (
            <div className="text-center py-8 h-full flex flex-col justify-center items-center">
                <p className="text-slate-400">No active complaints. Great!</p>
            </div>
        )}
    </div>
  );
  
  return (
    <StudentLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-1 space-y-8">
                <ProfileCard />
                <QuickActions />
                <AnnouncementsCard />
            </MotionDiv>

            {/* Middle Column */}
             <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-1">
                <TrackingProgressBox />
            </MotionDiv>

            {/* Right Column */}
             <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:col-span-1 space-y-8">
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">My Complaint Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg"><p className="text-2xl font-bold text-sky-400">{myComplaintStats.total}</p><p className="text-sm text-slate-400">Total</p></div>
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg"><p className="text-2xl font-bold text-yellow-400">{myComplaintStats.pending}</p><p className="text-sm text-slate-400">Pending</p></div>
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg"><p className="text-2xl font-bold text-teal-400">{myComplaintStats.inProgress}</p><p className="text-sm text-slate-400">In Progress</p></div>
                        <div className="text-center p-4 bg-slate-700/50 rounded-lg"><p className="text-2xl font-bold text-emerald-400">{myComplaintStats.completed}</p><p className="text-sm text-slate-400">Completed</p></div>
                    </div>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">My Complaints by Category</h3>
                    <div className="w-full h-[200px] flex items-center justify-center">
                      <PieChart width={250} height={200}>
                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      </PieChart>
                    </div>
                </div>
            </MotionDiv>
        </div>
        
        <MotionButton
          whileHover={{ scale: 1.1, rotate: 90, boxShadow: '0 0 25px rgba(16, 185, 129, 0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/student/new-complaint')}
          className="fixed bottom-24 md:bottom-8 right-8 bg-emerald-500 text-white rounded-full p-4 shadow-lg z-20"
          title="File New Complaint"
        >
          <Plus size={24} />
        </MotionButton>
    </StudentLayout>
  );
};

export default StudentDashboard;