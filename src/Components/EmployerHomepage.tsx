import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import EditJobModalForm from './EditJobModalForm';

// Define the Job type
interface Job {
  id: number;
  name: string;
  description: string;
  location: string;
  postedAt: string;
  workplaceType: 'On-site' | 'Remote' | 'Hybrid';
  salary: string;
  workHours: 'Full-time' | 'Part-time';
}

// Define Application Type
interface Application {
  id: number;
}

const EmployerHomepage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<
    Application[]
  >([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobBeingEdited, setJobBeingEdited] = useState<Job | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('jobsPosted');
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const jobsPerPage = 5;
  const navigate = useNavigate();

  const handleNavigate = () => navigate('/job-post-form');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://jobs-admin-dashboard-backend-test.vercel.app/jobs' //CHANGE URL!!!
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
    setTimeout(() => setSelectedJob(null), 500);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.name.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      )
    );
    setCurrentPage(1); // Reset to the first page on search
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleEditClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from propagating to job card click
    setJobBeingEdited(job);
  };

  const handleModalClose = () => {
    setJobBeingEdited(null);
  };

  const handleJobUpdate = (updatedJob: Job) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    setJobBeingEdited(null);
  };
  const handleDeleteClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the job click event
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(
        `https://jobs-admin-dashboard-backend-test.vercel.app/jobs/${jobToDelete.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete the job');
      }

      // Remove the job from the frontend state
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== jobToDelete.id)
      );
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      navigate('/employer-homepage');
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container flex flex-col mx-auto p-4 h-screen">
      {/* Tiles at the top */}
      <div className="grid grid-cols-3 gap-4 mt-20 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Jobs Posted</p>
          <p className="text-2xl font-bold text-blue-600">{jobs.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Total Applications</p>
          <p className="text-2xl font-bold text-blue-600">
            {applications.length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500">Approved Applications</p>
          <p className="text-2xl font-bold text-blue-600">
            {approvedApplications.length}
          </p>
        </div>
      </div>

      {/* Tabs for Job Sections */}
      <div className="border-b mb-4 flex flex-col md:flex-row">
        {['jobsPosted', 'applications', 'approvedApplications'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'jobsPosted'
              ? 'Jobs Posted'
              : tab === 'applications'
              ? 'Applications'
              : 'Approved Applications'}
          </button>
        ))}
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
          {paginatedJobs.length > 0 ? (
            paginatedJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-white shadow rounded-lg flex justify-between items-center transform transition-transform duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleJobClick(job)}
              >
                <div>
                  <h2 className="text-lg font-semibold text-blue-600">
                    {job.name}
                  </h2>
                  <p className="text-gray-600">{job.description}</p>
                  <p className="text-gray-500">{job.location}</p>
                  <p className="text-gray-400 text-sm">
                    Posted on: {job.postedAt}
                  </p>
                </div>
                <div className="text-right">
                  <p>
                    Work hours:{' '}
                    <span className="text-blue-600">{job.workHours}</span>
                  </p>
                  <p>
                    Salary: <span className="text-blue-600">${job.salary}</span>
                  </p>
                  <p>
                    Type:{' '}
                    <span className="text-blue-600">{job.workplaceType}</span>
                  </p>
                  <div className="flex items-center justify-end space-x-2 mt-2">
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={(e) => handleEditClick(job, e)}
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => handleDeleteClick(job, e)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No jobs found.</p>
          )}

          {/* Pagination Component */}
          <div className="flex justify-center my-4 items-center text-gray-600">
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

          {/* Render the modal outside the map loop */}
          {jobBeingEdited && (
            <EditJobModalForm
              job={jobBeingEdited}
              onClose={handleModalClose}
              onUpdate={handleJobUpdate}
            />
          )}
          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && jobToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
                <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                <p>
                  Are you sure you want to delete the job{' '}
                  <span className="font-semibold">{jobToDelete.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conditional Rendering of Other Tabs */}
      {activeTab === 'applications' && applications.length === 0 && (
        <p className="text-gray-500">No applications yet.</p>
      )}
      {activeTab === 'approvedApplications' &&
        approvedApplications.length === 0 && (
          <p className="text-gray-500">No approved applications yet.</p>
        )}

      {/* Job Detail Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg p-6 transition-transform duration-500 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0 w-4/5 md:w-2/5' : 'translate-x-full'
        }`}
      >
        {isSidebarOpen && selectedJob && (
          <>
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
              <strong>Posted At:</strong> {selectedJob.postedAt}
            </p>
            <p>
              <strong>Work Hours:</strong> {selectedJob.workHours}
            </p>
            <p>
              <strong>Salary:</strong> {selectedJob.salary}
            </p>
            <p>
              <strong>Type:</strong> {selectedJob.workplaceType}
            </p>
          </>
        )}
      </div>

      {/* Background Overlay (for smaller screens) */}
      {isSidebarOpen && (
        <div onClick={handleCloseSidebar} className="fixed inset-0 md:hidden" />
      )}
    </div>
  );
};

export default EmployerHomepage;
