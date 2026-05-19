import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RegisterComplaint from './pages/RegisterComplaint';
import ComplaintDetails from './pages/ComplaintDetails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Simple Navbar */}
        {isAuthenticated && (
          <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold">Smart Complaint System</h1>
            <div className="space-x-4">
              <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
              <Link to="/register-complaint" className="hover:text-gray-200">New Complaint</Link>
              <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Logout</button>
            </div>
          </nav>
        )}

        <div className="flex-grow p-6">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setAuth={setIsAuthenticated} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup setAuth={setIsAuthenticated} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/register-complaint" element={isAuthenticated ? <RegisterComplaint /> : <Navigate to="/login" />} />
            <Route path="/complaint/:id" element={isAuthenticated ? <ComplaintDetails /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
