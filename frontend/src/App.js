import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateMatch from './pages/admin/CreateMatch';
import PrivateRoute from './components/PrivateRoute';
import { authService } from './services/authService';
import MatchDetails from './pages/MatchDetails';
import EditMatch from './pages/admin/EditMatch';
import UserManagement from './components/UserManagement';

const AdminRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const interval = setInterval(() => {
            authService.checkBanStatus().catch(console.error);
        }, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create-match"
            element={
              <AdminRoute>
                <CreateMatch />
              </AdminRoute>
            }
          />
          <Route path="/matches/:matchId" element={<MatchDetails />} />
          <Route path="/admin/matches/:matchId/edit" element={<PrivateRoute><EditMatch /></PrivateRoute>} />
          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <UserManagement />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
