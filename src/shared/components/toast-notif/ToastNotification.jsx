import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { theme } from '@shared/index';
import 'react-toastify/dist/ReactToastify.css';

const toastStyles = {
  success: {
    background: 'rgba(52, 199, 89, 0.95)',
    color: '#ffffff',
    icon: <CheckCircle size={20} strokeWidth={2.5} />,
    progress: '#ffffff'
  },
  error: {
    background: 'rgba(255, 59, 48, 0.95)',
    color: '#ffffff',
    icon: <AlertCircle size={20} strokeWidth={2.5} />,
    progress: '#ffffff'
  },
  info: {
    background: 'rgba(0, 122, 255, 0.95)',
    color: '#ffffff',
    icon: <Info size={20} strokeWidth={2.5} />,
    progress: '#ffffff'
  },
  warning: {
    background: 'rgba(255, 149, 0, 0.95)',
    color: '#ffffff',
    icon: <AlertTriangle size={20} strokeWidth={2.5} />,
    progress: '#ffffff'
  }
};

const CloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    className="self-center opacity-70 hover:opacity-100 transition-all duration-200 ml-3"
    style={{ padding: '6px' }}
  >
    <X size={16} strokeWidth={2.5} />
  </button>
);

const ToastContent = ({ message, type }) => (
  <div className="flex items-center gap-3 px-1">
    <div className="flex-shrink-0">
      {toastStyles[type].icon}
    </div>
    <span className="flex-1 font-medium text-sm truncate">
      {message}
    </span>
  </div>
);

// Toast configuration
const toastConfig = (type) => ({
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: CloseButton,
  style: {
    background: toastStyles[type].background,
    color: toastStyles[type].color,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  progressClassName: 'toastProgress',
  bodyClassName: 'toastBody',
  className: 'toast'
});

const Notif = ({ message, type }) => {
  React.useEffect(() => {
    if (message && type && toastStyles[type]) {
      toast(<ToastContent message={message} type={type} />, toastConfig(type));
    }
  }, [message, type]);

  return (
    <>
      <style>
        {`
          .Toastify__toast-container {
            padding: 0;
            width: auto;
            max-width: 380px;
          }

          .toast {
            margin: 8px;
            padding: 12px 16px;
            border-radius: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-height: 54px;
            overflow: hidden;
          }
          
          .toastBody {
            padding: 0;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .toastProgress {
            height: 3px !important;
            opacity: 0.7 !important;
            background-color: #ffffff !important;
            box-shadow: none !important;
            background-image: none !important;
            transition: none !important;
          }

          .Toastify__progress-bar,
          .Toastify__progress-bar--animated,
          .Toastify__progress-bar-theme--light,
          .Toastify__progress-bar-theme--dark {
            background: #ffffff !important;
            background-image: none !important;
          }
          
          .Toastify__close-button {
            opacity: 0.7;
            transition: all 0.2s ease;
            align-self: center;
          }
          
          .Toastify__close-button:hover {
            opacity: 1;
          }
          
          @keyframes smoothSlideDown {
            from {
              transform: translateY(-120%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes smoothSlideUp {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(-120%);
              opacity: 0;
            }
          }
          
          .Toastify__toast--enter {
            animation: smoothSlideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          
          .Toastify__toast--exit {
            animation: smoothSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @media (prefers-color-scheme: dark) {
            .toast {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
          }

          @media (max-width: 480px) {
            .Toastify__toast-container {
              width: calc(100vw - 32px);
              margin: 16px;
            }
          }
        `}
      </style>
      <ToastContainer 
        limit={3}
        newestOnTop
        pauseOnFocusLoss={false}
      />
    </>
  );
};

// Export toast functions
export const showToast = {
  success: (message) => toast(<ToastContent message={message} type="success" />, toastConfig('success')),
  error: (message) => toast(<ToastContent message={message} type="error" />, toastConfig('error')),
  info: (message) => toast(<ToastContent message={message} type="info" />, toastConfig('info')),
  warning: (message) => toast(<ToastContent message={message} type="warning" />, toastConfig('warning'))
};

export default Notif;