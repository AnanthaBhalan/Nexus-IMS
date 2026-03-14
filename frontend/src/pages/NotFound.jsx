import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ccff00]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-8 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        
        <h1 className="text-7xl font-bold tracking-tighter text-white mb-4">404</h1>
        <h2 className="text-2xl font-medium text-neutral-300 mb-4 tracking-tight">Sector Not Found</h2>
        <p className="text-neutral-500 mb-10 text-sm leading-relaxed">
          The module or data you are looking for does not exist in the current Nexus Core database, or you lack the required clearance.
        </p>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-transparent border border-[#ccff00]/50 text-[#ccff00] hover:bg-[#ccff00]/10 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 w-full group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
