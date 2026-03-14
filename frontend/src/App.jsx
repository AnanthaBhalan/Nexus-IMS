import React, { useState } from 'react';
import DashboardLayout from './Dashboard-Layout';
import LoginAnimated from './Login-Animated';
import FormValidationTemplate from './Form-Validation-Template';
import Home from './Home';

function App() {
  const [view, setView] = useState('home');

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Dev View Toggler */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 flex space-x-2">
        <button onClick={() => setView('home')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'home' ? 'bg-[#ccff00] text-black' : 'text-white hover:bg-white/10'}`}>Home</button>
        <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'dashboard' ? 'bg-[#ccff00] text-black' : 'text-white hover:bg-white/10'}`}>Dashboard</button>
        <button onClick={() => setView('login')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'login' ? 'bg-[#ccff00] text-black' : 'text-white hover:bg-white/10'}`}>Login</button>
        <button onClick={() => setView('form')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'form' ? 'bg-[#ccff00] text-black' : 'text-white hover:bg-white/10'}`}>Form</button>
      </div>

      {/* Render selected template */}
      <div className="w-full h-full">
        {view === 'home' && <Home />}
        {view === 'dashboard' && <DashboardLayout />}
        {view === 'login' && <LoginAnimated />}
        {view === 'form' && <FormValidationTemplate />}
      </div>
    </div>
  );
}

export default App;
