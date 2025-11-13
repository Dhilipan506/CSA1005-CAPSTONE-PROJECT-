import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus, Student, ComplaintPriority } from '../../types';
import { Search, ChevronDown, ChevronUp, X, CheckSquare, Clock, Building, Phone, User, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionTr = motion.tr;

const priorityConfig = {
    High: { icon: AlertTriangle, color: 'text-red-400', ring: 'ring-red-500/30' },
    Medium: { icon: AlertTriangle, color: 'text-yellow-400', ring: 'ring-yellow-500/30' },
    Low: { icon: AlertTriangle, color: 'text-sky-400', ring: 'ring-sky-500/30' }
};

const ComplaintDetailModal = ({ complaint, onClose, student }: { complaint: Complaint; onClose: () => void; student?: Student }) => {
  const { updateComplaintPriority } = useComplaints();

  const timelineVariants = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2
        }
      }
    };

    const timelineItemVariants = {
      hidden: { opacity: 0, x: -20 },
      show: { opacity: 1, x: 0 }
    };
  
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <MotionDiv
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">Complaint Details - {complaint.id}</h2>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            {student && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-emerald-400">Student Information</h3>
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500`}>
                            <User size={32} className="text-emerald-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-2"><User size={14} /><span>{student.name}</span></div>
                            <div className="flex items-center gap-2"><Building size={14} /><span>Room: {student.roomNumber}</span></div>
                            <div className="flex items-center gap-2"># <span>{student.registerNumber}</span></div>
                            <div className="flex items-center gap-2"><Phone size={14} /><span>{student.phoneNumber}</span></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-teal-400">Complaint Details</h3>
                <p><strong className="text-slate-400">Category:</strong> {complaint.category}</p>
                <p><strong className="text-slate-400">Description:</strong> {complaint.description}</p>
                {complaint.imageUrl && (
                    <div className="mt-3">
                        <a href={complaint.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-sky-400 hover:underline">
                            <ImageIcon size={14} /> View Attached Image
                        </a>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-yellow-400">Assigned Worker</h3>
                    {complaint.worker ? (
                        <div>
                            <p className="font-bold">{complaint.worker.name}</p>
                            <p className="text-sm text-slate-300">{complaint.worker.phoneNumber}</p>
                        </div>
                    ) : (
                        <p className="text-slate-400">No worker assigned yet.</p>
                    )}
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 text-green-400">Status</h3>
                    <p className="font-bold">{complaint.status}</p>
                    <p className="text-xs text-slate-400">Last updated: {new Date(complaint.lastUpdatedAt).toLocaleString()}</p>
                </div>
                 <div className="bg-slate-700/50 p-4 rounded-lg">
                    <label htmlFor="priority-select" className="font-semibold text-lg mb-3 text-red-400 block">Priority</label>
                    <select
                      id="priority-select"
                      value={complaint.priority}
                      onChange={e => updateComplaintPriority(complaint.id, e.target.value as ComplaintPriority)}
                      className="w-full bg-slate-700 border border-slate-600 rounded p-1 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-4 text-slate-300">Progress Timeline</h3>
                 <div className="relative border-l-2 border-slate-600 ml-4">
                    <MotionDiv variants={timelineVariants} initial="hidden" animate="show">
                      {complaint.progressUpdates.map((update, index) => (
                          <MotionDiv key={index} variants={timelineItemVariants} className="mb-6 ml-8">
                              <span className="absolute flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full -left-4 ring-4 ring-slate-800">
                                  {update.status.includes('Update') ? <CheckSquare size={16} className="text-teal-400" /> : <Clock size={16} className="text-yellow-400"/>}
                              </span>
                              <h4 className="font-semibold text-white">{update.status}</h4>
                              <p className="text-sm text-slate-300">{update.description}</p>
                              <p className="text-xs text-slate-500 mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                          </MotionDiv>
                      ))}
                    </MotionDiv>
                </div>
            </div>

        </div>
      </MotionDiv>
    </MotionDiv>
  );
};


const ViewComplaints: React.FC = () => {
  const navigate = useNavigate();
  const { complaints, students, updateComplaintStatus } = useComplaints();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Complaint; direction: 'asc' | 'desc' } | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const sortedComplaints = React.useMemo(() => {
    let sortableItems = [...complaints];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [complaints, sortConfig]);

  const requestSort = (key: keyof Complaint) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const filteredComplaints = sortedComplaints.filter(c => 
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortIcon = (key: keyof Complaint) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="inline ml-1 h-4 w-4" />;
    }
    return <ChevronDown className="inline ml-1 h-4 w-4" />;
  };

  return (
    <WardenLayout>
      <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>
      <div className="mb-6">
          <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
              <input
                  type="text"
                  placeholder="Search by Student, ID, or Room..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full max-w-sm pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
          </div>
      </div>
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('id')}>ID {getSortIcon('id')}</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('studentName')}>Student {getSortIcon('studentName')}</th>
                <th scope="col" className="px-6 py-3">Room</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('priority')}>Priority {getSortIcon('priority')}</th>
                <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('status')}>Status {getSortIcon('status')}</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => {
                // Fix: Assign the icon component to a variable with a PascalCase name
                // so that JSX can render it as a component.
                const PriorityIcon = priorityConfig[c.priority].icon;
                return (
                  <MotionTr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={c.id} 
                    className="border-b border-slate-700 hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4 font-medium text-white">{c.id}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                              <User size={18} className="text-slate-400" />
                           </div>
                           <div>
                              <div>{c.studentName}</div>
                              <div className="text-xs text-slate-400">{c.studentRegisterNumber}</div>
                           </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">{c.roomNumber}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-2 text-xs font-semibold ${priorityConfig[c.priority].color}`}>
                          <PriorityIcon size={14} />
                          {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={c.status}
                        onChange={e => updateComplaintStatus(c.id, e.target.value as ComplaintStatus)}
                        className="bg-slate-700 border border-slate-600 rounded p-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      >
                        {Object.values(ComplaintStatus).map(s => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 space-x-2 text-xs">
                      <button onClick={() => setSelectedComplaint(c)} className="bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold py-1.5 px-2 rounded transition-colors">Details</button>
                      <button onClick={() => navigate(`/warden/assign/${c.id}`)} className="bg-sky-600/80 hover:bg-sky-600 text-white font-bold py-1.5 px-2 rounded transition-colors">Assign</button>
                      <button onClick={() => navigate(`/warden/update/${c.id}`)} className="bg-teal-600/80 hover:bg-teal-600 text-white font-bold py-1.5 px-2 rounded transition-colors">Update</button>
                    </td>
                  </MotionTr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
          {selectedComplaint && (
              <ComplaintDetailModal 
                  complaint={selectedComplaint} 
                  onClose={() => setSelectedComplaint(null)} 
                  student={students.find(s => s.id === selectedComplaint.studentId)}
              />
          )}
      </AnimatePresence>
    </WardenLayout>
  );
};

export default ViewComplaints;