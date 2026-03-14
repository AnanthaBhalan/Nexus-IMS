import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SimpleMenu = ({ items, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (link) => {
    navigate(link);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden" />
      )}
      
      <div className={`fixed top-0 left-0 h-full bg-[#050505] border-r border-white/10 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 md:translate-x-0 md:shadow-xl`}>
      
      {/* Menu Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-[#ccff00]">NEXUS IMS</h2>
        <p className="text-xs text-neutral-500 mt-1">Inventory Management</p>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.link)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    isActive
                      ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span className="text-sm font-bold opacity-50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className="text-xs text-neutral-500 text-center">
          <p>© 2026 Nexus Core</p>
          <p className="mt-1">Hackathon Edition</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default SimpleMenu;
