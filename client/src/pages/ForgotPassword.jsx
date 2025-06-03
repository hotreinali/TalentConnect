import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.put("http://3.106.192.156:8080/auth/reset-password", {
        email,
        newPassword,
      });

      toast.success("Password reset successful! Redirecting to login...");
      toast.info("Please log in with your new credentials");
      setTimeout(() => navigate("/login"), 1500); // 1.5秒后跳转
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mb-3 p-2 w-full border rounded"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="mb-3 p-2 w-full border rounded"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="mb-3 p-2 w-full border rounded"
        />

        <button
          onClick={resetPassword}
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
