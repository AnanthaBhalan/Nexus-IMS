import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 max-w-sm`}>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose && onClose();
        }}
        className="ml-2 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;