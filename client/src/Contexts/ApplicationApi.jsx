import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/employee",
    headers: {
      "Content-Type": "application/json",
    },
  });

const handleError = (error) => {
    console.error("API call error:", error.response?.data || error.message);
    throw error;
};

export const getApplications = async () => {
  try {
    const response = await apiClient.get(`/applications`); // 假设的端点，需确认
    return response.data; // 期望返回 { applyDate, jobId, jobseekerId, status }
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
    const response = await apiClient.get("/bookmarks");
    return response.data; // Expecting a list of jobIds or job objects
  } catch (error) {
    handleError(error);
  }
};