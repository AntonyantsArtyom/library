import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AUTH_EVENT, getAdminPassword } from "../../api";
import { AdminLogin } from "./AdminLogin";

export const ProtectedRoute = () => {
  const [authed, setAuthed] = useState(() => Boolean(getAdminPassword()));

  useEffect(() => {
    const handleAuthChange = () => setAuthed(Boolean(getAdminPassword()));
    window.addEventListener(AUTH_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_EVENT, handleAuthChange);
  }, []);

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return <Outlet />;
};
