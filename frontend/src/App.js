import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedProfile from './pages/Profile';
import ProtectedTasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedProfile />} />
        <Route path="/tasks" element={<ProtectedTasks />} />
      </Routes>
    </Router>
  );
}

export default App;
