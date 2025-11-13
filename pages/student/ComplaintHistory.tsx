import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus, Student } from '../../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, ArrowRight } from 'lucide-react';

// Fix: Assign motion component to a variable to help with type inference.
const MotionDiv = motion.div;

const ComplaintHistory: React.FC = () => {
  const { user } = useAuth();
  const { getComplaintsByStudent } = useComplaints();
  const student = user as Student;
  const myComplaints = getComplaintsByStudent(student.id);

  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComplaints = myComplaints
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c => c.description.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const statusColors: { [key in ComplaintStatus]: string } = {
    [ComplaintStatus.Pending]: 'bg-yellow-500/20 text-yellow-400',
    [ComplaintStatus.InProgress]: 'bg-sky-500/20 text-sky-400',
    [ComplaintStatus.Completed]: 'bg-emerald-500/20 text-emerald-400',
  };
  
  return (
    <StudentLayout>
      <MotionDiv initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-6">Complaint History</h1>
      
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search by ID or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            </div>
            <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ComplaintStatus | 'All')}
            className="bg-slate-800/50 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
            <option value="All">All Statuses</option>
            {Object.values(ComplaintStatus).map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
            </select>
        </div>
      </MotionDiv>
      
      <MotionDiv 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
      >
        {filteredComplaints.length > 0 ? filteredComplaints.map((c) => (
          <MotionDiv
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/50 p-5 rounded-xl border border-white/10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex gap-4 flex-grow">
                {c.imageUrl && <img src={c.imageUrl} alt="complaint" className="w-24 h-24 object-cover rounded-lg hidden sm:block" />}
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                    <p className="text-sm text-slate-400">ID: {c.id}</p>
                  </div>
                  <h3 className="text-lg font-semibold mt-2 text-white">{c.category}</h3>
                  <p className="text-sm text-slate-300 mt-1">{c.description}</p>
                </div>
              </div>
              <Link 
                to={`/student/complaint/${c.id}`}
                className="flex-shrink-0 mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-slate-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-slate-600"
              >
                  View Details <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2"><Calendar size={14} /> Submitted: {new Date(c.submittedAt).toLocaleDateString()}</div>
              {c.worker && <div className="flex items-center gap-2"><User size={14} /> Assigned: {c.worker.name}</div>}
            </div>
          </MotionDiv>
        )) : (
          <MotionDiv 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-white/10"
          >
            <p className="text-slate-400">No complaints match your filters.</p>
          </MotionDiv>
        )}
      </MotionDiv>
    </StudentLayout>
  );
};

export default ComplaintHistory;