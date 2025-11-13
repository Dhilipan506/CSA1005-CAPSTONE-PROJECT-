import React, { useState } from 'react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Student } from '../../types';
import { motion } from 'framer-motion';
import { User, Building, Phone, Mail, Edit, Save } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

// Fix: Assign motion component to a variable to help with type inference.
const MotionDiv = motion.div;

const StudentProfile: React.FC = () => {
    const { user } = useAuth();
    const { students, updateStudentProfile } = useComplaints();
    
    // Find the full student object from the context, which is the source of truth
    const studentUser = students.find(s => s.id === (user as Student).id) || user as Student;

    const [isEditing, setIsEditing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(studentUser.phoneNumber);

    const handleSave = () => {
        updateStudentProfile(studentUser.id, { phoneNumber });
        setIsEditing(false);
    };

    return (
        <StudentLayout>
            <MotionDiv 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
                <GlassCard className="p-8">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center border-4 border-emerald-500 mb-4">
                            <User size={48} className="text-emerald-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{studentUser.name}</h2>
                        <p className="text-slate-400">{studentUser.registerNumber}</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center bg-slate-700/50 p-3 rounded-lg">
                            <Mail className="w-5 h-5 mr-4 text-slate-400" />
                            <span className="text-slate-300">{studentUser.registerNumber}</span>
                        </div>
                        <div className="flex items-center bg-slate-700/50 p-3 rounded-lg">
                            <Building className="w-5 h-5 mr-4 text-slate-400" />
                            <span className="text-slate-300">Room: {studentUser.roomNumber}</span>
                        </div>
                        <div className="flex items-center bg-slate-700/50 p-3 rounded-lg justify-between">
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 mr-4 text-slate-400" />
                                {isEditing ? (
                                    <input 
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="bg-transparent focus:outline-none text-slate-200"
                                    />
                                ) : (
                                    <span className="text-slate-300">{studentUser.phoneNumber}</span>
                                )}
                            </div>
                            {isEditing ? (
                                <button onClick={handleSave} className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400">
                                    <Save size={18} />
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-sky-500/20 text-sky-400">
                                    <Edit size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </MotionDiv>
        </StudentLayout>
    );
};

export default StudentProfile;