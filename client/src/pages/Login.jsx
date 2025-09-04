import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// --- Import Icons ---
import { FaGoogle, FaGithub, FaFacebookF } from 'react-icons/fa';
import { FiArrowRight, FiLoader, FiEye, FiEyeOff } from 'react-icons/fi';

// --- Import Illustration ---
// Make sure the path to your illustration is correct
import loginIllustration from '../assets/login-illustration1.png'; 

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      nav('/'); // Navigate to home or dashboard on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="relative w-full max-w-4xl flex bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-pink-500">FleetLink</h1>
          <p className="mt-4 text-gray-600">Welcome back!</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-800">Log In</h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 bg-blue-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-gray-500 hover:text-blue-600">Forgot Password?</a>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                className="mt-1 w-full p-3 bg-blue-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            
            {/* Error Message */}
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-pink-500 text-white font-bold p-3 rounded-lg hover:bg-pink-600 transition-all duration-300 disabled:bg-pink-300"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'LOGIN'}
              {!loading && <FiArrowRight className="ml-2" />}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-xs text-gray-500">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Logins */}
          <div className="mt-6 flex justify-center space-x-4">
            <button className="p-3 border rounded-full hover:bg-gray-50 transition"><FaGoogle size={20} className="text-red-500" /></button>
            <button className="p-3 border rounded-full hover:bg-gray-50 transition"><FaGithub size={20} className="text-gray-800" /></button>
            <button className="p-3 border rounded-full hover:bg-gray-50 transition"><FaFacebookF size={20} className="text-blue-600" /></button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-xs text-center text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-blue-200 p-4">
          <img src={loginIllustration} alt="Login Illustration" className="w-full h-[60%] object-cover" />
        </div>
      </div>
    </div>
  );
}