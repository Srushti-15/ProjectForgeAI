import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import CandidateDashboard from './pages/Dashboards/CandidateDashboard';
import ReferrerDashboard from './pages/Dashboards/ReferrerDashboard';
import RecruiterDashboard from './pages/Dashboards/RecruiterDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import CompleteProfile from './pages/Auth/CompleteProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/referrer/dashboard" element={<ReferrerDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
