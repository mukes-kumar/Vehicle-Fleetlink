import React from 'react';
import { motion } from 'framer-motion';

export default function VehicleCard({ vehicle, onBook }) {
  if (!vehicle) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col"
    >
      {/* Vehicle Image */}
      <div className="overflow-hidden">
        <img
          src={vehicle.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={vehicle.name}
          className="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* Vehicle Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 truncate">{vehicle.name}</h3>
        <p className="text-sm text-gray-600 mt-1">Capacity: {vehicle.capacityKg} Kg</p>
        <p className="text-sm text-gray-600">Tyres: {vehicle.tyres}</p>

        {/* Pushes button to bottom */}
        <div className="mt-auto pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBook(vehicle)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
