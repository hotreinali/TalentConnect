import React, { useContext, useState } from 'react'
import { AuthContext } from '../Contexts/AuthContext'
import { toast } from 'react-toastify'

// Mock job data (aligned with jobs table schema)
const mockJobs = [
  { jobId: "job01", title: "Frontend Developer", employerId: "emp001", location: "Auckland", employmentType: "Full-time", category: "Software", description: "Build beautiful interfaces using React." },
  { jobId: "job02", title: "Backend Engineer", employerId: "emp002", location: "Wellington", employmentType: "Full-time", category: "Software", description: "Develop APIs with Node.js and Express." },
  { jobId: "job03", title: "UX Designer", employerId: "emp003", location: "Christchurch", employmentType: "Contract", category: "Design", description: "Create user-friendly interfaces for web apps." },
  { jobId: "job04", title: "Product Manager", employerId: "emp004", location: "Hamilton", employmentType: "Full-time", category: "Management", description: "Lead product development teams." },
  { jobId: "job05", title: "Data Analyst", employerId: "emp005", location: "Dunedin", employmentType: "Part-time", category: "Analytics", description: "Analyze business data to drive decisions." },
];

const ITEMS_PER_PAGE = 9;

const JobSearch = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    employmentType: "",
    category: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter and search logic
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmploymentType = filters.employmentType ? job.employmentType === filters.employmentType : true;
    const matchesCategory = filters.category ? job.category === filters.category : true;
    return matchesSearch && matchesEmploymentType && matchesCategory;
  });

  // Pagination logic
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

  const handleApply = (jobTitle) => {
    if (!isLoggedIn) {
      toast.error("Please log in to apply for jobs!", { position: "top-right" });
    } else {
      toast.success(`Applied to ${jobTitle}!`, { position: "top-right" });
      // Add API call to apply for job
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(job.title);
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
                  handleApply(selectedJob.title);
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