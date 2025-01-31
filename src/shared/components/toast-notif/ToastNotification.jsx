import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ToastNotification = ({ message, type }) => {
  React.useEffect(() => {
    if (message && type) {
      toast[type](message, {
        position: "top-right",
        autoClose: 3000, // Auto close after 3 seconds
      });
    }
  }, [message, type]); // Runs every time message or type changes

  return <ToastContainer />;
};

export default ToastNotification;
