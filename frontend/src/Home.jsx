import React from 'react';
import GridMotion from './ui/GridMotion';
import StaggeredMenu from './ui/StaggeredMenu';

const Home = () => {
  // Navigation Data
  const menuItems = [
    { label: 'Dashboard', ariaLabel: 'Go to dashboard', link: '#' },
    { label: 'Models', ariaLabel: 'View AI Models', link: '#' },
    { label: 'Settings', ariaLabel: 'System Settings', link: '#' },
    { label: 'Logout', ariaLabel: 'End Session', link: '#' }
  ];

  const socialItems = [
    { label: 'Documentation', link: '#' },
    { label: 'GitHub Repo', link: '#' },
  ];

  // Grid Motion Background Data
  const gridItems = [
    'SYSTEM.ONLINE', 'NODE_ACTIVE', 'DATA_STREAM', 'AWAITING_INPUT',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    'LATENCY_12ms', 'KERNEL_OK'
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden font-sans text-white">

      {/* 1. THE NAVIGATION MENU */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        // Aesthetic Configuration:
        accentColor="#ccff00" // Electric Lime
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ccff00"
        colors={['#111111', '#0A0A0A']} // Matte dark gray pre-layers to match theme
        logoUrl="" // Leave blank, we will build a custom logo below
      />

      {/* Custom Brand Logo (Overrides the default image prop) */}
      <div className="absolute top-8 left-8 z-50 pointer-events-auto flex items-center gap-3">
         <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl">
           A.
         </div>
         <span className="font-bold tracking-widest uppercase text-sm">Nexus Core</span>
      </div>

      {/* 2. THE BACKGROUND */}
      {/* <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <GridMotion items={gridItems} gradientColor="#050505" />
      </div> */}

      {/* 3. THE HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-10 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-neutral-400 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse"></span>
          System initialized and ready for deployment.
        </div>

        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 leading-none">
          Build <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-600">Faster.</span>
        </h1>

        <p className="text-xl text-neutral-500 max-w-2xl font-light">
          A high-performance Odoo architecture designed for speed, scale, and uncompromising aesthetics.
        </p>

        <button className="mt-12 pointer-events-auto bg-[#ccff00] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
          Enter Dashboard
        </button>
      </div>

    </div>
  );
};

export default Home;