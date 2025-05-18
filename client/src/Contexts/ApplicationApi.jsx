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

// export const submitApplication = async (applicationData) => {
//   try {
//     const response = await apiClient.get('/applications', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(applicationData)
//     });

//     if (!response.ok) {
//       throw new Error('Failed to subimit appl');
//     }
//   } catch (error) {
//     console.error('API Error - postJob:', error);
//     throw error;
//   }
// };

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