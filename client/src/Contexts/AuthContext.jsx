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
        const savedRole = localStorage.getItem("userRole") || decoded.roles?.[0] || "Unknown";
        const savedId = localStorage.getItem("userId") || null;

        setAuthUser({
          email: decoded.sub,
          role: savedRole,
          id: savedId,
        });
        setIsLoggedIn(true);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setAuthUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setAuthUser(null);
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await logoutUser(token);
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setAuthUser(null);
  };

  if (loading) return null; 

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, authUser, setAuthUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
