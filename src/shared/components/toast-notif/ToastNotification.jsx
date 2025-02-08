import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Palette } from '@shared/components/ui/colors';
import 'react-toastify/dist/ReactToastify.css';

const toastStyles = {
  success: {
    background: Palette.success.main,
    color: '#ffffff',
    icon: <CheckCircle size={20} />,
    progress: '#ffffff'
  },
  error: {
    background: Palette.error.main,
    color: '#ffffff',
    icon: <AlertCircle size={20} />,
    progress: '#ffffff'
  },
  info: {
    background: Palette.primary.main,
    color: '#ffffff',
    icon: <Info size={20} />,
    progress: '#ffffff'
  },
  warning: {
    background: Palette.warning.main,
    color: '#ffffff',
    icon: <AlertTriangle size={20} />,
    progress: '#ffffff'
  }
};

// Custom close button
const CloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    className="self-center opacity-70 hover:opacity-100 transition-opacity ml-5"
  >
    <X size={18} />
  </button>
);

// Custom toast content
const ToastContent = ({ message, type }) => (
  <div className="flex items-center gap-3">
    {toastStyles[type].icon}
    <span className="flex-1">{message}</span>
  </div>
);

const ToastNotification = ({ message, type }) => {
  React.useEffect(() => {
    if (message && type && toastStyles[type]) {
      toast(
        <ToastContent message={message} type={type} />,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: CloseButton,
          style: {
            background: toastStyles[type].background,
            color: toastStyles[type].color,
          },
          progressStyle: {
            background: toastStyles[type].progress,
          }
        }
      );
    }
  }, [message, type]);

  return (
    <>
      <style>
        {`
          .Toastify__toast {
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          
          .Toastify__toast-body {
            padding: 0;
            margin: 0;
          }

          .Toastify__progress-bar {
            height: 4px;
            opacity: 1;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 0 0 8px 8px;
            background: #ffffff !important;
            background-image: none !important;
          }
          
          .Toastify__progress-bar--animated {
            background: #ffffff !important;
            background-image: none !important;
          }
          
          .Toastify__progress-bar-theme--light,
          .Toastify__progress-bar-theme--dark {
            background: #ffffff !important;
            background-image: none !important;
          }
          
          .Toastify__close-button {
            padding: 0;
            margin-left: 12px;
            color: inherit;
            align-self: center;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
          
          .Toastify__toast--enter {
            animation: slideIn 0.2s ease forwards;
          }
          
          .Toastify__toast--exit {
            animation: slideOut 0.2s ease forwards;
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

// Helper functions to show notifications
export const showToast = {
  success: (message) => toast(<ToastContent message={message} type="success" />, {
    position: "top-right",
    autoClose: 3000,
    style: { background: toastStyles.success.background, color: toastStyles.success.color },
    progressStyle: { background: toastStyles.success.progress },
    closeButton: CloseButton
  }),
  error: (message) => toast(<ToastContent message={message} type="error" />, {
    position: "top-right",
    autoClose: 3000,
    style: { background: toastStyles.error.background, color: toastStyles.error.color },
    progressStyle: { background: toastStyles.error.progress },
    closeButton: CloseButton
  }),
  info: (message) => toast(<ToastContent message={message} type="info" />, {
    position: "top-right",
    autoClose: 3000,
    style: { background: toastStyles.info.background, color: toastStyles.info.color },
    progressStyle: { background: toastStyles.info.progress },
    closeButton: CloseButton
  }),
  warning: (message) => toast(<ToastContent message={message} type="warning" />, {
    position: "top-right",
    autoClose: 3000,
    style: { background: toastStyles.warning.background, color: toastStyles.warning.color },
    progressStyle: { background: toastStyles.warning.progress },
    closeButton: CloseButton
  })
};

export default ToastNotification;