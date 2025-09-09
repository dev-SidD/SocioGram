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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl animate-logo-glow animate-logo-float"
            style={{ 
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              letterSpacing: "-0.03em"
            }}
          >
            SocioGram
          </h1>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Forgot Password
          </h2>

          {msg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-2xl text-center">
              {msg}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 backdrop-blur-sm"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 rounded-2xl transition-all duration-200 font-semibold transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            You'll receive a link to reset your password if your email is registered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
