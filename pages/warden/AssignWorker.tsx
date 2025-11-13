import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { motion } from 'framer-motion';
import { User, MessageCircle, Send, ArrowLeft, Building, Phone, AlertTriangle } from 'lucide-react';
import { ComplaintPriority } from '../../types';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const AssignWorker: React.FC = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, workers, students, assignWorkerToComplaint, updateComplaintPriority } = useComplaints();
  
  const complaint = complaintId ? getComplaintById(complaintId) : undefined;
  const student = complaint ? students.find(s => s.id === complaint.studentId) : undefined;
  
  const [workerId, setWorkerId] = useState(complaint?.assignedWorkerId || '');
  const [instructions, setInstructions] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>(complaint?.priority || 'Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId && workerId) {
      updateComplaintPriority(complaintId, priority);
      assignWorkerToComplaint(complaintId, workerId, instructions);
      navigate('/warden/complaints');
    }
  };

  if (!complaint) {
    return (
      <WardenLayout>
        <h1 className="text-2xl font-bold">Complaint not found.</h1>
      </WardenLayout>
    );
  }

  return (
    <WardenLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6">
          <ArrowLeft size={18} />
          Back to complaints
      </button>

      <MotionDiv 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-2xl border border-slate-700"
      >
        <h1 className="text-3xl font-bold mb-2">Assign Worker</h1>
        <p className="text-slate-400 mb-6">For complaint ID: {complaint.id}</p>
        
        <div className="mb-6 bg-slate-700/50 p-4 rounded-lg">
             {student && (
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500 flex-shrink-0">
                        <User size={28} className="text-emerald-300" />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-white">{student.name}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-300 mt-1">
                            <span className="flex items-center gap-1.5"><Building size={14} />{student.roomNumber}</span>
                            <span className="flex items-center gap-1.5"><Phone size={14} />{student.phoneNumber}</span>
                        </div>
                    </div>
                </div>
            )}
            <p className="mt-2 pt-2 border-t border-slate-600"><strong className="text-slate-300">Issue:</strong> {complaint.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="worker" className="block text-sm font-medium text-slate-300 mb-2">Select Worker</label>
              <div className="relative">
                  <User className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <select
                      id="worker"
                      value={workerId}
                      onChange={(e) => setWorkerId(e.target.value)}
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm text-white bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                  >
                      <option value="" disabled className="bg-slate-800">Choose a worker</option>
                      {workers.map(w => (
                          <option key={w.id} value={w.id} className="bg-slate-800">{w.name} - {w.specialty}</option>
                      ))}
                  </select>
              </div>
            </div>
             <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2">Set Priority</label>
              <div className="relative">
                  <AlertTriangle className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                  <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                      required
                      className="block w-full pl-10 pr-4 py-3 text-sm text-white bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                  >
                      <option value="Low" className="bg-slate-800">Low</option>
                      <option value="Medium" className="bg-slate-800">Medium</option>
                      <option value="High" className="bg-slate-800">High</option>
                  </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-slate-300 mb-2">Work Instructions</label>
            <div className="relative">
                <MessageCircle className="absolute top-4 left-3 h-5 w-5 text-gray-400" />
                <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    className="block w-full pl-10 pr-4 py-3 text-sm text-white bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                    placeholder="e.g., 'Please fix the tap by end of day.'"
                />
            </div>
          </div>
          
          <MotionButton
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-sky-700"
          >
            <Send size={18} /> Assign & Update
          </MotionButton>
        </form>
      </MotionDiv>
    </WardenLayout>
  );
};

export default AssignWorker;