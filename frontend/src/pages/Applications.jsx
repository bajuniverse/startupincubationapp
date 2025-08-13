// src/pages/Applications.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import RequireAuth from '../components/RequireAuth';

const Applications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get('/api/applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch applications');
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [user]);
  
  // Handle view application details
  const handleViewApplication = (id) => {
    navigate(`/applications/${id}`);
  };
  
  // Filter applications by status
  const filteredApplications = statusFilter === 'All' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) return <div className="text-center py-10">Loading applications...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2">Filter by Status:</label>
          <select 
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Applications</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Startup Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Program
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Submission Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                  No applications found
                </td>
              </tr>
            ) : (
              filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.startupName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.programApplied}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.submissionDate)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleViewApplication(application._id)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Export with authentication protection
export default function ProtectedApplications() {
  return (
    <RequireAuth>
      <Applications />
    </RequireAuth>
  );
}