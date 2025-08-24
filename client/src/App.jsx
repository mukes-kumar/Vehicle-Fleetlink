import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBooking from './pages/MyBooking';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import Managecars from './pages/owner/Managecars';
import ManageBookings from './pages/owner/ManageBookings';
import Login from './components/Login';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext';

function App() {

  const {showLogin , setShowLogin} = useAppContext();

  // const [showLogin, setShowLogin] = useState(false);
  const isWonerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      <Toaster />
      {showLogin && <Login setShowLogin={setShowLogin} />
      }

      {
        !isWonerPath && <Navbar setShowLogin={setShowLogin} />
      }

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBooking />} />
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<Managecars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>
      </Routes>

      {
        !isWonerPath && <Footer />
      }


    </>
  )
}

export default App