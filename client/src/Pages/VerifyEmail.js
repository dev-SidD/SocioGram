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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Verification</h2>
        <p className={`text-lg font-medium ${color}`}>{status}</p>
        <p className="text-sm mt-4 text-gray-500">Redirecting to login page...</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
