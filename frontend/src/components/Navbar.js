import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-xl font-bold"
            >
              E-Game
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 rounded-md hover:bg-gray-700"
            >
              Home
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Manage Users
                </button>
              </>
            )}

            {user ? (
              <>
                <span className="px-3 py-2">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 rounded-md hover:bg-gray-700"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 