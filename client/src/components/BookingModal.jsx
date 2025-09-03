import React, { useState } from 'react';
import API from '../api/api';

export default function BookingModal({ vehicle, onClose, onBooked }) {
  const [fromPincode, setFrom] = useState('');
  const [toPincode, setTo] = useState('');
  const [startTime, setStart] = useState('');

  const submit = async () => {
    try {
      await API.post('/bookings', { vehicleId: vehicle._id, fromPincode, toPincode, startTime });
      alert('Booking created');
      onBooked();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-6 rounded">
        <h3 className="text-xl mb-2">Book {vehicle.name}</h3>
        <input value={fromPincode} onChange={e=>setFrom(e.target.value)} className="w-full border p-2 mb-2" placeholder="From Pincode"/>
        <input value={toPincode} onChange={e=>setTo(e.target.value)} className="w-full border p-2 mb-2" placeholder="To Pincode"/>
        <input value={startTime} onChange={e=>setStart(e.target.value)} type="datetime-local" className="w-full border p-2 mb-4"/>
        <div className="flex gap-2">
          <button onClick={submit} className="flex-1 bg-blue-600 text-white p-2 rounded">Confirm</button>
          <button onClick={onClose} className="flex-1 border p-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
