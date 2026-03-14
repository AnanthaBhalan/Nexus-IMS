import React from 'react';
import { Home, Grid, Settings, Cpu } from 'lucide-react';

const SidebarNavigation = () => {
  return (
    <div className="fixed left-6 top-6 bottom-6 w-20 bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 rounded-[2rem] flex flex-col items-center py-8 z-20">
      {/* Brand Icon */}
      <div className="w-10 h-10 bg-[#0A0A0A] text-white rounded-full flex items-center justify-center font-bold text-xl mb-12 border border-white/10">
        A.
      </div>
      
      {/* Nav Links */}
      <nav className="flex-1 space-y-8">
        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white transition-all">
          <Home size={20} strokeWidth={1.5} />
        </a>
        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
          <Grid size={20} strokeWidth={1.5} />
        </a>
        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-500 hover:text-white hover:bg-white/5 transition-all">
          <Cpu size={20} strokeWidth={1.5} />
        </a>
      </nav>
      
      {/* Settings / Bottom */}
      <div className="mt-auto">
        <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-500 hover:text-white transition-all">
          <Settings size={20} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
};

export default SidebarNavigation;
