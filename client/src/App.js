// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import UserProfile from './Pages/userProfile';
import UpdateProfile from './Pages/updateProfile';
import CreatePost from './Pages/CreatePost';
import ViewUserProfile from './Pages/ViewUserProfile';
import SearchPage from './Pages/SearchPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Header from './components/Header';
import VerifyEmail from './Pages/VerifyEmail';
import { SocketProvider } from './context/SocketContext';
import { UserProvider, useUser } from './context/UserContext';

const App = () => (
  <UserProvider>
    <AppWithSocket />
  </UserProvider>
);

const AppWithSocket = () => {
  const { user } = useUser();
  const userId = user?._id || user?.id || null; // adjust depending on your user object

  return (
    <SocketProvider userId={userId}>
      <Router>
        <div className="App min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            {/* Authenticated Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/profile/:username" element={<ViewUserProfile />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
};

export default App;
