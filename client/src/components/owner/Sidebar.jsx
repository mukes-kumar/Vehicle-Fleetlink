import React, { useState } from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function Sidebar({ isSidebarOpen, setSidebarOpen }) {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const updateImage = async () => {
    if (!image) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await axios.post('/api/owner/update-image', formData);
      if (data.success) {
        await fetchUser();
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update image.');
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <>
      {/* Main Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col border-r border-borderColor bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo and Close Button */}
        <div className='flex h-16 items-center justify-between border-b border-borderColor px-6'>
          <Link to='/' onClick={() => setSidebarOpen(false)}>
            <img src={assets.logo2} alt='logo' className='h-8' />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className='md:hidden' aria-label="Close sidebar">
              <img src={assets.close_icon} alt="close" className='h-5 w-5' />
          </button>
        </div>

        {/* User Profile Section */}
        <div className='flex flex-col items-center p-6 text-center'>
          <div className='group relative'>
            <label htmlFor='image' className='cursor-pointer'>
              <img
                src={image ? URL.createObjectURL(image) : user?.image || "https://avatar.iran.liara.run/public"}
                alt='User profile'
                className='mx-auto h-20 w-20 rounded-full object-cover'
              />
              <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'>
                <img src={assets.edit_icon} alt='edit icon' className='h-6 w-6' />
              </div>
            </label>
            <input type='file' id='image' accept='image/*' hidden onChange={e => setImage(e.target.files[0])} />
          </div>
          {image && (
             <button onClick={updateImage} disabled={isUploading} className='mt-3 flex items-center gap-2 rounded-md bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50'>
                {isUploading ? 'Saving...' : 'Save Photo'}
                <img src={assets.check_icon} alt='check icon' className='h-4 w-4'/>
             </button>
          )}
          <p className='mt-2 font-semibold text-gray-800'>{user?.name}</p>
          <p className='text-xs text-gray-500'>{user?.email}</p>
        </div>

        {/* Navigation Links */}
        <nav className='flex-grow px-4'>
          {ownerMenuLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setSidebarOpen(false)} // Close sidebar on link click
              className={({ isActive }) =>
                `relative my-1 flex items-center gap-3 rounded-md px-4 py-3 font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}`
              }
            >
              <img src={location.pathname === link.path ? link.coloredIcon : link.icon} alt={`${link.name} icon`} className='h-5 w-5' />
              <span>{link.name}</span>
              {location.pathname === link.path && <div className='absolute right-0 h-6 w-1 rounded-l-md bg-primary'></div>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile view */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 z-30 bg-black/40 md:hidden'
        ></div>
      )}
    </>
  );
}

export default Sidebar;