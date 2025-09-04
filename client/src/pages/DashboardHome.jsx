import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCar, FaListAlt, FaHourglassHalf } from 'react-icons/fa';

// --- Reusable Stat Card Component ---
const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel for better performance
        const [vehiclesRes, bookingsRes, pendingRes] = await Promise.all([
          API.get('/vehicles/my-vehicles'),
          API.get('/bookings/admin'), // Assuming this endpoint gets all bookings
          API.get('/bookings/admin?status=PENDING')
        ]);

          console.log('data', vehiclesRes);


        setStats({
          totalVehicles: vehiclesRes.data?.vehicles?.length || 0,
          totalBookings: bookingsRes.data?.bookings?.length || 0,
          pendingBookings: pendingRes.data?.bookings?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  // --- Sample data for the chart ---
  // In a real application, you would generate this from your booking data
  const chartData = [
    { name: 'Mon', bookings: 4 },
    { name: 'Tue', bookings: 3 },
    { name: 'Wed', bookings: 5 },
    { name: 'Thu', bookings: 2 },
    { name: 'Fri', bookings: 7 },
    { name: 'Sat', bookings: 6 },
    { name: 'Sun', bookings: 8 },
  ];

  if (loading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your fleet's activity.</p>
      </div>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<FaListAlt className="text-blue-500" />} title="Total Bookings" value={stats.totalBookings} color="border-blue-500" />
        <StatCard icon={<FaCar className="text-green-500" />} title="Total Vehicles" value={stats.totalVehicles} color="border-green-500" />
        <StatCard icon={<FaHourglassHalf className="text-yellow-500" />} title="Pending Bookings" value={stats.pendingBookings} color="border-yellow-500" />
      </div>

      {/* --- Bookings Chart --- */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Bookings Overview</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{ borderRadius: '10px' }} />
              <Legend />
              <Bar dataKey="bookings" fill="#3B82F6" barSize={30} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}