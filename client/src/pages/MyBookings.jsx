import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

// --- Import Icons ---
import { FiCalendar, FiMapPin, FiTruck, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

// --- Reusable Status Badge ---
const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
    APPROVED: 'bg-green-100 text-green-800 ring-green-600/20',
    REJECTED: 'bg-red-100 text-red-800 ring-red-600/20',
    CANCELLED: 'bg-gray-100 text-gray-800 ring-gray-600/20',
    COMPLETED: 'bg-blue-100 text-blue-800 ring-blue-600/20', // Example for a future status
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${statusStyles[status] || statusStyles.CANCELLED}`}>
      {status}
    </span>
  );
};

// --- Reusable Booking Card ---
const BookingCard = ({ booking, onCancel }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="flex items-center p-4 border-b">
        <img src={booking.vehicleId?.imageUrl} alt={booking.vehicleId?.name} className="w-20 h-16 rounded-md object-cover bg-gray-100" />
        <div className="ml-4 flex-grow">
          <h3 className="font-bold text-gray-800">{booking.vehicleId?.name}</h3>
          <p className="text-sm text-gray-500">Capacity: {booking.vehicleId?.capacityKg} Kg</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="mr-3 text-gray-400" />
          <span>Route: <strong>{booking.fromPincode}</strong> → <strong>{booking.toPincode}</strong></span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <FiCalendar className="mr-3 text-gray-400" />
          <span>{formatDate(booking.startTime)}</span>
        </div>
      </div>
      {['PENDING', 'APPROVED'].includes(booking.status) && (
        <div className="p-4 bg-gray-50 border-t">
          <button 
            onClick={() => onCancel(booking)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};


// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, itemNameToDelete }) => {
    // ... (This can be the same modal component from MyVehicles.js)
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex justify-center items-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
              <FiXCircle className="mx-auto text-5xl text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Cancel Booking?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to cancel your booking for the <span className="font-semibold">{itemNameToDelete}</span>?
              </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Go Back</button>
              <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">Yes, Cancel</button>
            </div>
          </motion.div>
        </div>
    );
};


// --- Skeleton Loader Card ---
const SkeletonCard = () => (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="flex items-center p-4 border-b">
            <div className="w-20 h-16 rounded-md bg-gray-200"></div>
            <div className="ml-4 flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="p-4 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
    </div>
);


// --- Main MyBookings Component ---
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, bookingToCancel: null });
  
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/bookings/me');
      // Sort bookings by start time, newest first
      const sortedBookings = (data.data || data.bookings || data).sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      setBookings(sortedBookings);
    } catch (err) {
      setError('Could not load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openCancelModal = (booking) => {
    setModalState({ isOpen: true, bookingToCancel: booking });
  };

  const handleCancelConfirm = async () => {
    if (!modalState.bookingToCancel) return;
    try {
      await API.patch(`/bookings/${modalState.bookingToCancel._id}/status`, { status: 'CANCELLED' });
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert('Failed to cancel booking.');
    } finally {
      setModalState({ isOpen: false, bookingToCancel: null });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {error && <div className="p-4 text-center bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
            // Show skeleton loaders
            Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
        ) : bookings.length > 0 ? (
            bookings.map(b => <BookingCard key={b._id} booking={b} onCancel={openCancelModal} />)
        ) : !error ? (
            // Empty state
            <div className="lg:col-span-2 text-center bg-gray-50 p-12 rounded-lg">
                <FiTruck className="mx-auto text-5xl text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">No Bookings Yet</h3>
                <p className="mt-2 text-gray-500">You haven't booked any vehicles. Let's find one for you!</p>
                <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700">
                    Browse Vehicles
                </Link>
            </div>
        ) : null}
      </div>

      <AnimatePresence>
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onCancel={() => setModalState({ isOpen: false, bookingToCancel: null })}
          onConfirm={handleCancelConfirm}
          itemNameToDelete={modalState.bookingToCancel?.vehicleId?.name}
        />
      </AnimatePresence>
    </div>
  );
}