import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const DeleteApplicationButton = ({ applicationId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to remove this application? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await axiosInstance.delete(`/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Call the onDelete callback to update the UI
      if (onDelete) {
        onDelete(applicationId);
      } else {
        // If no callback is provided, navigate back to the applications list
        navigate('/applications');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to remove application');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isDeleting ? 'Removing...' : 'Remove Application'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default DeleteApplicationButton;