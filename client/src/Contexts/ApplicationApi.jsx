import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://3.106.192.156:8080/employee",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleError = (error) => {
  console.error("API call error:", error.response?.data || error.message);
  throw error;
};

export const updateProfile = async (jobSeekerId, profileData) => {
  try {
    const response = await apiClient.put(`/profile/${jobSeekerId}`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data; // Expecting a success message
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const getApplications = async () => {
  try {
    const jobSeekerId = localStorage.getItem("userId"); // 获取当前登录用户的 ID
    const response = await apiClient.get(`/applications`, {
      params: { jobSeekerId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


export const savePotentialJob = async (jobId) => {
  try {
    await apiClient.post("/bookmarks", { jobId });
  } catch (error) {
    handleError(error);
  }
};

export const removePotentialJob = async (jobId) => {
  try {
    await apiClient.delete(`/bookmarks/${jobId}`);
  } catch (error) {
    handleError(error);
  }
};

export const getPotentialJobs = async () => {
  try {
    const jobSeekerId = localStorage.getItem("userId"); // ✅ 假设这是 js005
    const response = await apiClient.get(`/bookmarks`, {
      params: { jobSeekerId }, // ✅ 传参
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

const hasAlreadyApplied = async () => {
  try {
    const response = await axios.get('http://3.106.192.156:8080/employee/applications', {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.some(app =>
      app.jobId === jobId && app.jobSeekerId === jsData.jobSeekerId
    );
  } catch (err) {
    console.error("Failed to check existing applications", err);
    return false; // 默认放行
  }
};


export const submitApplication = async (applicationData) => {
  try {
    const response = await apiClient.post('/applications', applicationData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (!response.data) {
      throw new Error('Failed to submit application');
    }

    return response.data; // Return the response data (e.g., application ID or confirmation)
  } catch (error) {
    console.error('API Error - submitApplication:', error);
    throw error;
  }
};