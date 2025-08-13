import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ApplicationDetail = ({ application, setApplication }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return;
    
    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(
        `/api/applications/${application._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setApplication(response.data);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{application.startupName}</h1>
        <span className={`px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
          {application.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Application Details</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Application ID:</span> {application.applicationId}</p>
            <p><span className="font-medium">Program:</span> {application.programApplied}</p>
            <p><span className="font-medium">Submitted:</span> {new Date(application.submissionDate).toLocaleDateString()}</p>
            <p><span className="font-medium">Last Updated:</span> {new Date(application.updatedDateTime).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {application.applicationEmail}</p>
            <p><span className="font-medium">Phone:</span> {application.applicationPhone}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Project Description</h2>
        <p className="bg-gray-50 p-4 rounded">{application.description}</p>
      </div>

      {isAdmin && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold mb-3">Update Status</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('Pending')}
              disabled={application.status === 'Pending' || isUpdating}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleStatusChange('Under Review')}
              disabled={application.status === 'Under Review' || isUpdating}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Mark as Under Review
            </button>
            <button
              onClick={() => handleStatusChange('Accepted')}
              disabled={application.status === 'Accepted' || isUpdating}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              Accept Application
            </button>
            <button
              onClick={() => handleStatusChange('Rejected')}
              disabled={application.status === 'Rejected' || isUpdating}
              className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
            >
              Reject Application
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button 
          onClick={() => navigate('/applications')} 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back to Applications
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail;