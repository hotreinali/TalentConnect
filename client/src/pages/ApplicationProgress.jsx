import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import { getApplications } from "../Contexts/ApplicationApi";

const ApplicationProgress = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isLoggedIn) {
        toast.error("Please log in to view your applications!", {
          position: "top-right",
        });
        navigate("/login");
        return;
      }

      setLoading(true);

      try {
        const data = await getApplications();
        const filtered = getLatestApplications(data || []);
        setApplications(filtered);
      } catch (error) {
        toast.error("Failed to load applications. Please try again.", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isLoggedIn, navigate]);


  const getLatestApplications = (apps) => {
    const latestMap = new Map();

    apps.forEach((app) => {
      const jobId = app.jobId;
      const existing = latestMap.get(jobId);
      if (
        !existing ||
        (app.applyTime?.seconds || 0) > (existing.applyTime?.seconds || 0)
      ) {
        latestMap.set(jobId, app);
      }
    });


    return Array.from(latestMap.values()).sort(
      (a, b) => (b.applyTime?.seconds || 0) - (a.applyTime?.seconds || 0)
    );
  };

  const handleClose = () => {
    navigate("/job-search");
  };

  return (
    <div className="container mx-auto p-15 min-h-screen">
      <div className="flex items-center mb-6">
        <img
          src="https://img.icons8.com/?size=100&id=121320&format=png&color=000000"
          alt="Resume Icon"
          className="w-12 h-12 mr-4"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Application Progress
        </h1>
        <button
          onClick={handleClose}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Applications
        </h2>
        {loading ? (
          <p className="text-gray-600">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-600">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">
                    Apply Date
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">
                    Job ID
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">
                    Job Title
                  </th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {app.applyTime
                        ? new Date(
                          app.applyTime.seconds * 1000
                        ).toLocaleDateString("en-NZ")
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {app.jobId}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {app.title || "(No Title)"}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${app.status.toLowerCase() === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : app.status.toLowerCase() === "under review"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1).toLowerCase()}
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
