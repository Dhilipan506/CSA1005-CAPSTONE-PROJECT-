import React, { useState } from 'react';
import WardenLayout from '../../components/layout/WardenLayout';
import { useComplaints } from '../../context/ComplaintContext';
import { Announcement } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit, Trash2 } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const AnnouncementModal = ({
  onClose,
  onSave,
  announcement,
}: {
  onClose: () => void;
  onSave: (id: string | null, title: string, content: string) => void;
  announcement: Announcement | null;
}) => {
    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(announcement?.id || null, title, content);
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
                className="relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">{announcement ? 'Edit' : 'Create'} Announcement</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required rows={5} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md font-semibold">Save Announcement</MotionButton>
                </form>
            </MotionDiv>
        </MotionDiv>
    );
};


const AnnouncementsManagement: React.FC = () => {
    const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useComplaints();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    const handleSave = (id: string | null, title: string, content: string) => {
        if (id) {
            updateAnnouncement(id, title, content);
        } else {
            addAnnouncement(title, content);
        }
    };
    
    const openModal = (announcement: Announcement | null = null) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    return (
        <WardenLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Announcements</h1>
                <MotionButton
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold"
                >
                    <Plus size={18} /> New Announcement
                </MotionButton>
            </div>
            <MotionDiv 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
            >
                {announcements.map(ann => (
                    <MotionDiv
                        key={ann.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-white">{ann.title}</h3>
                            <p className="text-sm text-slate-300 mt-2">{ann.content}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                            <p className="text-xs text-slate-500">{new Date(ann.timestamp).toLocaleDateString()}</p>
                            <div className="space-x-2">
                                <button onClick={() => openModal(ann)} className="p-2 text-sky-400 hover:bg-sky-500/20 rounded-full"><Edit size={16} /></button>
                                <button onClick={() => deleteAnnouncement(ann.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </MotionDiv>
                ))}
                 {announcements.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-800/50 rounded-xl border border-dashed border-white/10">
                        <p className="text-slate-400">No announcements posted yet.</p>
                    </div>
                )}
            </MotionDiv>
             <AnimatePresence>
                {isModalOpen && <AnnouncementModal onClose={() => setIsModalOpen(false)} onSave={handleSave} announcement={selectedAnnouncement}/>}
            </AnimatePresence>
        </WardenLayout>
    );
};

export default AnnouncementsManagement;