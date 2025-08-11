import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../components/RequireAuth';

const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    university: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    // if (!user || !user.token) {
    //   navigate('/login');
    //   return;
    // }

    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          university: response.data.university || '',
          address: response.data.address || '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!user || !user.token) {
    //   alert('You must be logged in to update your profile.');
    //   navigate('/login');
    //   return;
    // }
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="mentor">Mentor</option>
          <option value="applicant">Applicant</option>
        </select>
        <input
          type="text"
          placeholder="University"
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

// export default Profile;
export default function ProtectedProfile() {
  return (
    <RequireAuth>
      <Profile />
    </RequireAuth>
  );
};
