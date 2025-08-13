import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import RequireAdmin from '../components/RequireAdmin';

// import ApplicationList from '../components/ApplicationList';
// import ApplicationDetail from '../components/ApplicationDetail';

const Applications = () => {
  const { id } = useParams();
  const { user } = useAuth();
  // const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  // const [selectedApplication, setSelectedApplication] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchApplications = async () => {
      // setLoading(true);
      try {
        if
        const response = await axiosInstance.get('/api/applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSingleApplication = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setSelectedApplication(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching application details:', error);
        setError('Failed to load application details. Please try again later.');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSingleApplication();
    } else {
      fetchApplications();
    }
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-pulse">Loading applications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {id && selectedApplication ? (
        <ApplicationDetail 
          application={selectedApplication} 
          setApplication={setSelectedApplication} 
        />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Manage Applications</h1>
          <ApplicationList 
            applications={applications} 
            isAdmin={isAdmin} 
          />
        </>
      )}
    </div>
  );

};

export default function ProtectedApplication() {
  return (
    <RequireAuth>
      <Applications />
    </RequireAuth>
  );
};
