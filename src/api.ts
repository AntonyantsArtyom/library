export const API_BASE = "http://localhost:3000";

export const ADMIN_SESSION_KEY = "adminPassword";
export const AUTH_EVENT = "admin-auth-change";

export const getAdminPassword = (): string => sessionStorage.getItem(ADMIN_SESSION_KEY) || "";

export const adminHeaders = (): HeadersInit => ({
  "x-admin-password": getAdminPassword(),
});

export const setAdminSession = (password: string | null) => {
  if (password) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, password);
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
};
