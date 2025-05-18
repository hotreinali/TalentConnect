import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // Get job seeker ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobSeekerId: '',
    firstName: '',
    lastName: '',
    phoneNo: '',
    email: '',
    desiredRole: '',
    preference: '',
    resumeId: '',
    workingExperience: '',
  });
  // const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId'); // 👈 获取 employerId
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/employee/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'JobSeeker' && userId) {
      fetchProfile();
    } else {
      toast.error('Invalid user or role');
      setLoading(false);
    }
  }, [token, userId, userRole]);

  const handleCancel = () => {
    navigate('/job-search');
  };


  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex items-center border-b pb-4 mb-4">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-600">
            {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "J"}
          </div>
      
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-800">{formData.firstName || "Job Seeker"}</h1>
            <p className="text-gray-600">{formData.email || "email@example.com"}</p>
          </div>

          <button
          onClick={handleCancel}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        </div>


        
          {/* Experience Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Experience</h2>
            {formData.workingExperience && formData.workingExperience > 0 ? (
              formData.workingExperience((exp, index) => (
                <div key={index} className="mb-3">
                  <p className="text-gray-800 font-medium">{exp.title} at {exp.company}</p>
                  <p className="text-gray-600 text-sm">{exp.duration}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No experience listed.</p>
            )}
          </div>
        </div>

        {/* Resume Link */}
        {/* <div className="border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Resume</h2>
          {profile.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Resume
            </a>
          ) : (
            <p className="text-gray-500">No resume uploaded.</p>
          )}
        </div> */}
      {/* </div> */}
    </section>
  );
};

export default Profile;