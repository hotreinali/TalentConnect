import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TextEditor from '../components/TextEditor';
import { postJob } from '../api/jobApi';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    currency: 'NZD',
    minSalary: '',
    maxSalary: '',
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Avoid HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value
    }));
  };

const formValidation = () => {
  const plainText = stripHtml(formData.description);
  if (!plainText.trim()) {
    toast.error('Job description is required.');
    return false;
  }

    const min = Number(formData.minSalary);
    const max = Number(formData.maxSalary);

    if (isNaN(min) || isNaN(max)) {
      toast.error('Salary must be valid numbers.');
      return false;
    }

    if (min > max) {
      toast.error('Minimum salary cannot be greater than maximum salary.');
      return false;
    }

    return true;
  };

  // post job
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidation()) return;

    const employerId = 'employer001'; 

    const jobData = {
      title: formData.title,
      companyName: formData.company,
      location: formData.location,
      employmentType: formData.type,
      currency: formData.currency,
      salaryFrom: parseFloat(formData.minSalary),
      salaryTo: parseFloat(formData.maxSalary),
      description: formData.description,
      category: formData.category, 
      employerId: employerId
    };

    try {
      const jobId = await postJob(jobData);
      toast.success(`Job posted successfully! Job ID: ${jobId}`);
      console.log('Posted job ID:', jobId);

      setFormData({
        title: '',
        company: '',
        location: '',
        type: '',
        currency: 'NZD',
        minSalary: '',
        maxSalary: '',
        description: '',
        category: ''
      });
    } catch (error) {
      toast.error('Failed to post job');
    }
  };

  return (
    <section className="p-15 min-h-screen">
      <div className="max-w-[90vw] w-full mx-auto">
        <h2 className="text-2xl font-bold">Post a Job</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-full">
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-bold">
                Job Title
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="font-bold">
                Company Name
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="location" className="font-bold">
                Location
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="type" className="font-bold">
                Job Type
                <span className="text-red-400">*</span>
              </label>
              {/* Job type dropdown selection */}
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Graduate">Graduate</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="salary" className="font-bold">
              Salary
              <span className="text-red-400">*</span>
            </label>

            {/* currency selector */}
            <div className="flex flex-wrap gap-x-5">
              <div className="flex flex-col justify-center gap-1 min-w-[120px]">
                <label htmlFor="currency" className="font-bold">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="AUD">AUD</option>
                  <option value="CAD">CAD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="HKD">HKD</option>
                  <option value="IDR">IDR</option>
                  <option value="JPY">JPY</option>
                  <option value="NZD">NZD</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              {/* salary range */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="font-bold whitespace-nowrap">From</span>
                <input
                  type="text"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="w-full py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                  required
                />
                <span className="font-bold">to</span>
                <input
                  type="text"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  className="w-full py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="desc" className="font-bold">
              Job Description
              <span className="text-red-400">*</span>
            </label>
            <div>
            <TextEditor
  value={formData.description || ''}
  onChange={handleDescriptionChange}
/>

            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              className="mt-5 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
