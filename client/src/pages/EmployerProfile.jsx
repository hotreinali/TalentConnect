import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const EmployerProfile = () => {
  const [formData, setFormData] = useState({
    employerId: '',
    email: '',
    companyName: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://3.106.192.156:8080/employer/profile/${userId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setFormData({
          employerId: data.employerId || '',
          email: data.email || '',
          companyName: data.companyName || '',
          description: data.description || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'Employer' && userId) {
      fetchProfile();
    } else {
      toast.error('Invalid user or role');
      setLoading(false);
    }
  }, [token, userId, userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://3.106.192.156:8080/employer/profile/${userId}`,
        {
          employerId: formData.employerId,
          email: formData.email,
          companyName: formData.companyName,
          description: formData.description,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Employer ID</label>
            <input
              type="text"
              value={formData.employerId}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows={4}
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );

};

export default EmployerProfile;
