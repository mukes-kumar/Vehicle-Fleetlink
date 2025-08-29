import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavbarOwner from '../../components/owner/NavbarOwner';
import Sidebar from '../../components/owner/Sidebar';
import { useAppContext } from '../../context/AppContext';

function Layout() {
  const { isOwner } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar on mobile

  useEffect(() => {
    if (!isOwner) {
      navigate('/');
    }
  }, [isOwner, navigate]);

  // If not an owner, render nothing to prevent flash of content before redirect
  if (!isOwner) {
    return null;
  }

  return (
    <div className='relative min-h-screen bg-slate-50'>
      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className='flex flex-col transition-all duration-300 md:ml-64'>
        {/* Navbar Component */}
        <NavbarOwner setSidebarOpen={setSidebarOpen} />

        {/* Page Content Rendered by <Outlet /> */}
        <main className='flex-grow p-4 sm:p-6 md:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;