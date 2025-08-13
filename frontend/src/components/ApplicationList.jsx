import { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplicationList = ({ applications, isAdmin }) => {
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredApplications = statusFilter === 'All' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

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
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Applications</h2>
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <p>Review, filter, and manage all incoming startup applications. Use the filters to narrow down the list by status.</p>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded">
          No applications found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((application) => (
            <div key={application._id} className="bg-white p-4 rounded shadow border hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{application.startupName}</h3>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="mb-2 text-sm">
                <p><span className="font-medium">ID:</span> {application.applicationId}</p>
                <p><span className="font-medium">Program:</span> {application.programApplied}</p>
                <p><span className="font-medium">Submitted:</span> {new Date(application.submissionDate).toLocaleDateString()}</p>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={`/applications/${application._id}`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;