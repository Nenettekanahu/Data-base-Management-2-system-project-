import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Flights from "./pages/Flights";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Login from "./pages/Login";
import About from "./pages/About";
import Register from "./pages/Register";

import CrewDashboard from "./pages/CrewDashboard";
import CrewBookings from "./pages/CrewBookings";
import CrewPayments from "./pages/CrewPayments";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

function App() {

  const [user, setUser] = useState(null);

  const handleLogout = () => setUser(null);

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />


        {/* PASSENGER */}
        <Route
          path="/bookings"
          element={
            user?.role === "passenger"
              ? <Bookings user={user} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/payments"
          element={
            user?.role === "passenger"
              ? <Payments user={user} />
              : <Navigate to="/login" replace />
          }
        />


        {/* CREW */}
        <Route
          path="/crew-dashboard"
          element={
            user?.role === "crew"
              ? <CrewDashboard user={user} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/crew/bookings"
          element={
            user?.role === "crew"
              ? <CrewBookings />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/crew/payments"
          element={
            user?.role === "crew"
              ? <CrewPayments />
              : <Navigate to="/login" replace />
          }
        />


        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin"
              ? <AdminDashboard user={user} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/users"
          element={
            user?.role === "admin"
              ? <AdminUsers />
              : <Navigate to="/login" replace />
          }
        />


        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default App;
