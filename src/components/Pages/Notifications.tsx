// src/components/Notifications.tsx
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications: React.FC = () => {
  // Simulate a notification for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Tienes un nuevo mensaje!");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
  );
};

export default Notifications;
