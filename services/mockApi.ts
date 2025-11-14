import { Student, Warden, Worker, Complaint, ComplaintCategory, ComplaintStatus, Announcement } from '../types';

export const mockStudents: Student[] = [
    { id: '192411045', name: 'Gunasekar', registerNumber: '192411045', roomNumber: '509', phoneNumber: '9876543210' },
    { id: '192411046', name: 'Priya Sharma', registerNumber: '192411046', roomNumber: '302', phoneNumber: '9876543211' },
    { id: '192411047', name: 'Raj Patel', registerNumber: '192411047', roomNumber: '415', phoneNumber: '9876543212' },
    { id: '192411048', name: 'Anjali Singh', registerNumber: '192411048', roomNumber: '210', phoneNumber: '9876543213' },
    { id: '192411049', name: 'Vikram Reddy', registerNumber: '192411049', roomNumber: '501', phoneNumber: '9876543214' },
];

export const mockWardens: Warden[] = [
    { id: 'W01', username: 'warden1', name: 'Mr. Sharma' },
    { id: 'W02', username: 'warden2', name: 'Mrs. Gupta' },
];

export const mockWorkers: Worker[] = [
    { id: 'WKR01', name: 'Ramesh Kumar', phoneNumber: '9344349865', specialty: ComplaintCategory.Electric, status: 'Busy' },
    { id: 'WKR02', name: 'Suresh Singh', phoneNumber: '9876501234', specialty: ComplaintCategory.Cleaning, status: 'Available' },
    { id: 'WKR03', name: 'Anil Gupta', phoneNumber: '9123456789', specialty: ComplaintCategory.Water, status: 'Available' },
];

export const mockComplaints: Complaint[] = [
    {
        id: 'C01',
        studentId: '192411045',
        studentName: 'Gunasekar',
        studentRegisterNumber: '192411045',
        roomNumber: '509',
        phoneNumber: '9876543210',
        category: ComplaintCategory.Water,
        description: 'Shower tap is leaking continuously in the bathroom.',
        imageUrl: 'https://images.unsplash.com/photo-1587004276722-29737cc2e162?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
        status: ComplaintStatus.Pending,
        priority: 'High',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        progressUpdates: [
            { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Submitted', description: 'Complaint submitted by student.', author: 'Student' }
        ],
    },
    {
        id: 'C02',
        studentId: '192411047',
        studentName: 'Raj Patel',
        studentRegisterNumber: '192411047',
        roomNumber: '415',
        phoneNumber: '9876543212',
        category: ComplaintCategory.Electric,
        description: 'The fan in my room is not working. It makes a loud noise but doesn\'t rotate.',
        status: ComplaintStatus.InProgress,
        priority: 'Medium',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedWorkerId: 'WKR01',
        progressUpdates: [
            { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Submitted', description: 'Complaint submitted by student.', author: 'Student' },
            { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Assigned', description: 'Assigned to Ramesh Kumar. Instructions: Check fan motor.', author: 'Warden' }
        ],
    },
    {
        id: 'C03',
        studentId: '192411048',
        studentName: 'Anjali Singh',
        studentRegisterNumber: '192411048',
        roomNumber: '210',
        phoneNumber: '9876543213',
        category: ComplaintCategory.Cleaning,
        description: 'The corridor on the second floor has not been cleaned for three days.',
        status: ComplaintStatus.Completed,
        priority: 'Low',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        assignedWorkerId: 'WKR02',
        progressUpdates: [
            { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Submitted', description: 'Complaint submitted by student.', author: 'Student' },
            { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), status: 'Assigned', description: 'Assigned to Suresh Singh.', author: 'Warden' },
            { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Completed', description: 'Cleaning has been completed.', author: 'Warden' }
        ],
        rating: 4,
        feedback: "The cleaning was done well, but it took a bit long to get started.",
    },
     {
        id: 'C04',
        studentId: '192411046',
        studentName: 'Priya Sharma',
        studentRegisterNumber: '192411046',
        roomNumber: '302',
        phoneNumber: '9876543211',
        category: ComplaintCategory.Damage,
        description: 'Window pane is cracked and needs to be replaced.',
        status: ComplaintStatus.Pending,
        priority: 'Medium',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        progressUpdates: [
            { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Submitted', description: 'Complaint submitted by student.', author: 'Student' }
        ],
    },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'A01', title: 'Water Supply Interruption', content: 'There will be a temporary water supply interruption tomorrow from 10 AM to 12 PM for pipeline maintenance.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'A02', title: 'Monthly Pest Control', content: 'The monthly pest control service is scheduled for this Saturday. Please ensure your rooms are accessible.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'A03', title: 'Wi-Fi Network Upgrade', content: 'The hostel Wi-Fi network will be upgraded on Friday night. Expect intermittent connectivity issues between 1 AM and 4 AM.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];