import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email,
      });

      setMsg(res.data.message || 'Reset link sent successfully.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {msg && (
          <p className="text-green-600 text-sm text-center mb-4">{msg}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-200 font-medium"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You’ll receive a link to reset your password if your email is registered.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
