
import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiLoader } from 'react-icons/fi'; // Icons for upload and loading
import toast from 'react-hot-toast';

// --- Reusable Input Field Component ---
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      {...props}
    />
  </div>
);

export default function VehicleAdd() {
  const [form, setForm] = useState({ name: '', capacityKg: '', tyres: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a temporary URL for the image preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('capacityKg', form.capacityKg);
    fd.append('tyres', form.tyres);
    if (image) {
      fd.append('image', image);
    }

    try {
      await API.post('/vehicles/add', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Consider using a more modern notification system (e.g., react-hot-toast) in a real app
      toast.success('Vehicle added successfully!');
      nav('/admin'); // Navigate to the main dashboard after success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Vehicle</h1>
      
      <form onSubmit={submit} className="space-y-6">
        {/* --- Form Fields --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput label="Vehicle Name" id="name" name="name" type="text" value={form.name} onChange={handleInputChange} required />
          <FormInput label="Capacity (Kg)" id="capacityKg" name="capacityKg" type="number" value={form.capacityKg} onChange={handleInputChange} required />
        </div>
        <FormInput label="Tyre Type" id="tyres" name="tyres" type="text" value={form.tyres} onChange={handleInputChange} required />

        {/* --- Custom File Input --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* --- Image Preview --- */}
        {imagePreview && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
            <img src={imagePreview} alt="Vehicle Preview" className="w-48 h-auto rounded-lg shadow-sm" />
          </div>
        )}

        {/* --- Error Message Display --- */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* --- Submit Button with Loading State --- */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <FiLoader className="animate-spin h-5 w-5" /> : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
}