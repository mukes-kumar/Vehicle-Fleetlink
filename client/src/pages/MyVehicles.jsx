import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

// --- Import Icons ---
import { FiMoreVertical, FiEdit, FiTrash2, FiLoader, FiAlertTriangle } from 'react-icons/fi';

// --- Import Custom Hook ---
import { useClickOutside } from '../hooks/useClickOutside'; // Adjust path if needed

// --- Reusable Actions Menu (Corrected Positioning) ---
const ActionsMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsOpen(false));

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <FiMoreVertical className="text-gray-600" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            // --- FIX: Robust positioning ---
            className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
          >
            <div className="py-1">
              <button onClick={onEdit} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiEdit className="mr-3" /> Edit
              </button>
              <button onClick={onDelete} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <FiTrash2 className="mr-3" /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Reusable Confirmation Modal (Corrected Positioning) ---
const ConfirmationModal = ({ isOpen, onCancel, onConfirm, itemNameToDelete }) => {
  if (!isOpen) return null;

  return (
    // --- FIX: Use `fixed` instead of `absolute` for a true modal overlay ---
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
      >
        <div className="text-center">
          <FiAlertTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
          <p className="mt-2 text-sm text-gray-500">
            You are about to delete <span className="font-semibold">{itemNameToDelete}</span>. This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
        </div>
      </motion.div>
    </div>
  );
};


// --- Main MyVehicles Component ---
export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, vehicleId: null, vehicleName: '' });
  const navigate = useNavigate();

  const fetchMyVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/vehicles/my-vehicles');
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError('Failed to fetch your vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyVehicles();
  }, [fetchMyVehicles]);

  const handleEdit = (vehicleId) => {
    navigate(`/admin/vehicles/edit/${vehicleId}`); // Example edit route
  };

  const openDeleteModal = (vehicle) => {
    setModalState({ isOpen: true, vehicleId: vehicle._id, vehicleName: vehicle.name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await API.delete(`/vehicles/${modalState.vehicleId}`);
      fetchMyVehicles(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle.');
    } finally {
      setModalState({ isOpen: false, vehicleId: null, vehicleName: '' });
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Listed Vehicles</h1>

      {loading && <div className="text-center py-10"><FiLoader className="animate-spin text-4xl text-blue-500 mx-auto" /></div>}
      {error && <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      {!loading && vehicles.length === 0 && (
        <p className="text-center text-gray-500 py-8">You have not listed any vehicles yet.</p>
      )}

      {!loading && vehicles.length > 0 && (
        // --- FIX: This wrapper makes the table scrollable on small screens ---
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vehicle</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Capacity</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tyres</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Added</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img src={vehicle.imageUrl} alt={vehicle.name} className="w-16 h-12 rounded-md object-cover flex-shrink-0" />
                      <span className="font-medium text-gray-800">{vehicle.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{vehicle.capacityKg} Kg</td>
                  <td className="py-3 px-4 whitespace-nowrap">{vehicle.tyres}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{formatDate(vehicle.createdAt)}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-center">
                    <ActionsMenu
                      onEdit={() => handleEdit(vehicle._id)}
                      onDelete={() => openDeleteModal(vehicle)}
                    />
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
          onCancel={() => setModalState({ isOpen: false, vehicleId: null, vehicleName: '' })}
          onConfirm={handleDeleteConfirm}
          itemNameToDelete={modalState.vehicleName}
        />
      </AnimatePresence>
    </div>
  );
}