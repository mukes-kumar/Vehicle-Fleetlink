import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Cars() {
  const [filteredCars, setFilteredCars] = useState([]);
  const [input, setInput] = useState(''); // ✅ fix: start with empty string

  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const { cars, axios } = useAppContext();

  const isSearchData = pickupLocation && pickupDate && returnDate;

  // Apply local search filter
  const applyFilter = () => {
    if (!input || input.trim() === '') {
      setFilteredCars(cars); // ✅ show all cars when input empty
      return;
    }

    const filtered = cars.filter((car) =>
      car.brand.toLowerCase().includes(input.toLowerCase()) ||
      car.model.toLowerCase().includes(input.toLowerCase()) ||
      car.category.toLowerCase().includes(input.toLowerCase()) ||
      car.transmission.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredCars(filtered);
  };

  // Check availability from backend
  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        setFilteredCars(data.availableCars);
        if (data.availableCars.length === 0) {
          toast.error('No Cars Available');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Run backend search if params exist
  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    } else {
      setFilteredCars(cars); // ✅ show all cars by default
    }
  }, [cars]);

  // Run filter when typing search
  useEffect(() => {
    if (!isSearchData) {
      applyFilter();
    }
  }, [input]);

  return (
    <div>
      <div className="pt-40 flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title
          title={'Available Cars'}
          subTitle={
            'Browse our selection of premium vehicles available for your next adventure'
          }
        />

        <div className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img
            src={assets.search_icon}
            alt="search-icon"
            className="w-4.5 h-4.5 mr-3"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Search by make, model, or features"
            className="w-full h-full outline-none text-gray-500"
          />
          <img
            src={assets.filter_icon}
            alt="filter-icon"
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="text-gray-500 xl:px-20 max-w-7xl mx-auto">
          Showing {filteredCars?.length} Cars
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars?.map((car, index) => (
            <div key={index}>
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cars;
