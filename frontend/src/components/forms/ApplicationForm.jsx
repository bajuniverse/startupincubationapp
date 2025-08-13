// src/components/ApplicationForm.jsx
import { useState } from 'react';
import axiosInstance from '../../axiosConfig';

const ApplicationForm = () => {

  const [formData, setFormData] = useState({
    startupName: '',
    programApplied: '',
    applicationEmail: '',
    applicationPhone: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/applications/apply', formData);
      setSuccess(true);
      setFormData({
        startupName: '',
        programApplied: '',
        applicationEmail: '',
        applicationPhone: '',
        description: ''
      });
    } catch (error) {
      // alert('Failed to save application. Please try again.');
      setError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Application submitted successfully! We'll contact you soon.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">Startup Incubation Application</h1>
      <p className="text-gray-600 mb-8 text-center">
        Complete the form below to submit your application for our startup incubation program.
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
        <input
          type="text"
          placeholder="Startup Name"
          value={formData.startupName}
          onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        
        <input
          type="text"
          placeholder="Program Applied For"
          value={formData.programApplied}
          onChange={(e) => setFormData({ ...formData, programApplied: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        
        <input
          type="email"
          placeholder="Contact Email"
          value={formData.applicationEmail}
          onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        
        <input
          type="tel"
          placeholder="Contact Phone"
          value={formData.applicationPhone}
          onChange={(e) => setFormData({ ...formData, applicationPhone: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        
        <textarea
          placeholder="Application Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          rows="4"
          required
        ></textarea>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;