import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobSeekerId: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    email: "",
    desiredRoles: "",
    preference: "",
    resumeId: "",
    workingExperience: "",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://3.106.192.156:8080/employee/profile/${userId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userRole === "JobSeeker" && userId) {
      fetchProfile();
    } else {
      toast.error("Invalid user or role");
      setLoading(false);
    }
  }, [token, userId, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://3.106.192.156:8080/employee/profile/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    navigate("/job-search");
  };

  return (
    <>
      <section className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center border-b pb-4 mb-4">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-600">
              {formData.firstName
                ? formData.firstName.charAt(0).toUpperCase()
                : "J"}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {formData.firstName || "Job"} {formData.lastName || "Seeker"}
              </h1>

              <p className="text-gray-600">
                {formData.email || "email@example.com"}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "firstName",
              "lastName",
              "email",
              "phoneNo",
              "desiredRoles",
              "preference",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  readOnly={field === "email"}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 ${field === "email"
                    ? "bg-gray-100 cursor-not-allowed text-gray-500"
                    : "border border-gray-300"
                    }`}
                />
              </div>
            ))}
          </div>

          {/* Working Experience */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Working Experience
            </label>
            <input
              type="text"
              name="workingExperience"
              value={formData.workingExperience}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g., 10 years experience in Full Stack Development"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Profile Updating Message*/}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default EmployeeProfile;
