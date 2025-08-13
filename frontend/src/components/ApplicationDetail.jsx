import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import RequireAuth from '../components/RequireAuth';

const ApplicationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplication(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load application details');
        setLoading(false);
      }
    };
    
    fetchApplicationDetail();
  }, [id, user]);
  
  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await axiosInstance.patch(
        `/api/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      setApplication(response.data);
    } catch (err) {
      setError('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  if (loading) return <div className="text-center py-10">Loading application details...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!application) return <div className="text-center py-10">Application not found</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate('/applications')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-4"
        >
          ← Back to Applications
        </button>
        <h1 className="text-2xl font-bold">Application Details</h1>
      </div>
      
      <div className="bg-white shadow-md rounded p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Startup Information</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Startup Name</p>
              <p className="font-medium">{application.startupName}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Program Applied</p>
              <p className="font-medium">{application.programApplied}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Application ID</p>
              <p className="font-medium">{application.applicationId}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Submission Date</p>
              <p className="font-medium">{new Date(application.submissionDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{application.applicationEmail}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{application.applicationPhone}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Current Status</p>
              <p className={`font-medium ${
                application.status === 'Pending' ? 'text-yellow-600' :
                application.status === 'Under Review' ? 'text-blue-600' :
                application.status === 'Accepted' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {application.status}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-gray-800 whitespace-pre-line">{application.description}</p>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Update Application Status</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('Pending')}
              disabled={application.status === 'Pending' || updatingStatus}
              className={`px-4 py-2 rounded ${
                application.status === 'Pending' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleStatusChange('Under Review')}
              disabled={application.status === 'Under Review' || updatingStatus}
              className={`px-4 py-2 rounded ${
                application.status === 'Under Review' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Mark as Under Review
            </button>
            <button
              onClick={() => handleStatusChange('Accepted')}
              disabled={application.status === 'Accepted' || updatingStatus}
              className={`px-4 py-2 rounded ${
                application.status === 'Accepted' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Accept Application
            </button>
            <button
              onClick={() => handleStatusChange('Rejected')}
              disabled={application.status === 'Rejected' || updatingStatus}
              className={`px-4 py-2 rounded ${
                application.status === 'Rejected' 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProtectedApplicationDetail() {
  return (
    <RequireAuth>
      <ApplicationDetail />
    </RequireAuth>
  );
}