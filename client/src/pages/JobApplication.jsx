import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext';
import { toast } from 'react-toastify';
import { getAllJobs } from '../Contexts/jobApi';

const JobApplication = () => {
  const { isLoggedIn = false } = useContext(AuthContext) || {};
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    jobTitle: '',
    linkedinUrl: '',
    portfolioUrl: '',
    additionalInfo: '',
  });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch job details based on jobId
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobs = await getAllJobs();
        const selectedJob = jobs.find((j) => j.jobId === jobId);
        setJob(selectedJob || null);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details.", { position: "top-right" });
      }
    };
    fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to apply for jobs!", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Placeholder for API call to submit application
      // await submitApplication(jobId, formData, resume);
      toast.success("Application submitted successfully!", { position: "top-right" });
      navigate('/job-search');
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.", { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/job-search');
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Application</h1>
        <p className="text-gray-600">Please log in to apply for this job.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!job) {
    return <div className="container mx-auto p-4 min-h-screen text-center">Loading job details...</div>;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex items-center mb-6">
        {/* <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2" />  */}
        <h1 className="text-xl font-semibold text-gray-800">
          {job.title} <span className="text-gray-500">• {job.employerId} • {job.location} • {job.employmentType}</span>
        </h1>
        <button
          onClick={handleCancel}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit your application</h2>
        <p className="text-sm text-gray-600 mb-6">
          The following is required and will only be shared with {job.employerId}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current or previous job title</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="What's your current or previous job title?"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">LINKS</label>
            <div className="space-y-2">
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="Link to your LinkedIn URL"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="url"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                placeholder="Link to your portfolio URL"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Add a cover letter or anything else you want to share"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="4"
              maxLength="500"
            />
            <p className="text-sm text-gray-500 mt-1">Maximum 500 characters</p>
            <p className="text-sm text-gray-500">{formData.additionalInfo.length}/500</p>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Attach your resume</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            By sending the request you can confirm that you accept our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;