import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || !user.token) return null;

  return children;
};

export default RequireAuth;