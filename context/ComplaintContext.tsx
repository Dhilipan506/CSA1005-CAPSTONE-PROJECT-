import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Complaint, ComplaintStatus, Worker, ProgressUpdate, Student, ComplaintPriority, ComplaintCategory, Announcement } from '../types';
import { mockWorkers, mockStudents, mockComplaints, mockAnnouncements } from '../services/mockApi';

interface ComplaintContextType {
  complaints: Complaint[];
  getComplaintsByStudent: (studentId: string) => Complaint[];
  getComplaintById: (id: string) => Complaint | undefined;
  addComplaint: (newComplaint: Omit<Complaint, 'id' | 'status' | 'submittedAt' | 'lastUpdatedAt' | 'progressUpdates' | 'priority'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus) => void;
  updateComplaintPriority: (id: string, priority: ComplaintPriority) => void;
  assignWorkerToComplaint: (id: string, workerId: string, instructions: string) => void;
  addProgressUpdate: (id: string, description: string) => void;
  submitFeedback: (id: string, rating: number, feedback: string) => void;
  students: Student[];
  workers: Worker[];
  announcements: Announcement[];
  addStudent: (studentData: Omit<Student, 'id'>) => Student;
  updateStudentProfile: (studentId: string, updates: Partial<Pick<Student, 'phoneNumber'>>) => void;
  addWorker: (workerData: Omit<Worker, 'id'>) => void;
  addAnnouncement: (title: string, content: string) => void;
  updateAnnouncement: (id: string, title: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const STUDENTS_STORAGE_KEY = 'hostel_students';
const WORKERS_STORAGE_KEY = 'hostel_workers';
const COMPLAINTS_STORAGE_KEY = 'hostel_complaints';
const ANNOUNCEMENTS_STORAGE_KEY = 'hostel_announcements';

export const ComplaintProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const storedComplaints = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
      if (storedComplaints) {
        const parsed = JSON.parse(storedComplaints);
        return parsed; 
      }
      return mockComplaints;
    } catch (error) {
      console.error("Failed to parse complaints from local storage", error);
      return [];
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const storedStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
      return storedStudents ? JSON.parse(storedStudents) : mockStudents;
    } catch (error) {
      console.error("Failed to parse students from local storage", error);
      return mockStudents;
    }
  });
  
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const storedWorkers = localStorage.getItem(WORKERS_STORAGE_KEY);
      return storedWorkers ? JSON.parse(storedWorkers) : mockWorkers;
    } catch (error) {
      console.error("Failed to parse workers from local storage", error);
      return mockWorkers;
    }
  });
  
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
      return storedAnnouncements ? JSON.parse(storedAnnouncements) : mockAnnouncements;
    } catch (error) {
      console.error("Failed to parse announcements from local storage", error);
      return mockAnnouncements;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save students to local storage", error);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(WORKERS_STORAGE_KEY, JSON.stringify(workers));
    } catch (error) {
      console.error("Failed to save workers to local storage", error);
    }
  }, [workers]);

  useEffect(() => {
    setComplaints(prevComplaints =>
      prevComplaints.map(c => ({
        ...c,
        worker: c.assignedWorkerId ? workers.find(w => w.id === c.assignedWorkerId) : undefined,
      }))
    );
  }, [workers]);


  useEffect(() => {
    try {
      const complaintsToStore = complaints.map(({ worker, ...rest }) => rest);
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaintsToStore));
    } catch (error) {
      console.error("Failed to save complaints to local storage", error);
    }
  }, [complaints]);
  
  useEffect(() => {
    try {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
    } catch (error) {
      console.error("Failed to save announcements to local storage", error);
    }
  }, [announcements]);

  const getComplaintsByStudent = (studentId: string) => {
    return complaints.filter(c => c.studentId === studentId);
  };

  const getComplaintById = (id: string) => {
    return complaints.find(c => c.id === id);
  };

  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: studentData.registerNumber,
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudentProfile = (studentId: string, updates: Partial<Pick<Student, 'phoneNumber'>>) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updates } : s));
  };

  const addWorker = (workerData: Omit<Worker, 'id'>) => {
      const newWorker: Worker = {
          ...workerData,
          id: `WKR${Date.now()}`
      };
      setWorkers(prev => [...prev, newWorker]);
  }

  const addComplaint = (newComplaintData: Omit<Complaint, 'id' | 'status' | 'submittedAt' | 'lastUpdatedAt' | 'progressUpdates' | 'priority'>) => {
    const now = new Date().toISOString();
    const newComplaint: Complaint = {
      ...newComplaintData,
      id: `C${Date.now()}`,
      status: ComplaintStatus.Pending,
      priority: 'Medium',
      submittedAt: now,
      lastUpdatedAt: now,
      progressUpdates: [{ timestamp: now, status: 'Submitted', description: 'Complaint submitted by student.' }],
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };
  
  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, lastUpdatedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus) => {
    const complaint = getComplaintById(id);
    if (!complaint) return;
    
    const progressUpdate: ProgressUpdate = {
        timestamp: new Date().toISOString(),
        status: status,
        description: `Status updated to ${status}.`
    }
    const updatedProgress = [...complaint.progressUpdates, progressUpdate];
    updateComplaint(id, { status, progressUpdates: updatedProgress });
  };
  
  const updateComplaintPriority = (id: string, priority: ComplaintPriority) => {
     updateComplaint(id, { priority });
  };

  const assignWorkerToComplaint = (id: string, workerId: string, instructions: string) => {
    const complaint = getComplaintById(id);
    if (!complaint) return;

    const worker = workers.find(w => w.id === workerId);
    const progressUpdate: ProgressUpdate = {
        timestamp: new Date().toISOString(),
        status: 'Assigned',
        description: `Assigned to ${worker?.name}. Instructions: ${instructions}`
    }
    const updatedProgress = [...complaint.progressUpdates, progressUpdate];
    updateComplaint(id, { assignedWorkerId: workerId, worker, status: ComplaintStatus.InProgress, progressUpdates: updatedProgress });
    setWorkers(prev => prev.map(w => w.id === workerId ? {...w, status: 'Busy'} : w));
  };

  const addProgressUpdate = (id: string, description: string) => {
    const complaint = getComplaintById(id);
    if (!complaint) return;
    
    const newUpdate: ProgressUpdate = {
        timestamp: new Date().toISOString(),
        status: 'Update',
        description: description
    };
    const updatedProgress = [...complaint.progressUpdates, newUpdate];
    updateComplaint(id, { progressUpdates: updatedProgress });
  };

  const submitFeedback = (id: string, rating: number, feedback: string) => {
    updateComplaint(id, { rating, feedback });
  };
  
  const addAnnouncement = (title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: `A${Date.now()}`,
      title,
      content,
      timestamp: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };
  
  const updateAnnouncement = (id: string, title: string, content: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, title, content, timestamp: new Date().toISOString() } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return (
    <ComplaintContext.Provider value={{
      complaints,
      getComplaintsByStudent,
      getComplaintById,
      addComplaint,
      updateComplaintStatus,
      updateComplaintPriority,
      assignWorkerToComplaint,
      addProgressUpdate,
      submitFeedback,
      students,
      updateStudentProfile,
      workers,
      announcements,
      addStudent,
      addWorker,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};