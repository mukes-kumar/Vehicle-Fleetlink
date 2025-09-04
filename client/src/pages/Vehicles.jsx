import React, { useEffect, useState } from 'react';
import API from '../api/api';

// --- Import UI Components ---
import Hero from '../components/Hero';
import SearchVehicles from '../components/SearchVehicles';
import VehicleCard from '../components/VehicleCard';
import BookingModal from '../components/BookingModal'; // Assuming this component exists
import { FiLoader } from 'react-icons/fi';

export default function Vehicles() {
  // State for the "Availability Search" results
  const [availableVehicles, setAvailableVehicles] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State for the "Browse All" list
  const [allVehicles, setAllVehicles] = useState([]);
  const [isBrowseLoading, setIsBrowseLoading] = useState(true);
  const [browseQuery, setBrowseQuery] = useState('');

  // State for the Booking Modal
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch all vehicles for the "Browse" section on initial component mount
  const fetchAllVehicles = async () => {
    setIsBrowseLoading(true);
    try {
      const { data } = await API.get('/vehicles');
      setAllVehicles(data.vehicles || data || []);
    } catch (err) {
      console.error("Failed to fetch all vehicles:", err);
    } finally {
      setIsBrowseLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  // Filter logic for the "Browse" search input
  const filteredAllVehicles = allVehicles.filter(v =>
    v.name.toLowerCase().includes(browseQuery.toLowerCase())
  );

  return (
    <div className="bg-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- Section 1: Hero & Availability Search --- */}
        <Hero />

        <h2 className='text-xl text-orange-500 font-bold'>Available Vehicle</h2>
        <SearchVehicles
          setAvailableVehicles={setAvailableVehicles}
          setIsLoading={setIsSearchLoading}
          setError={setSearchError}
        />

        {/* --- Section 2: Availability Search Results --- */}
        <div className="mt-12">
          {isSearchLoading && (
            <div className="text-center py-10"><FiLoader className="animate-spin text-4xl text-orange-500 mx-auto" /></div>
          )}
          {searchError && (
            <div className="text-center py-10 bg-red-50 p-6 rounded-lg text-red-600">{searchError}</div>
          )}
          {availableVehicles && availableVehicles.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Vehicles for Your Trip</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableVehicles.map(v => <VehicleCard key={v._id} vehicle={v} onBook={setSelectedVehicle} />)}
              </div>
            </div>
          )}
          {availableVehicles && availableVehicles.length === 0 && (
              <div className="text-center py-10 bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold text-gray-700">No Vehicles Found</p>
                  <p className="text-gray-500 mt-1">We couldn't find any vehicles for the selected criteria.</p>
              </div>
          )}
        </div>

        {/* --- Section 3: Browse All Vehicles --- */}
        <div className="mt-20 pt-10 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Or Browse Our Entire Fleet</h2>
            <input
              value={browseQuery}
              onChange={e => setBrowseQuery(e.target.value)}
              placeholder="Search by name..."
              className="border p-2 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {isBrowseLoading ? (
            <div className="text-center py-10"><FiLoader className="animate-spin text-4xl text-blue-500 mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAllVehicles.map(v => <VehicleCard key={v._id} vehicle={v} onBook={setSelectedVehicle} />)}
            </div>
          )}
        </div>

      </div>

      {/* --- Booking Modal (rendered outside the main flow) --- */}
      {selectedVehicle && (
        <BookingModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          onBooked={() => {
            // After booking, close modal and refresh both lists for updated availability
            setSelectedVehicle(null);
            fetchAllVehicles();
            // Optionally, you could also re-run the availability search here if the form is filled
          }}
        />
      )}
    </div>
  );
}