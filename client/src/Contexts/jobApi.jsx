import axios from "axios";

// ✅ 使用 employer API base URL
const apiClient = axios.create({
  baseURL: "http://localhost:8080/employer",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 错误处理器
const handleError = (error) => {
  console.error("API call error:", error.response?.data || error.message);
  throw error;
};

// ✅ 获取所有职位列表（用于 JobSearch 页面）
export const getAllJobs = async () => {
  try {
    const response = await apiClient.get("/jobs/all");
    return response.data; // 这是一个 Job 数组
  } catch (error) {
    handleError(error);
  }
};

// ✅ 获取单个职位详情（用于职位详情页或点击弹窗）
export const getJobDetail = async (id) => {
  try {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data.job; // 因为后端返回的是 { job: { ... } }
  } catch (error) {
    handleError(error);
  }
};