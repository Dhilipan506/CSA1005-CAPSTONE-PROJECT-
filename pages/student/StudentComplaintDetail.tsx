import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus } from '../../types';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Calendar, User, CheckSquare, Clock, ArrowLeft, Send, Shield } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionUl = motion.ul;
const MotionLi = motion.li;
const MotionButton = motion.button;

const Rating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                className={`transition-all duration-200 ${
                  ratingValue <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
                } hover:scale-125`}
              />
            </button>
          );
        })}
      </div>
    );
};

const StudentComplaintDetail: React.FC = () => {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const { getComplaintById, submitFeedback } = useComplaints();
    
    const complaint = complaintId ? getComplaintById(complaintId) : undefined;

    const [rating, setRating] = useState(complaint?.rating || 0);
    const [feedback, setFeedback] = useState(complaint?.feedback || '');

    if (!complaint) {
        return <StudentLayout><div>Complaint not found</div></StudentLayout>;
    }
    
    const statusColors: { [key in ComplaintStatus]: string } = {
        [ComplaintStatus.Pending]: 'bg-yellow-500/20 text-yellow-400',
        [ComplaintStatus.InProgress]: 'bg-sky-500/20 text-sky-400',
        [ComplaintStatus.Completed]: 'bg-emerald-500/20 text-emerald-400',
    };
    
    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            submitFeedback(complaint.id, rating, feedback);
            navigate('/student/history');
        } else {
            alert("Please provide a rating.");
        }
    }

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
        <StudentLayout>
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6">
                <ArrowLeft size={18} />
                Back to History
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <MotionDiv initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-white/10 shadow-lg">
                     <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-700">
                        <div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[complaint.status]}`}>{complaint.status}</span>
                            <h1 className="text-3xl font-bold mt-2 text-white">{complaint.category}</h1>
                            <p className="text-sm text-slate-400 mt-1">ID: {complaint.id}</p>
                        </div>
                        <div className="text-sm text-slate-400 text-left sm:text-right">
                            <p className="flex items-center gap-2"><Calendar size={14} /> Submitted: {new Date(complaint.submittedAt).toLocaleString()}</p>
                            <p className="flex items-center gap-2"><Clock size={14} /> Last Updated: {new Date(complaint.lastUpdatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2 text-teal-400">Description</h3>
                            <p className="text-slate-300">{complaint.description}</p>
                        </div>
                         {complaint.imageUrl && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2 text-teal-400">Attached Image</h3>
                                <img src={complaint.imageUrl} alt="complaint proof" className="max-w-xs rounded-lg border-2 border-slate-700"/>
                            </div>
                        )}
                         <div>
                            <h3 className="font-semibold text-lg mb-2 text-teal-400">Assigned Worker</h3>
                            {complaint.worker ? (
                                <div className="flex items-center gap-2 text-slate-300">
                                    <User size={16} />
                                    <span>{complaint.worker.name} - {complaint.worker.phoneNumber}</span>
                                </div>
                            ) : (
                                <p className="text-slate-400">Waiting for a worker to be assigned.</p>
                            )}
                        </div>
                    </div>
                </MotionDiv>
                 <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 bg-slate-800/50 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">Progress Timeline</h2>
                    <div className="relative">
                        <MotionUl variants={timelineVariants} initial="hidden" animate="show" className="space-y-0">
                            {complaint.progressUpdates.map((update, index) => (
                                <MotionLi key={index} variants={timelineItemVariants} className="relative pl-12 pb-8 last:pb-0">
                                     {index < complaint.progressUpdates.length - 1 && (
                                        <div className="absolute left-4 top-10 h-full w-0.5 bg-slate-600"></div>
                                     )}
                                    <div className="absolute left-0 top-1 flex items-center justify-center w-8 h-8 bg-slate-700 rounded-full ring-4 ring-slate-800">
                                        {update.author === 'Warden' 
                                            ? <Shield size={16} className="text-teal-400" /> 
                                            : <User size={16} className="text-emerald-400" />}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-white">{update.status}</p>
                                        {update.author && <span className={`px-2 py-0.5 text-xs rounded-full ${update.author === 'Warden' ? 'bg-teal-500/20 text-teal-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                            {update.author}
                                        </span>}
                                    </div>
                                    <p className="text-sm text-slate-300 mt-1">{update.description}</p>
                                    <p className="text-xs text-slate-500 mt-2">{new Date(update.timestamp).toLocaleString()}</p>
                                </MotionLi>
                            ))}
                        </MotionUl>
                    </div>
                </MotionDiv>
            </div>
            
             {complaint.status === ComplaintStatus.Completed && (
                <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-slate-800/50 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Leave Feedback</h2>
                    <p className="text-slate-400 mb-6">Your feedback helps us improve our service.</p>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
                            <Rating rating={rating} setRating={setRating} />
                        </div>
                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium text-slate-300 mb-2">Comments (Optional)</label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                rows={3}
                                className="block w-full text-sm text-white bg-transparent rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                                placeholder="Tell us about your experience..."
                            />
                        </div>
                        <MotionButton
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!!complaint.rating}
                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                           <Send size={16} /> {complaint.rating ? 'Feedback Submitted' : 'Submit Feedback'}
                        </MotionButton>
                    </form>
                </MotionDiv>
            )}
        </StudentLayout>
    );
};

export default StudentComplaintDetail;