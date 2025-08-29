import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';

// Mock assets and context for demonstration purposes since imports are failing.


export default function NavbarOwner({ setSidebarOpen }) {
  // The useAppContext hook is now mocked above for this component to work standalone.
  const { user } = useAppContext();

  return (
    // Navbar is sticky to stay at the top on scroll
    <header className='sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6'>
      
      {/* Logo - Visible on mobile, links to home */}
      <Link to="/" className="md:hidden">
        <img src={assets.logo2} alt="logo" className='h-8' />
      </Link>

      {/* This div will push the welcome message and the menu button apart on mobile */}
      <div className="flex-grow md:hidden"></div>

      {/* Welcome message - Hidden on mobile, visible on larger screens */}
      <div className='hidden items-center justify-end gap-4 md:flex flex-grow'>
        <span className='text-sm text-gray-600'>
          Welcome, <span className='font-medium text-gray-800'>{user?.name || ""}</span>
        </span>
      </div>

      {/* Hamburger Menu Icon - Only visible on mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className='ml-4 text-gray-600 hover:text-blue-600 focus:outline-none md:hidden'
        aria-label='Open sidebar'
      >
        <img src={assets.menu_icon} alt="menu" className='h-6 w-6' />
      </button>

    </header>
  );
}
