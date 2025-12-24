import { Link } from "react-router-dom";
import "./CrewDashboard.css";

function CrewDashboard({ user }) {
  return (
    <div className="crew-dashboard">

      {/* Header section */}
      <header className="crew-header">
        <h1>Welcome, {user.first_name}</h1>
        <p>Crew Control Center</p>
      </header>

      {/* Cards section */}
      <div className="crew-cards">

        <Link to="/crew/bookings" className="crew-card">
          <span className="icon">📘</span>
          <h3>Manage Bookings</h3>
          <p>Edit, update or cancel bookings.</p>
        </Link>

        <Link to="/crew/payments" className="crew-card">
          <span className="icon">💳</span>
          <h3>Manage Payments</h3>
          <p>Approve or review payments.</p>
        </Link>

        <Link to="/flights" className="crew-card">
          <span className="icon">✈️</span>
          <h3>View Flights</h3>
          <p>Review all flights in the system.</p>
        </Link>
        
      </div>

    </div>
  );
}

export default CrewDashboard;
