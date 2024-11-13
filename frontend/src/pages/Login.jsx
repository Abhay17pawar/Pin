import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer } from 'react-leaflet';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    latitude: null,
    longitude: null,
  });
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const navigate = useNavigate();

  // Function to get the user's current location using the Geolocation API
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({
            ...formData,
            latitude,
            longitude,
          });
          setIsLocationFetched(true);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          alert('Unable to fetch your location.');
        },
        { timeout: 10000 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, payload);
        navigate('/Home');
    } catch (error) {
      console.error('Registration failed:', error.response || error);
      alert('Registration failed! Please try again later.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Map (60% width) */}
      <div className="w-3/5 relative">
        {isLocationFetched ? (
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={13}
            style={{ height: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        ) : (
          <div className="absolute inset-0 bg-gray-300 flex justify-center items-center">
            <span className="text-white">Loading Map...</span>
          </div>
        )}
      </div>

      <div className="w-2/5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-8 flex flex-col justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-4/5 mx-auto">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                {...register('email', {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                {...register('password', {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="********"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-700">Don't have an account? </span>
            <a href="/" className="text-green-600 hover:underline">Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
