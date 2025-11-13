import React, { useState } from 'react';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { Worker, ComplaintCategory } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Phone, Wrench, X, Trash2 } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const AddWorkerModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (worker: Omit<Worker, 'id'>) => void }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [specialty, setSpecialty] = useState<ComplaintCategory>(ComplaintCategory.Other);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, phoneNumber, specialty, status: 'Available' });
        onClose();
    };

    return (
        <MotionDiv
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <MotionDiv
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Add New Worker</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <select value={specialty} onChange={e => setSpecialty(e.target.value as ComplaintCategory)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold">Add Worker</MotionButton>
                </form>
            </MotionDiv>
        </MotionDiv>
    );
};


const WorkerManagement: React.FC = () => {
    const { workers, addWorker } = useComplaints();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusColors = {
        Available: 'text-emerald-400',
        Busy: 'text-yellow-400',
    };

    return (
        <WardenLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Worker Management</h1>
                <MotionButton
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                    <Plus size={18} /> Add Worker
                </MotionButton>
            </div>
            <MotionDiv 
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Phone Number</th>
                                <th scope="col" className="px-6 py-3">Specialty</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map(worker => (
                                <tr key={worker.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center"><User size={18} /></div>
                                        {worker.name}
                                    </td>
                                    <td className="px-6 py-4"><Phone size={14} className="inline mr-2" />{worker.phoneNumber}</td>
                                    <td className="px-6 py-4"><Wrench size={14} className="inline mr-2" />{worker.specialty}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${statusColors[worker.status]}`}>{worker.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-red-500 hover:text-red-400"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </MotionDiv>
             <AnimatePresence>
                {isModalOpen && <AddWorkerModal onClose={() => setIsModalOpen(false)} onAdd={addWorker} />}
            </AnimatePresence>
        </WardenLayout>
    );
};

export default WorkerManagement;