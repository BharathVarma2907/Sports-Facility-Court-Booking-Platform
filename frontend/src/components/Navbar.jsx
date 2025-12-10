import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Home, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                Sports Booking
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/home'}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  <Home className="h-4 w-4" />
                  <span>{isAdmin ? 'Dashboard' : 'Home'}</span>
                </Link>
                {!isAdmin && (
                  <Link
                    to="/my-bookings"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                  >
                    My Bookings
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-gray-700 px-3 py-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/'}
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {isAdmin ? 'Dashboard' : 'Home'}
                </Link>
                {!isAdmin && (
                  <Link
                    to="/my-bookings"
                    className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                <div className="text-gray-700 px-3 py-2">
                  <span className="font-medium">{user.name}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-800 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
