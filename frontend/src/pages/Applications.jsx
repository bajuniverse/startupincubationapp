import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import RequireAdmin from '../components/RequireAdmin';

const Applications = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (id) {
          const response = await axiosInstance.get(`/api/applications/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setCurrentApplication(response.data);
        } else {
          const response = await axiosInstance.get('/api/applications', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setApplications(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id, user]);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axiosInstance.patch(
        `/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Refresh the application list or single application view
      if (id) {
        setCurrentApplication({ ...currentApplication, status: newStatus });
      } else {
        setApplications(
          applications.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  // Render detailed view for a single application
  if (currentApplication) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6">Application Details</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Application ID:</p>
            <p>{currentApplication.applicationId}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p>{currentApplication.status}</p>
          </div>
          <div>
            <p className="font-semibold">Startup Name:</p>
            <p>{currentApplication.startupName}</p>
          </div>
          <div>
            <p className="font-semibold">Program Applied:</p>
            <p>{currentApplication.programApplied}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{currentApplication.applicationEmail}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{currentApplication.applicationPhone}</p>
          </div>
        </div>
        <div className="mb-6">
          <p className="font-semibold">Description:</p>
          <p>{currentApplication.description}</p>
        </div>
        <div className="mt-6">
          <p className="font-semibold mb-2">Change Status:</p>
          <div className="flex gap-2">
            <button
              onClick={() => updateStatus(currentApplication._id, 'Pending')}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Pending
            </button>
            <button
              onClick={() => updateStatus(currentApplication._id, 'Under Review')}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Under Review
            </button>
            <button
              onClick={() => updateStatus(currentApplication._id, 'Accepted')}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus(currentApplication._id, 'Rejected')}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render list of all applications
  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => (
            <tr key={application._id}>
              <td className="px-6 py-4 whitespace-nowrap">{application.applicationId}</td>
              <td className="px-6 py-4 whitespace-nowrap">{application.startupName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{application.programApplied}</td>
              <td className="px-6 py-4 whitespace-nowrap">{application.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/applications/${application._id}`} className="text-blue-600 hover:text-blue-900">
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Wrap with RequireAdmin to protect route
const ProtectedApplications = () => (
  <RequireAdmin>
    <Applications />
  </RequireAdmin>
);

export default ProtectedApplications;