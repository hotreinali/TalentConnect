import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { getApplications } from '../Contexts/ApplicationApi';

const ApplicationProgress = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isLoggedIn) {
        toast.error("Please log in to view your applications!", { position: "top-right" });
        navigate('/login');
        return;
      }
      try {
        const data = await getApplications();
        setApplications(data || []);
      } catch (error) {
        toast.error("Failed to load applications. Please try again.", { position: "top-right" });
      }
    };
    fetchApplications();
  }, [isLoggedIn, navigate]);

  const handleClose = () => {
    navigate('/job-search');
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" /> {/* Replace with your logo path */}
        <h1 className="text-xl font-semibold text-gray-800">Application Progress</h1>
        <button
          onClick={handleClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-600">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">Apply Date</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">Job ID</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">Job Seeker ID</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">{app.applyDate}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{app.jobId}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{app.jobseekerId}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'under review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationProgress;