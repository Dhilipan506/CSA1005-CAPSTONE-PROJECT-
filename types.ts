export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  roomNumber: string;
  phoneNumber: string;
}

export interface Warden {
  id: string;
  username: string;
  name: string;
}

export type User = (Student & { role: 'student' }) | (Warden & { role: 'warden' });

export enum ComplaintCategory {
  Water = 'Water',
  Electric = 'Electric',
  Cleaning = 'Cleaning',
  Damage = 'Damage',
  Other = 'Other',
}

export enum ComplaintStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export type ComplaintPriority = 'Low' | 'Medium' | 'High';

export interface ProgressUpdate {
  timestamp: string;
  status: string;
  description: string;
  author?: 'Student' | 'Warden';
}

export interface Worker {
  id: string;
  name: string;
  phoneNumber: string;
  specialty: ComplaintCategory;
  status: 'Available' | 'Busy';
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  studentRegisterNumber: string;
  roomNumber: string;
  phoneNumber: string;
  category: ComplaintCategory;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedAt: string;
  lastUpdatedAt: string;
  assignedWorkerId?: string;
  worker?: Worker;
  progressUpdates: ProgressUpdate[];
  rating?: number;
  feedback?: string;
}
export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}