import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import GlassCard from '../../components/ui/GlassCard';
import FloatingInput from '../../components/ui/FloatingInput';
import { User, Key, Building, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const StudentLogin: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { students, addStudent } = useComplaints();
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const registerNumber = formData.get('registerNumber') as string;
    // In a real app, password would be checked. Here we just check the reg number.
    const student = students.find(s => s.registerNumber === registerNumber);
    if (student) {
      login(student, 'student');
      navigate('/student/dashboard');
    } else {
      setError('Invalid register number or password.');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const registerNumber = formData.get('registerNumber') as string;
    const roomNumber = formData.get('roomNumber') as string;
    const phoneNumber = formData.get('phoneNumber') as string;

    if (!name || !registerNumber || !roomNumber || !phoneNumber) {
      setError('Please fill all fields.');
      return;
    }

    if (students.some(s => s.registerNumber === registerNumber)) {
      setError('A student with this register number already exists.');
      return;
    }

    const newStudent = addStudent({
      name,
      registerNumber,
      roomNumber,
      phoneNumber,
    });
    
    login(newStudent, 'student');
    navigate('/student/dashboard');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <AnimatedBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-center mb-2 tracking-wider drop-shadow-lg animated-gradient-text">Hostel Maintenance</h1>
            <p className="text-center text-emerald-300/80 mb-8">Your Campus Companion</p>
        </MotionDiv>
        
        <MotionDiv
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8, bounce: 0.4 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={isLoginView ? 'login' : 'register'}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-center text-white mb-2">
                  {isLoginView ? 'Student Login' : 'Student Registration'}
                </h2>
                <p className="text-center text-gray-300 mb-8">
                  {isLoginView ? 'Access your maintenance portal' : 'Create a new account'}
                </p>
                
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                
                {isLoginView ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <FloatingInput id="registerNumber" label="Register Number" Icon={User} name="registerNumber" type="text" required pattern="^\d{9}$" title="Register number must be 9 digits."/>
                    <FloatingInput id="password" label="Password" Icon={Key} name="password" type="password" required />
                    <MotionButton 
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(14, 165, 233, 0.7)' }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-sky-700"
                    >
                      Login as Student
                    </MotionButton>
                  </form>
                ) : (
                   <form onSubmit={handleRegister} className="space-y-4">
                    <FloatingInput id="reg-name" label="Name" Icon={User} name="name" type="text" required />
                    <FloatingInput id="reg-registerNumber" label="Register Number (9 digits)" Icon={Mail} name="registerNumber" type="text" required pattern="^\d{9}$" title="Register number must be 9 digits."/>
                    <FloatingInput id="reg-roomNumber" label="Room Number" Icon={Building} name="roomNumber" type="text" required />
                    <FloatingInput id="reg-phoneNumber" label="Phone Number" Icon={Phone} name="phoneNumber" type="tel" required />
                    <FloatingInput id="reg-password" label="Password" Icon={Key} name="password" type="password" required />
                    <MotionButton
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(16, 185, 129, 0.7)' }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-700"
                    >
                      Register
                    </MotionButton>
                  </form>
                )}
              </MotionDiv>
            </AnimatePresence>

            <div className="text-center mt-6">
              <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-sm text-teal-400 hover:underline">
                {isLoginView ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
              <div className="my-4 text-gray-400">or</div>
              <Link to="/warden/login" className="text-sm text-sky-400 hover:underline">
                Go to Warden Login
              </Link>
            </div>
          </GlassCard>
        </MotionDiv>
      </div>
    </AnimatedBackground>
  );
};

export default StudentLogin;