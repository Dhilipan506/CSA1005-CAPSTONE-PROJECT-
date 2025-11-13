
import React, { ReactNode } from 'react';

const AnimatedBackground: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-sky-500/30 bg-[length:200%_200%] animate-gradient-bg -z-10"></div>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-emerald-500/20 rounded-full filter blur-3xl opacity-40 animate-move-blob-1"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 md:w-96 md:h-96 bg-sky-500/20 rounded-full filter blur-3xl opacity-40 animate-move-blob-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 bg-teal-500/20 rounded-full filter blur-3xl opacity-40 animate-move-blob-3"></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;