import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// ... other page imports
import Register from './pages/Register';
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// --- Admin Pages ---
import AdminDashboard from './pages/AdminDashboard';
import DashboardHome from './pages/DashboardHome'; // <-- Import the new dashboard
import AdminBookings from './pages/AdminBookings';
import VehicleAdd from './pages/VehicleAdd';
import MyVehicles from './pages/MyVehicles';

export default function App() {
  return (
    <BrowserRouter>
      {/* Conditionally render Navbar if you don't want it on the admin dashboard */}
      {/* For this example, we assume Navbar is always shown */}
      <Navbar />

      {/* Removed the container div to allow AdminDashboard to control the full page layout */}
      <Routes>
        {/* --- Public and User Routes --- */}
        {/* The container can be added here for non-admin pages if needed */}
        <Route path="/register" element={<div className="container mx-auto px-4 py-6"><Register /></div>} />
        <Route path="/login" element={<div className="container mx-auto px-4 py-6"><Login /></div>} />
        <Route path="/" element={<div className="container mx-auto px-4 py-6"><Vehicles /></div>} />
        {/* ... other user routes */}
        <Route path="/profile" element={<div className="container mx-auto px-4 py-6"><Profile /></div>} />
        <Route path="/bookings" element={<div className="container mx-auto px-4 py-6"><MyBookings /></div>} />



        {/* --- Protected Admin Dashboard Routes --- */}
        <Route
          path="/admin"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        >
          {/* Default admin route is now the DashboardHome */}
          <Route index element={<DashboardHome />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="vehicles/add" element={<VehicleAdd />} />
          <Route path="vehicle-list" element={<MyVehicles />} />
        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}