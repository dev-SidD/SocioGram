import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import UserProfile from './Pages/userProfile';
import Navbar from './components/Navbar';
import UpdateProfile from './Pages/updateProfile';
import CreatePost from './Pages/CreatePost';
import ViewUserProfile from './Pages/ViewUserProfile';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];

  return (
    <div className="App">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/create-post" element={<CreatePost/>} />
        <Route path="/profile/:username" element={<ViewUserProfile/>} />
      </Routes>
    </div>
  );
}

export default App;
