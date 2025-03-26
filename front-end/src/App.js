import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import SignUpPage from "./pages/SignUpPage";
import GymsPage from "./pages/GymsPage";
import AdminDashboard from "./pages/AdminDashboard";
import BookingsCRUD from "./pages/BookingsCRUD";
import GymsCRUD from "./pages/GymsCRUD";
import TimeSlotsCRUD from "./pages/TimeSlotsCRUD";
import UsersCRUD from "./pages/UsersCRUD";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TimeSlotsPage from "./pages/TimeSlotsPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";

// Setăm baza URL pentru cererile HTTP făcute cu axios
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true; // Permitem trimiterea cookie-urilor cu cererile HTTP

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Rutele aplicației */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gyms" element={<GymsPage />} />
          <Route path="/gyms/:gymId/timeslots" element={<TimeSlotsPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<BookingsCRUD />} />
          <Route path="/admin/gyms" element={<GymsCRUD />} />
          <Route path="/admin/timeslots" element={<TimeSlotsCRUD />} />
          <Route path="/admin/users" element={<UsersCRUD />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/booking-confirmation/:bookingId"
            element={<BookingConfirmationPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
