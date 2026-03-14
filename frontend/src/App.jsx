import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StaggeredMenu from './ui/StaggeredMenu';
import Toast from './ui/Toast';
import { healthCheck } from './api/api';

// Page Placeholders (They will build these out next)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';

// Wrapper to conditionally hide the menu on the Login screen
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  const [backendOnline, setBackendOnline] = React.useState(null);
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        const isHealthy = await healthCheck();
        setBackendOnline(isHealthy);
        if (isHealthy) {
          console.log('✅ Backend health check passed!');
        } else {
          console.error('❌ Backend health check failed!');
          setShowToast(true);
        }
      } catch (error) {
        console.error('❌ Backend health check failed:', error);
        setBackendOnline(false);
        setShowToast(true);
      }
    };

    checkBackend();
  }, []);

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

      {showToast && backendOnline === false && (
        <Toast
          message="Backend Offline - Please check if the server is running"
          type="error"
          onClose={() => setShowToast(false)}
          duration={0} // Don't auto-close error toasts
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
