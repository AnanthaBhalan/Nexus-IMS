import React from 'react';
import SidebarNavigation from './Sidebar-Navigation';
import { ArrowUpRight, Plus, Activity } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#050505] bg-noise font-sans text-white selection:bg-[#ccff00] selection:text-black">
      <SidebarNavigation />
      
      {/* Main Content Area - Offset for the floating dock */}
      <div className="ml-36 p-10 max-w-7xl">
        
        {/* Minimalist Header */}
        <header className="flex justify-between items-end mb-16 mt-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-neutral-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00]"></span>
              System Active
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white mb-2">Metrics.</h1>
            <p className="text-neutral-500">Live data analytics and model performance.</p>
          </div>
          
          {/* Pill-shaped Action Button - The signature Dribbble look */}
          <button className="bg-[#ccff00] text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white transition-colors duration-300">
            <Plus size={18} strokeWidth={2.5} /> Deploy Model
          </button>
        </header>

        {/* Ultra-Clean Matte Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1 */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
            <div className="flex justify-between items-start mb-12">
              <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest">Total Volume</p>
              <ArrowUpRight size={20} className="text-[#ccff00] group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <p className="text-5xl font-light tracking-tighter text-white">2.4<span className="text-neutral-600">M</span></p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
            <div className="flex justify-between items-start mb-12">
              <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest">Latency</p>
              <ArrowUpRight size={20} className="text-neutral-600 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <p className="text-5xl font-light tracking-tighter text-white">12<span className="text-neutral-600">ms</span></p>
          </div>

          {/* Card 3 - Accent Card */}
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
            <div className="flex justify-between items-start mb-12">
              <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest">Accuracy</p>
              <div className="px-2 py-1 bg-white/5 rounded text-xs text-white border border-white/10">+0.4%</div>
            </div>
            <p className="text-5xl font-light tracking-tighter text-white">98.9<span className="text-neutral-600">%</span></p>
          </div>

        </div>

        {/* Main Data Area - Massive negative space */}
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl h-96 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                {/* Placeholder for where the 3D asset or complex chart would go */}
                <div className="w-[500px] h-[500px] border-[0.5px] border-white/20 rounded-full"></div>
                <div className="w-[300px] h-[300px] border-[0.5px] border-white/20 rounded-full absolute"></div>
            </div>
           <Activity size={40} className="mb-6 text-neutral-600 relative z-10" strokeWidth={1} />
           <p className="text-xl text-white font-medium relative z-10">Data Visualization</p>
           <p className="text-sm text-neutral-500 mt-2 relative z-10">Waiting for backend pipeline connection.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
