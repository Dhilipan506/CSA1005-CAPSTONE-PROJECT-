import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, CheckSquare, Clock, Building, User } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const UpdateProgress: React.FC = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { getComplaintById, addProgressUpdate, students } = useComplaints();
  
  const complaint = complaintId ? getComplaintById(complaintId) : undefined;
  const student = complaint ? students.find(s => s.id === complaint.studentId) : undefined;
  
  const [updateText, setUpdateText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintId && updateText) {
      addProgressUpdate(complaintId, updateText);
      setUpdateText('');
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h1 className="text-2xl font-bold mb-2">Update Progress</h1>
            <p className="text-slate-400 mb-6">For complaint ID: {complaint.id}</p>
            
            <div className="mb-6 bg-slate-700/50 p-4 rounded-lg text-sm space-y-2">
                {student && (
                    <div className="flex items-start gap-4 pb-3 mb-3 border-b border-slate-600">
                        <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500 flex-shrink-0">
                            <User size={28} className="text-emerald-300" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-white">{student.name}</p>
                             <div className="flex items-center gap-2 text-slate-300 mt-1">
                                <Building size={14} /><span>Room: {student.roomNumber}</span>
                            </div>
                        </div>
                    </div>
                )}
                <p><strong className="text-slate-300">Worker:</strong> {complaint.worker?.name || 'Not Assigned'}</p>
                <p><strong className="text-slate-300">Status:</strong> {complaint.status}</p>
                <p><strong className="text-slate-300">Issue:</strong> {complaint.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="updateText" className="block text-sm font-medium text-slate-300 mb-2">New Progress Update</label>
                    <textarea
                        id="updateText"
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        rows={3}
                        required
                        className="block w-full text-sm text-white bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                        placeholder="e.g., 'Required parts have been ordered.'"
                    />
                </div>
                <MotionButton
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-teal-700"
                >
                    <Send size={16} /> Add Update
                </MotionButton>
            </form>
        </MotionDiv>

        <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-6">Progress Timeline</h2>
            <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-600"></div>
                <ul className="space-y-8">
                    {complaint.progressUpdates.map((update, index) => (
                        <li key={index} className="relative pl-12">
                            <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full ring-4 ring-slate-800">
                                {update.status.includes('Update') ? <CheckSquare size={16} className="text-teal-400"/> : <Clock size={16} className="text-yellow-400" />}
                            </div>
                            <p className="font-semibold text-white">{update.status}</p>
                            <p className="text-sm text-slate-300">{update.description}</p>
                            <p className="text-xs text-slate-500 mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </MotionDiv>
      </div>
    </WardenLayout>
  );
};

export default UpdateProgress;