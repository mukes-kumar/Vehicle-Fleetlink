import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// --- Import our custom hook for the dropdown ---
import { useClickOutside } from '../hooks/useClickOutside'; // Adjust path if needed

// --- Import Icons ---
import { FiGrid, FiUser, FiLogOut, FiMenu, FiX, FiPlusCircle, FiLogIn } from 'react-icons/fi';
import logo from '../assets/logo.png'; // Make sure your logo is in src/assets

// --- Helper: Dynamic Avatar Component ---
const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const generateColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 60%, 50%)`;
  };
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: generateColor(name) }}>
      {initial}
    </div>
  );
};

// --- Reusable Profile Dropdown ---
const ProfileDropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useClickOutside(() => setIsOpen(false));

  const handleAction = (path) => {
    setIsOpen(false);
    if (path === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
        <Avatar name={user.name} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5"
          >
            <div className="px-4 py-2 border-b"><p className="font-semibold text-gray-800">{user.name}</p></div>
            <div className="py-1">
              <button onClick={() => handleAction('/profile')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiUser className="mr-3" /> My Profile</button>
              {user.role === 'admin' && (
                <>
                  <button onClick={() => handleAction('/admin')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiGrid className="mr-3" /> Admin Dashboard</button>
                  <button onClick={() => handleAction('/admin/vehicles/add')} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiPlusCircle className="mr-3" /> List Vehicle</button>
                </>
              )}
            </div>
            <div className="border-t py-1">
              <button onClick={() => handleAction('logout')} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"><FiLogOut className="mr-3" /> Logout</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Main Navbar Component ---
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // <-- FIX: 'navigate' is now defined here

  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route/page change
  }, [location]);

  const navLinks = [
    { name: 'Our Fleet', path: '/' },
    { name: 'My Bookings', path: '/bookings', requiresAuth: true },
    { name: 'Special Offers', path: '#' },
    { name: 'Contact', path: '#' },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 h-20 flex items-center shadow-sm">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="FleetLink Logo" className="h-20 w-auto" />
          </Link>

          <div className="hidden md:flex justify-center items-center flex-1">
            <div className="space-x-8">
              {navLinks.map(link => 
                (!link.requiresAuth || user) && (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileDropdown user={user} logout={logout} />
            ) : (
              // --- CHANGE: Logged-out view for Desktop ---
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                  Login
                </Link>
                <Link to={`${!user ? '/register': '/bookings'}`} className="px-5 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors">
                  Book Now!
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-0 w-full bg-white shadow-lg md:hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navLinks.map(link => 
                (!link.requiresAuth || user) && (
                  <Link key={link.name} to={link.path} className="block text-base font-medium text-gray-700 hover:text-orange-500">{link.name}</Link>
                )
              )}
              <div className="border-t pt-4 space-y-4">
                {user ? (
                  <>
                    <Link to="/profile" className="block font-medium text-gray-700">My Profile</Link>
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin" className="block font-medium text-gray-700">Admin Dashboard</Link>
                            <Link to="/admin/vehicles/add" className="block font-medium text-gray-700">List Vehicle</Link>
                        </>
                    )}
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left font-medium text-red-600">Logout</button>
                  </>
                ) : (
                  // --- CHANGE: Logged-out view for Mobile ---
                  <>
                    <Link to="/login" className="flex items-center justify-center py-2 text-base font-medium text-gray-700 hover:text-orange-500 border rounded-lg">
                      <FiLogIn className="mr-2"/> Login or Register
                    </Link>
                    <Link to={`#`} className="block w-full text-center px-6 py-2 font-bold text-white bg-orange-500 rounded-lg">
                      Book Now!
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}