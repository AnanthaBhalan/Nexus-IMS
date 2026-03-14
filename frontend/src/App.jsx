import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StaggeredMenu from './ui/StaggeredMenu';

// Page Placeholders (They will build these out next)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';

// Wrapper to conditionally hide the menu on the Login screen
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const menuItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Products', link: '/products' },
    { label: 'Receipts', link: '/receipts' },
    { label: 'Logout', link: '/' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {!isLoginPage && (
        <StaggeredMenu
          position="right"
          isFixed={true}
          items={menuItems}
          displayItemNumbering={true}
          accentColor="#ccff00"
          colors={['#111111', '#0A0A0A']}
        />
      )}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/receipts" element={<Receipts />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
