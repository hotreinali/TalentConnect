import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "../api/authApi";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuthUser({
          email: decoded.sub,
          role: decoded.roles?.[0] || "Unknown",
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error("JWT 解析失败:", err);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setAuthUser(null);
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await logoutUser(token);
      } catch (err) {
        console.error("登出失败", err);
      }
    }
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setAuthUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, authUser, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
