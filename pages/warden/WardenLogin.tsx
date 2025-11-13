import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/ui/AnimatedBackground';
import GlassCard from '../../components/ui/GlassCard';
import FloatingInput from '../../components/ui/FloatingInput';
import { User, Key, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Assign motion components to variables to help with type inference.
const MotionDiv = motion.div;
const MotionButton = motion.button;

const WardenLogin: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  const { login, wardens, addWarden } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    // Password check is mocked
    const warden = wardens.find(w => w.username === username);
    if (warden) {
      login(warden, 'warden');
      navigate('/warden/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const username = formData.get('username') as string;

    if (!name || !username) {
      setError('Please fill all fields.');
      return;
    }
    if (wardens.some(w => w.username === username)) {
      setError('This username is already taken.');
      return;
    }
    const newWarden = addWarden({ name, username });
    login(newWarden, 'warden');
    navigate('/warden/dashboard');
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
            <p className="text-center text-teal-300/80 mb-8">Warden Administration Portal</p>
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
                  {isLoginView ? 'Warden Login' : 'Warden Registration'}
                </h2>
                <p className="text-center text-gray-300 mb-8">
                  {isLoginView ? 'Access the admin dashboard' : 'Create a new warden account'}
                </p>
                
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                
                {isLoginView ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <FloatingInput id="username" label="Username" Icon={Shield} name="username" type="text" required />
                    <FloatingInput id="password" label="Password" Icon={Key} name="password" type="password" required />
                    <MotionButton 
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(20, 184, 166, 0.7)' }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-teal-700"
                    >
                      Login as Warden
                    </MotionButton>
                  </form>
                ) : (
                   <form onSubmit={handleRegister} className="space-y-4">
                    <FloatingInput id="reg-name" label="Full Name" Icon={User} name="name" type="text" required />
                    <FloatingInput id="reg-username" label="Username" Icon={Shield} name="username" type="text" required />
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
                {isLoginView ? 'Create a warden account' : 'Already have an account? Login'}
              </button>
              <div className="my-4 text-gray-400">or</div>
              <Link to="/student/login" className="text-sm text-emerald-400 hover:underline">
                Go to Student Login
              </Link>
            </div>
          </GlassCard>
        </MotionDiv>
      </div>
    </AnimatedBackground>
  );
};

export default WardenLogin;