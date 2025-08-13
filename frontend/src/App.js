import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile';
import ProtectedTasks from './pages/Tasks';
import ProtectedApplications from './pages/Application';
import ApplicationForm from './components/ApplicationForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<ProtectedTasks />} />
        <Route path="/applications" element={<ProtectedApplications />} />
        <Route path="/applications/apply" element={<ApplicationForm />} />
        <Route path="/profile" element={<ProtectedProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
