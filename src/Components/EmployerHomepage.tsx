import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Define the Job type
interface Job {
  id: number;
  name: string;
  description: string;
  location: string;
  posted_at: string;
  workplace_type: 'On-site' | 'Remote' | 'Hybrid';
  salary: string;
  work_hours: 'Full-time' | 'Part-time';
}

const EmployerHomepage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('jobsPosted');
  const jobsPerPage = 5;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/job-post-form');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://jobs-admin-dashboard-backend-test.vercel.app/jobs'
        );
        const data = await response.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedJob(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      const filtered = jobs.filter(
        (job) =>
          job.name.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container flex flex-col mx-auto p-4 h-screen">
      {/* Tiles at the top */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Jobs Posted</p>
          <p className="text-2xl font-bold text-blue-600">3,342</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Total Applicants</p>
          <p className="text-2xl font-bold text-blue-600">77</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Approved Applications</p>
          <p className="text-2xl font-bold text-blue-600">77</p>
        </div>
      </div>

      {/* Tabs for Job Sections */}
      <div className="border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === 'jobsPosted'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('jobsPosted')}
        >
          Jobs Posted
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'applicants'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('applicants')}
        >
          Applicants
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'approvedApplications'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('approvedApplications')}
        >
          Approved Applications
        </button>
      </div>

      {/* Search and Post Job button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search jobs by title or description..."
          className="w-full p-2 border border-gray-300 rounded mr-4"
        />
        <button
          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:cursor-pointer"
          onClick={handleNavigate}
        >
          Post a job <FiPlus className="ml-2" />
        </button>
      </div>

      {/* Job Cards */}
      {activeTab === 'jobsPosted' && (
        <div className="grid gap-4">
          {paginatedJobs.map((job) => (
            <div
              key={job.name}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h2
                  className="text-lg font-semibold text-blue-600 hover:underline hover:cursor-pointer"
                  onClick={() => handleJobClick(job)}
                >
                  {job.name}
                </h2>
                <p className="text-gray-600">{job.description}</p>
                <p className="text-gray-500">{job.location}</p>
                <p className="text-gray-400 text-sm">
                  Posted on: {job.posted_at}
                </p>
              </div>
              <div className="text-right">
                <p>
                  Work hours:{' '}
                  <span className="text-blue-600">{job.work_hours}</span>
                </p>
                <p>
                  Salary: <span className="text-blue-600">${job.salary}</span>
                </p>
                <p>
                  Type:{' '}
                  <span className="text-blue-600">{job.workplace_type}</span>
                </p>
                <div className="flex items-center justify-end space-x-2 mt-2">
                  <FaEdit className="text-blue-500 cursor-pointer" />
                  <FaTrashAlt className="text-red-500 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Component */}
      <div className="flex justify-center mt-4 items-center text-gray-600">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`mr-2 ${
            currentPage === 1 ? 'text-gray-400' : 'text-blue-500'
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`ml-2 ${
            currentPage === totalPages ? 'text-gray-400' : 'text-blue-500'
          }`}
        >
          Next
        </button>
      </div>

      {isSidebarOpen && selectedJob && (
        <div
          className="fixed top-0 right-0 h-full bg-white shadow-lg p-6 transition-transform duration-500 ease-in-out transform translate-x-0"
          style={{
            width: '40%',
            transition: 'transform 0.5s ease, width 0.5s ease',
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          <button
            onClick={handleCloseSidebar}
            className="text-gray-500 mb-4 text-lg"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            {selectedJob.name}
          </h2>
          <p>
            <strong>Description:</strong> {selectedJob.description}
          </p>
          <p>
            <strong>Location:</strong> {selectedJob.location}
          </p>
          <p>
            <strong>Posted At:</strong> {selectedJob.posted_at}
          </p>
          <p>
            <strong>Work Hours:</strong> {selectedJob.work_hours}
          </p>
          <p>
            <strong>Salary:</strong> {selectedJob.salary}
          </p>
          <p>
            <strong>Type:</strong> {selectedJob.workplace_type}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployerHomepage;
