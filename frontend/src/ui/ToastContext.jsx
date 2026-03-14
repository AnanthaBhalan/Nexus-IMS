import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function that anyone in the app can call to show a popup
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* This renders the actual floating popups */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transition-all duration-300 animate-slide-down ${
              toast.type === 'success' 
                ? 'bg-[#ccff00] text-black shadow-[0_0_20px_rgba(204,255,0,0.3)]' 
                : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
