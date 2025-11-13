import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import StudentLayout from '../../components/layout/StudentLayout';
import { ComplaintCategory, Student } from '../../types';
import { motion } from 'framer-motion';
import { Upload, MessageSquare, List, Send } from 'lucide-react';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const NewComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const student = user as Student;

  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description) {
      alert('Please fill in all fields.');
      return;
    }

    addComplaint({
      studentId: student.id,
      studentName: student.name,
      studentRegisterNumber: student.registerNumber,
      roomNumber: student.roomNumber,
      phoneNumber: student.phoneNumber,
      category,
      description,
      imageUrl: imagePreview || undefined,
    });

    navigate('/student/dashboard');
  };

  return (
    <StudentLayout>
      <MotionDiv 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-6">Submit New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Room Number</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-slate-200">{student.roomNumber}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Register Number</label>
                <div className="bg-slate-700/50 rounded-lg p-3 text-slate-200">{student.registerNumber}</div>
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <div className="relative">
                <List className="absolute top-1/2 -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  required
                  className="block w-full pl-10 pr-4 py-3 text-sm text-white bg-transparent rounded-lg border border-white/30 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                >
                  <option value="" disabled className="bg-slate-800">Select a category</option>
                  {Object.values(ComplaintCategory).map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description of Problem</label>
              <div className="relative">
                <MessageSquare className="absolute top-4 left-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="block w-full pl-10 pr-4 py-3 text-sm text-white bg-transparent rounded-lg border border-white/30 appearance-none focus:outline-none focus:ring-0 focus:border-emerald-400"
                  placeholder="Describe the issue in detail..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Image (Proof of Issue)</label>
              <div 
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragEvents}
                onDrop={handleDrop}
                className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-md transition-colors duration-300 ${isDragging ? 'bg-slate-700/50 border-emerald-400' : ''}`}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg object-contain" />
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  )}
                  <div className="flex text-sm text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-700/50 rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-emerald-500 px-2">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileInputChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            <MotionButton
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16, 185, 129, 0.7)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500"
            >
              <Send size={18} />
              Submit Complaint
            </MotionButton>
          </form>
        </div>
      </MotionDiv>
    </StudentLayout>
  );
};

export default NewComplaint;