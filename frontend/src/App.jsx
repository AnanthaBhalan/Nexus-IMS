import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StaggeredMenu from './ui/StaggeredMenu';
import Toast from './ui/Toast';
import { healthCheck } from './api/api';
import SimpleMenu from './ui/SimpleMenu';
import { ToastProvider } from './ui/ToastContext';

// Page Placeholders (They will build these out next)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import NotFound from './pages/NotFound';

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

  const [menuOpen, setMenuOpen] = React.useState(typeof window !== 'undefined' && window.innerWidth >= 768);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {!isLoginPage && (
        <>
          {/* Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="fixed top-6 left-6 z-50 bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-colors md:hidden"
          >
            <div className="w-6 h-5 relative flex flex-col justify-center">
              <span className={`absolute h-0.5 w-full bg-[#ccff00] transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`h-0.5 w-full bg-[#ccff00] transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`absolute h-0.5 w-full bg-[#ccff00] transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>

          <SimpleMenu
            items={menuItems}
            isOpen={menuOpen}
          />
        </>
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
      <div className="transition-all duration-300 pl-4 md:pl-64">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;
