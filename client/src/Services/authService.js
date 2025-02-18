import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Replace with your actual backend URL

// Signup function
export const signup = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Login function
export const login = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
