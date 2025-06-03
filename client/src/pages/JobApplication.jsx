import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import { getAllJobs } from "../Contexts/jobApi";
import { submitApplication, updateProfile } from "../Contexts/ApplicationApi";
import axios from "axios";

const JobApplication = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [jsData, setJsData] = useState({
    jobSeekerId: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    desiredRole: "",
    preference: "",
    resumeId: "",
    workingExperience: "",
    email: "",
  });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://3.106.192.156:8080/employee/profile/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJsData(res.data);
      } catch (err) {
        toast.error("Failed to load profile.");
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobs = await getAllJobs();
        const selectedJob = jobs.find((j) => j.jobId === jobId);
        setJob(selectedJob || null);
      } catch (err) {
        toast.error("Failed to load job details.");
      }
    };
    fetchJob();
  }, [jobId]);


  useEffect(() => {
    if (job && !jsData.workingExperience) {
      setJsData((prev) => ({
        ...prev,
        workingExperience: job.title || "",
      }));
    }
  }, [job, jsData.workingExperience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 5MB limit.");
      e.target.value = null;
    } else {
      setResume(file);
    }
  };

  const uploadCV = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobSeekerId", jsData.jobSeekerId);
    try {
      const res = await axios.post(
        "http://3.106.192.156:8080/employee/resume",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      toast.error("Resume upload failed.");
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to apply.");
      return;
    }
    setIsSubmitting(true);
    try {
      let resumeId = jsData.resumeId;
      if (resume) {
        const uploaded = await uploadCV(resume);
        resumeId = uploaded.resumeId;
        setJsData((prev) => ({ ...prev, resumeId }));
      }

      await submitApplication({
        jobSeekerId: jsData.jobSeekerId,
        jobId: job.jobId,
        status: "Submitted",
      });

      await updateProfile(jsData.jobSeekerId, {
        ...jsData,
        resumeId,
      });

      toast.success("Application submitted successfully!");
      navigate("/job-search");
    } catch (err) {
      toast.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/job-search");
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto text-center p-12">
        <h1 className="text-2xl font-bold mb-4">Application</h1>
        <p>Please log in to continue.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto text-center p-12">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-12">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-semibold">
          {job.title} <span className="text-gray-500">• {job.location} • {job.employmentType}</span>
        </h1>
        <button onClick={handleCancel} className="ml-auto text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="max-w-lg mx-auto bg-white p-6 shadow rounded border">
        <h2 className="text-lg font-semibold mb-4">Submit your application</h2>
        <p className="text-sm text-gray-600 mb-6">
          The following is required and will only be shared with {job.companyName}.
        </p>

        <form onSubmit={handleSubmit}>
          <Input label="First Name" name="firstName" value={jsData.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={jsData.lastName} onChange={handleChange} />
          <Input label="Email Address" name="email" value={jsData.email} readOnly />
          <Input label="Phone Number" name="phoneNo" value={jsData.phoneNo} onChange={handleChange} />
          <Input
            label="Current or previous job title"
            name="workingExperience"
            value={jsData.workingExperience}
            onChange={handleChange}
          />
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Attach your CV/Resume (Max 5MB)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white rounded ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-sm text-gray-600 mt-2">
            By submitting you accept our Terms and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, onChange, readOnly = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full p-2 border rounded ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "focus:outline-none focus:ring-2 focus:ring-blue-600"
        }`}
      required
    />
  </div>
);

export default JobApplication;
