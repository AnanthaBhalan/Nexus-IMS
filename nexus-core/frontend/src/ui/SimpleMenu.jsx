import React from 'react';

const SimpleMenu = ({ items, isOpen }) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}
      
      {/* Menu Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:h-auto`}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#ccff00] mb-6">Nexus IMS</h2>
          <nav className="space-y-2">
            {items.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default SimpleMenu;
