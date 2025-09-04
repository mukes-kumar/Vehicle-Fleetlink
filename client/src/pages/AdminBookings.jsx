import React, { useEffect, useState, useCallback, useRef } from 'react';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoreVertical, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

// --- Helper function to generate a consistent color from a string ---
const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

// --- Reusable Avatar Component ---
const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const bgColor = name ? generateColor(name) : '#ccc';
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
};

// --- Reusable Status Badge Component ---
const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.CANCELLED}`}>
      {status}
    </span>
  );
};

// --- Actions Menu Component ---
const ActionsMenu = ({ onSelect, bookingId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Custom hook to detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (status) => {
    onSelect(bookingId, status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100">
        <FiMoreVertical className="text-gray-600" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-24 w-20 mt-[-60px] bg-white rounded-md shadow-lg z-10 border-2 border-black/10"

          >
            <a onClick={() => handleSelect('APPROVED')} className="block px-2 pt-[5px] text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Approve</a>
            <a onClick={() => handleSelect('REJECTED')} className="block px-2 py-[5px] text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Reject</a>
            <a onClick={() => handleSelect('CANCELLED')} className="block px-2 py-[5px] pt-0 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, status }) => {
  if (!isOpen) return null;

  const modalContent = {
    APPROVED: { icon: <FiCheckCircle className="text-green-500" />, text: 'approve', buttonClass: 'bg-green-600 hover:bg-green-700' },
    REJECTED: { icon: <FiXCircle className="text-red-500" />, text: 'reject', buttonClass: 'bg-red-600 hover:bg-red-700' },
    CANCELLED: { icon: <FiAlertTriangle className="text-gray-500" />, text: 'cancel', buttonClass: 'bg-gray-600 hover:bg-gray-700' },
  };

  const { icon, text, buttonClass } = modalContent[status] || modalContent.CANCELLED;

  return (
    <div className="fixed inset-0 bg-black/16 bg-opacity-10 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
      >
        <div className="text-center">
          <div className="mx-auto text-5xl mb-4">{icon}</div>
          <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
          <p className="mt-2 text-sm text-gray-500">
            Do you really want to <span className="font-semibold">{text}</span> this booking? This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            No, go back
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-md ${buttonClass}`}>
            Yes, {text} it
          </button>
        </div>
      </motion.div>
    </div>
  );
};


// --- The Main Component ---
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, bookingId: null, status: null });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching all statuses to demonstrate the UI better
      const { data } = await API.get('/bookings/admin');
      setBookings(data.bookings || data.data || data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleActionSelect = (bookingId, status) => {
    setModalState({ isOpen: true, bookingId, status });
  };

  const handleModalConfirm = async () => {
    const { bookingId, status } = modalState;
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status });
      fetchBookings(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setModalState({ isOpen: false, bookingId: null, status: null }); // Close modal
    }
  };

  const handleModalCancel = () => {
    setModalState({ isOpen: false, bookingId: null, status: null });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Bookings</h1>

      {/* Loading and Error States */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings found.</p>}

      {!loading && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b-2 border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500 uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar name={b.customerId?.name} />
                      <div>
                        <div className="font-medium text-gray-800">{b.customerId?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500 md:hidden">{b.vehicleId?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">{b.vehicleId?.name || 'N/A'}</td>
                  <td className="py-3 px-4 hidden lg:table-cell">{formatDate(b.startTime)}</td>
                  <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                  <td className="py-3 px-4 text-center">
                    <ActionsMenu bookingId={b._id} onSelect={handleActionSelect} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AnimatePresence>
        <ConfirmationModal
          isOpen={modalState.isOpen}
          onCancel={handleModalCancel}
          onConfirm={handleModalConfirm}
          status={modalState.status}
        />
      </AnimatePresence>
    </div>
  );
}