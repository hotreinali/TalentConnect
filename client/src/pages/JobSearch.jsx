import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { getAllJobs } from '../Contexts/jobApi'; // 确保路径正确
import { getPotentialJobs, removePotentialJob, savePotentialJob } from '../Contexts/ApplicationApi';

const ITEMS_PER_PAGE = 9;

const JobSearch = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    employmentType: "",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const navigate = useNavigate();

  // 🚀 拉取后端职位列表
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data || []);
      } catch {
        toast.error("Failed to load jobs from server.");
      }
    };
    const fetchSavedJobs = async () => {
      if (isLoggedIn) {
        try {
          const data = await getPotentialJobs();
          setSavedJobs(new Set(data.map(job => job.jobId || job))); // Adjust based on response
        } catch {
          toast.error("Failed to load saved jobs.");
        }
      }
    };
    fetchJobs();
    fetchSavedJobs();
  }, [isLoggedIn]);

  // 🔍 搜索 + 过滤
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEmploymentType = filters.employmentType ? job.employmentType === filters.employmentType : true;
    const matchesCategory = filters.category ? job.category === filters.category : true;

    return matchesSearch && matchesEmploymentType && matchesCategory;
  });

  // 分页
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      employmentType: "",
      category: "",
    });
    setCurrentPage(1);
  };

  const handleApply = (jobId) => {
    if (!isLoggedIn) {
      toast.error("Please log in to apply for jobs!", { position: "top-right" });
    } else {
      navigate(`/apply/${jobId}`);
    }
  };

  const handleSaveToggle = async (jobId) => {
    if (!isLoggedIn) {
      toast.error("Please log in to save jobs!");
      navigate('/login');
      return;
    }
    try {
      if (savedJobs.has(jobId)) {
        await removePotentialJob(jobId);
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.success("Job removed from potential list.");
      } else {
        await savePotentialJob(jobId);
        setSavedJobs((prev) => new Set(prev).add(jobId));
        toast.success("Job saved to potential list.");
      }
    } catch (error) {
      toast.error("Failed to update potential list.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Find Your Dream Job</h1>

      {/* Search and Filters */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title, employer, or location..."
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
          />
          <select
            name="employmentType"
            value={filters.employmentType}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Contract">Permanent</option>
            <option value="Contract">Graduate</option>
            <option value="Contract">Internship</option>
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Software">Software</option>
            <option value="Design">Design</option>
            <option value="Management">Management</option>
            <option value="Analytics">Analytics</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="p-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors text-gray-800 md:col-start-2 lg:col-start-3"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">No jobs found.</p>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job.jobId}
              className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
              <p className="text-gray-600">Employer: {job.employerId}</p>
              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-600">{job.employmentType} • {job.category}</p>
              <button
                    onClick={() => handleSaveToggle(job.jobId)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      savedJobs.has(job.jobId)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-800'
                    } hover:opacity-80`}
                  >
                    {savedJobs.has(job.jobId) ? 'Saved' : 'Save'}
                  </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(job.jobId);
                }}
                className={`mt-4 w-full py-2 rounded-lg text-white ${
                  isLoggedIn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                } transition-colors`}
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? "Apply Now" : "Login to Apply"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-colors`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedJob.title}</h2>
            <p className="text-gray-600 mb-2">Employer: {selectedJob.employerId} • {selectedJob.location}</p>
            <p className="text-gray-600 mb-2">{selectedJob.employmentType} • {selectedJob.category}</p>
            <p className="text-gray-700 mb-4">{selectedJob.description}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedJob.jobId);
                  setSelectedJob(null);
                }}
                className={`px-4 py-2 rounded-lg text-white ${
                  isLoggedIn ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                } transition-colors`}
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? "Apply Now" : "Login to Apply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;