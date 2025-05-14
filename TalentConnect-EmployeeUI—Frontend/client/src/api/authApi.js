import axios from "axios";

const authClient = axios.create({
  baseURL: "http://localhost:8080/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 拦截器：附加 Authorization token
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleError = (error) => {
  console.error("Auth API Error:", error.response?.data || error.message);
  throw error;
};

export const registerUser = async (formData) => {
  try {
    const { email, password, role } = formData;
    const response = await authClient.post("/register", {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (formData) => {
  try {
    const { email, password } = formData;
    const response = await authClient.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logoutUser = async (token) => {
  try {
    await authClient.post("/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleError(error);
  }
};