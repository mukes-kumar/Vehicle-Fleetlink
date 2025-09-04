import React from 'react';
import { FiLoader } from 'react-icons/fi';

// --- Reusable Vehicle Card ---
const VehicleCard = ({ vehicle }) => (
  <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
    <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800">{vehicle.name}</h3>
      <p className="text-sm text-gray-600 mt-1">Capacity: {vehicle.capacityKg} Kg</p>
      <p className="text-sm text-gray-600">Tyres: {vehicle.tyres}</p>
      <button className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
        Book Now
      </button>
    </div>
  </div>
);

// --- Main Results Component ---
export default function VehicleResults({ vehicles, loading, error }) {
  // Loading State
  if (loading) {
    return (
      <div className="text-center py-10">
        <FiLoader className="animate-spin text-4xl text-orange-500 mx-auto" />
        <p className="mt-4 text-gray-600">Finding available vehicles...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 p-6 rounded-lg">
        <p className="font-semibold text-red-600">Oops! Something went wrong.</p>
        <p className="text-sm text-red-500 mt-1">{error}</p>
      </div>
    );
  }

  // Initial State (before any search is made)
  if (vehicles === null) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Enter your trip details above to find available vehicles.</p>
      </div>
    );
  }

  // No Results State
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="font-semibold text-gray-700">No Vehicles Found</p>
        <p className="text-gray-500 mt-1">We couldn't find any vehicles matching your criteria. Please try different dates or locations.</p>
      </div>
    );
  }

  // Success State (results found)
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle._id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}