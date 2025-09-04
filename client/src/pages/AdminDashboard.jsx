import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RxDashboard } from 'react-icons/rx';
import { FaWpforms, FaRegListAlt, FaList } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi'; // Icons for menu toggle

// --- Sidebar Navigation Component ---
// We extract the sidebar into its own component for clarity
const Sidebar = ({ onLinkClick }) => {
  const activeLink = "bg-blue-600 text-white shadow-md";
  const normalLink = "text-gray-600 hover:bg-blue-50 hover:text-blue-600";

  const NavItem = ({ to, icon, children }) => (
    <li>
      <NavLink
        to={to}
        end={to === "/admin"} // Make 'end' conditional
        onClick={onLinkClick} // Close sidebar on mobile when a link is clicked
        className={({ isActive }) =>
          `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200 ${isActive ? activeLink : normalLink}`
        }
      >
        {icon}
        <span className="font-medium">{children}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className="w-64 bg-white p-4 shadow- flex-shrink-0 md:pt-4 pt-20">
      <div className="text-2xl font-bold text-orange-600 mb-8 px-2">
        FleetLink <span className="font-normal">Admin</span>
      </div>
      <nav>
        <ul className="space-y-2">
          <NavItem to="/admin" icon={<RxDashboard size={20} />}>Dashboard</NavItem>
          <NavItem to="/admin/vehicles/add" icon={<FaWpforms size={20} />}>Add Vehicle</NavItem>
          <NavItem to="/admin/bookings" icon={<FaRegListAlt size={20} />}>Manage Bookings</NavItem>
          <NavItem to="/admin/vehicle-list" icon={<FaList size={20} />}>Vehicle List</NavItem>
        </ul>
      </nav>
    </aside>
  );
};

// --- Main AdminDashboard Layout ---
export default function AdminDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (for browser back/forward buttons)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Animation variants for the sidebar
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* --- Desktop Sidebar (Always visible) --- */}
      <div className="hidden md:block bg-white shadow-lg">
        <Sidebar />
      </div>

      {/* --- Mobile Sidebar (Collapsible) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/16 bg-opacity-50 z-30 md:hidden "
            />
            {/* Sidebar Content */}
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 h-full z-40 md:hidden bg-white shadow-lg"
            >
              <Sidebar onLinkClick={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600">
            <FiMenu size={24} />
          </button>
          <div className="text-lg font-bold text-orange-600 ml-4">FleetLink Admin</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}