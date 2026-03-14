import React from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  }[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
