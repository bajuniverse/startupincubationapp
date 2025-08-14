import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import RequireAuth from '../components/RequireAuth';
import DeleteApplicationButton from './DeleteApplicationButton';

const ApplicationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Add these states for feedback functionality
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ comment: '', rating: 0 });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState(null);
  
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const response = await axiosInstance.get(`/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplication(response.data);
        setLoading(false);
      } catch (error) {
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
    } catch (error) {
      setError('Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Fetch Feedback of Application ${id}
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!id) return;

      setFeedbackLoading(true);
      try {
        const response = await axiosInstance.get(`/api/feedback/application/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFeedbacks(response.data);
      } catch (error) {
        setFeedbackError('Failed to load feedback');
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchFeedbacks();
  }, [id, user]);

  // Add these handlers for feedback functionality
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    
    try {
      if (editingFeedbackId) {
        // Update existing feedback
        const response = await axiosInstance.put(
          `/api/feedback/${editingFeedbackId}`,
          newFeedback,
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        
        setFeedbacks(feedbacks.map(feedback => 
          feedback._id === editingFeedbackId ? response.data : feedback
        ));
        setEditingFeedbackId(null);
      } else {
        // Add new feedback
        const response = await axiosInstance.post(
          `/api/feedback/application/${id}`,
          newFeedback,
          { headers: { Authorization: `Bearer ${user.token}` }}
        );
        
        setFeedbacks([response.data, ...feedbacks]);
      }
      
      setNewFeedback({ comment: '', rating: 0 });
    } catch (error) {
      setFeedbackError('Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleEditFeedback = (feedback) => {
    setNewFeedback({ 
      comment: feedback.comment, 
      rating: feedback.rating || 0 
    });
    setEditingFeedbackId(feedback._id);
  };

  const handleDeleteFeedback = async (feedbackId, feedback) => {
    if (feedback.user._id === user.id) {
      if (!window.confirm('Are you sure you want to delete this feedback?')) {
        return;
      }
      
      try {
        await axiosInstance.delete(`/api/feedback/${feedbackId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        setFeedbacks(feedbacks.filter(feedback => feedback._id !== feedbackId));
        
        if (editingFeedbackId === feedbackId) {
          setEditingFeedbackId(null);
          setNewFeedback({ comment: '', rating: 0 });
        }
      } catch (error) {
        setFeedbackError('Failed to delete feedback');
      }
    } else {
      setFeedbackError('You can only delete your own feedback');
    }
  };

  const handleDeleteSuccess = () => {
    navigate('/applications');
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

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Feedback and Comments</h2>
          
          <form onSubmit={handleFeedbackSubmit} className="mb-6 bg-gray-50 p-4 rounded">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                {editingFeedbackId ? 'Edit your comment:' : 'Add a comment:'}
              </label>
              <textarea
                id="comment"
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                rows="3"
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rating:</label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewFeedback({...newFeedback, rating: star})}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= newFeedback.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                disabled={feedbackLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              >
                {feedbackLoading ? 'Submitting...' : editingFeedbackId ? 'Update Comment' : 'Add Comment'}
              </button>
              
              {editingFeedbackId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingFeedbackId(null);
                    setNewFeedback({ comment: '', rating: 0 });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {feedbackError && (
              <p className="mt-2 text-sm text-red-600">{feedbackError}</p>
            )}
          </form>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Comments ({feedbacks.length})</h3>
            
            {feedbackLoading && feedbacks.length === 0 ? (
              <p className="text-gray-500">Loading comments...</p>
            ) : feedbacks.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              feedbacks.map(feedback => (
                <div key={feedback._id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{feedback.user?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString()} at {new Date(feedback.createdAt).toLocaleTimeString()}
                      </p>
                      {feedback.rating > 0 && (
                        <div className="flex text-yellow-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < feedback.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {feedback.user._id === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditFeedback(feedback)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(feedback._id, feedback)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-2">{feedback.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>        

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold text-red-600">Remove Application</h2>
          <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
          <div className="flex flex-wrap gap-2">
              <DeleteApplicationButton 
                applicationId={application._id}
                onDelete={handleDeleteSuccess}
              />
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