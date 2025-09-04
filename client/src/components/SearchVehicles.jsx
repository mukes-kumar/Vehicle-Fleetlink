import React, { useState } from 'react';
import API from '../api/api';
import { FiSearch } from 'react-icons/fi';

export default function SearchVehicles({ setAvailableVehicles, setIsLoading, setError }) {
  const [form, setForm] = useState({
    capacityRequired: '',
    fromPincode: '',
    toPincode: '',
    startTime: '',
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAvailableVehicles(null); // Clear previous results

    try {
      // The startTime from datetime-local needs to be converted to ISO string format
      const isoStartTime = new Date(form.startTime).toISOString();

      const params = new URLSearchParams({
        capacityRequired: form.capacityRequired,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: isoStartTime,
      });

      const { data } = await API.get(`/vehicles/available?${params.toString()}`);
      setAvailableVehicles(data.vehicles || []); // Expect an array of vehicles

    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch vehicles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 shadow-xl rounded-lg grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4 items-end"
    >

      <div className="md:col-span-1">
        <label className="block text-xs font-semibold text-gray-500">Capacity (Kg)</label>
        <input type="number" name="capacityRequired" value={form.capacityRequired} onChange={handleInputChange} className="mt-1 w-full p-2 border-b-2 focus:border-orange-500 outline-none" placeholder="e.g., 2000" required />
      </div>
      <div className="md:col-span-1">
        <label className="block text-xs font-semibold text-gray-500">From Pincode</label>
        <input type="text" name="fromPincode" value={form.fromPincode} onChange={handleInputChange} className="mt-1 w-full p-2 border-b-2 focus:border-orange-500 outline-none" placeholder="e.g., 110001" required />
      </div>
      <div className="md:col-span-1">
        <label className="block text-xs font-semibold text-gray-500">To Pincode</label>
        <input type="text" name="toPincode" value={form.toPincode} onChange={handleInputChange} className="mt-1 w-full p-2 border-b-2 focus:border-orange-500 outline-none" placeholder="e.g., 110025" required />
      </div>
      <div className="md:col-span-1">
        <label className="block text-xs font-semibold text-gray-500">Pickup Date & Time</label>
        <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleInputChange} className="mt-1 w-full p-2 border-b-2 focus:border-orange-500 outline-none" required />
      </div>
      <div className="lg:col-span-1">
        <button type="submit" className="w-full flex items-center justify-center bg-orange-500 text-white font-bold p-3 rounded-md hover:bg-orange-600 transition">
          <FiSearch className="mr-2" /> Search Now
        </button>
      </div>
    </form>
  );
}