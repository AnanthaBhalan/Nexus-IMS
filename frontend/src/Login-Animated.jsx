import React from 'react';
import GridMotion from './ui/GridMotion';

const LoginAnimated = () => {
  // A mix of blank text nodes and some abstract tech images.
  // NOTE: If you lose internet tomorrow, the images will just turn into blank dark squares,
  // which will STILL look cool and functional!
  const gridItems = [
    'SYS.INIT', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', 'NODE_01', 'CONNECTION_ESTABLISHED',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 'AWAITING_AUTH', 'DATA_STREAM_0',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'SECURE_CHANNEL', 'KERNEL_PANIC',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 'AUTH_REQUIRED', 'SYS.OVERRIDE', 'DB_SYNC',
    // ... it will automatically fill the rest with generic "Node X" text
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-sans text-white">

      {/* BACKGROUND: The React Bits Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-40">
        <GridMotion items={gridItems} gradientColor="#050505" />
      </div>

      {/* FOREGROUND: The Premium Login Card */}
      <div className="relative z-10 w-full max-w-md p-10">
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] shadow-2xl">

          <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center font-bold text-2xl mb-8">
            A.
          </div>

          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back.</h2>
          <p className="text-neutral-500 text-sm mb-8">Enter your credentials to access the system.</p>

          <form className="space-y-5">
            <div>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors"
                placeholder="Password"
              />
            </div>

            <button className="w-full bg-[#ccff00] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white transition-colors mt-4">
              Authenticate
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default LoginAnimated;
