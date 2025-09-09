import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const [color, setColor] = useState("text-gray-600");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
        setStatus(res.data.msg || "Email verified successfully!");
        setColor("text-green-600");

        setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
      } catch (err) {
        setStatus(err.response?.data?.msg || "Verification failed or token expired.");
        setColor("text-red-600");
      }
    };

    verify();
  }, [token, navigate]);

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
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              {color === "text-green-600" ? (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h2>
            <p className={`text-lg font-medium mb-6 ${color}`}>{status}</p>
            
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              <span className="text-sm">Redirecting to login page...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
