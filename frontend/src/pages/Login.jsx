import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GridMotion from '../ui/GridMotion'; // Note the ../ because we are in the /pages folder now!

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // A mix of blank text nodes and some abstract tech images. 
  const gridItems = [
    'SYS.INIT', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', 'NODE_01', 'CONNECTION_ESTABLISHED', 
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', 'AWAITING_AUTH', 'DATA_STREAM_0',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'SECURE_CHANNEL', 'KERNEL_PANIC', 
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 'AUTH_REQUIRED', 'SYS.OVERRIDE', 'DB_SYNC',
  ];

  const handleAuth = (e) => {
    e.preventDefault(); // Stop the browser from reloading the page
    setIsAuthenticating(true);

    // Simulate a network request to Odoo (1.2 seconds) to look professional
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

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
          
          <form className="space-y-5" onSubmit={handleAuth}>
            <div>
              <input 
                type="email" 
                defaultValue="admin@nexuscore.com"
                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors" 
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <input 
                type="password" 
                defaultValue="odoo2026"
                className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#ccff00] transition-colors" 
                placeholder="Password"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-[#ccff00] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Login;
