"use client";
import { useState, useEffect } from "react";
import { Alert } from "antd";

const NetworkStatus = () => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) return null;
  return (
    <Alert
      message="No connection to internet"
      description="Check your internet connection"
      type="error"
      showIcon
    />
  );
};

export default NetworkStatus;
