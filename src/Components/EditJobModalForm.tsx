import React, { useState, useEffect } from 'react';

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

interface EditJobModalFormProps {
  job: Job | null; // Pass the job to be edited
  onClose: () => void; // Function to close the modal
  onUpdate: (updatedJob: Job) => void; // Callback to update the job
}

const EditJobModalForm: React.FC<EditJobModalFormProps> = ({
  job,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
    }
  }, [job]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);

    try {
      const response = await fetch(
        `https://jobs-admin-dashboard-backend-test.vercel.app/jobs/${formData.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      const updatedJob = await response.json();
      onUpdate(updatedJob); // Update the parent state
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/2">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Job Title
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Salary
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Work Hours
            </label>
            <select
              name="workHours"
              value={formData.workHours}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm sm:text-base">
              Workplace Type
            </label>
            <select
              name="workplaceType"
              value={formData.workplaceType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-sm sm:text-base rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm sm:text-base text-white rounded ${
                loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModalForm;
