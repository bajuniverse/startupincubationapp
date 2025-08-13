import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RequireAdmin = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/unauthorized');
    }
  }, [user, navigate, isAdmin]);

  if (!user || !user.token || !isAdmin()) return null;

  return children;
};

export default RequireAdmin;