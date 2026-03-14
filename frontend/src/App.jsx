import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StaggeredMenu from './ui/StaggeredMenu';
import Toast from './ui/Toast';
import { healthCheck, getProducts } from './api/api';
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
  const [products, setProducts] = React.useState([]);

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

  React.useEffect(() => {
    // Load the initial hardcoded list once
    const loadData = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    loadData();
  }, []);

  // Shared function to update stock from ANY page
  const updateStock = (productName, quantityChange) => {
    setProducts(prev => prev.map(p => 
      p.name === productName 
        ? { ...p, stock_available: p.stock_available + quantityChange, lastUpdated: true } 
        : { ...p, lastUpdated: false }
    ));
  };

  const menuItems = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Products', link: '/products' },
    { label: 'Receipts', link: '/receipts' },
    { label: 'Logout', link: '/' }
  ];

  const [menuOpen, setMenuOpen] = React.useState(typeof window !== 'undefined' && window.innerWidth >= 768);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {!isLoginPage && <SimpleMenu items={menuItems} isOpen={menuOpen} />}

      {showToast && backendOnline === false && (
        <Toast
          message="Backend Offline - Please check if the server is running"
          type="error"
          onClose={() => setShowToast(false)}
          duration={0} // Don't auto-close error toasts
        />
      )}

      {/* The main content area should only have ONE Routes block */}
      <div className={`transition-all duration-300 ${!isLoginPage ? 'pl-4 md:pl-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products products={products} />} />
          <Route path="/receipts" element={<Receipts products={products} onUpdateStock={updateStock} />} />
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
