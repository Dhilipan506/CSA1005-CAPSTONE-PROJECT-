import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

// Fix: Assign motion component to a variable to help with type inference.
const MotionDiv = motion.div;

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg glow-border ${className}`}
    >
      {children}
    </MotionDiv>
  );
};

export default GlassCard;