import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">SIMS</Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">Tasks</Link>
            <Link to="/applications" className="mr-4">Applications</Link>
            <Link to="/profile" className="mr-4">Programs</Link>
            <Link to="/profile" className="mr-4">Mentors</Link>
            <Link to="/profile" className="mr-4">Startups</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            
            <Link to="/applications/apply" 
              className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700">
                Apply for Program
            </Link> 
            <Link
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/applications/apply" 
              className="bg-green-500 px-4 py-2 mx-2 rounded hover:bg-green-700">
                Apply for Program
            </Link> 
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
