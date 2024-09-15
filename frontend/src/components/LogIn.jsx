import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:4400/api/v1/login', 
        { email, password }, 
        { withCredentials: true }
      );
      
      // We don't need to store the token in localStorage when using HTTP-only cookies
      // localStorage.setItem('token', response.data.token);

      login(response.data.user); // Assuming the response includes user data
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl mb-4 text-center">Log In</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">Don't have an account?</p>
        <button
          onClick={onSwitchToSignup}
          className="text-green-500 hover:text-green-700 font-bold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;