import React, { useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Navbar() {
  const { setShowLogin, user, axios, logout, isOwner, setIsOwner } = useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  console.log('users', user);

  // This function will be called to close the sidebar
  const closeSidebar = () => {
    setOpen(false);
  };

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      console.log('data', data);
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex w-full items-center z-50 fixed justify-between px-2 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor transition-all ${location.pathname === "/" ? "bg-light" : "bg-white"}`}>

      <Link to='/' onClick={closeSidebar}> {/* Added onClick here too */}
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo2} alt='logo' className='h-10' />
      </Link>

      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

        {menuLinks.map((link, index) => (
          // FIX: Added onClick to each link to close the sidebar
          <Link key={index} to={link.path} onClick={closeSidebar}>
            {link.name}
          </Link>
        ))}

        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56'>
          <input type='text' className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            placeholder='search products'
          />
          <img src={assets.search_icon} alt='search' className='' />
        </div>

        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>

          {/* FIX: Wrapped the original onClick logic and added closeSidebar() */}
          {/* <button onClick={() => {
            isOwner ? navigate('/owner') : changeRole();
            closeSidebar();
          }} className='cursor-pointer'>{isOwner ? 'Dashboard' : 'List Cars'}</button>
 */}

          <button
            onClick={() => {
              if (user?.role === "owner") {
                navigate("/owner");
              } else if (user?.role === "user") {
                // changeRole();
                navigate("/cars")
              } else if (user?.role === "super-admin") {
                navigate("/owner");
              }
              closeSidebar();
            }}
            className="cursor-pointer"
          >
            {user?.role === "owner"
              ? "Dashboard"
              : user?.role === "user"
                ? "List Cars"
                : user?.role === "super-admin"
                  ? "Dashboard"
                  : "Unknown"}
          </button>


          {/* FIX: Wrapped the original onClick logic and added closeSidebar() */}
          <button onClick={() => {
            user ? logout() : setShowLogin(true);
            closeSidebar();
          }} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>{user ? 'Logout' : 'Login'}</button>

        </div>
      </div>

      <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt='menu' />
      </button>
    </motion.div>
  );
}

export default Navbar;