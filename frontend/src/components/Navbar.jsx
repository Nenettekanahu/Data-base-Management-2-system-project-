import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, onLogout }) {

  const navigate = useNavigate();

  // ==== MENU PASSENGER ====
  const passengerMenu = (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/flights">Flights</Link></li>
      <li><Link to="/bookings">My Bookings</Link></li>
      <li><Link to="/payments">My Payments</Link></li>
    </>
  );

  // ==== MENU CREW ====
  const crewMenu = (
    <>
      <li><Link to="/crew-dashboard">Dashboard</Link></li>
      <li><Link to="/crew/bookings">Bookings</Link></li>
      <li><Link to="/crew/payments">Payments</Link></li>
      <li><Link to="/flights">Flights</Link></li>
    </>
  );

  // ==== MENU ADMIN ====
  const adminMenu = (
    <>
      <li><Link to="/admin-dashboard">Dashboard</Link></li>
      <li><Link to="/admin/users">Manage Users</Link></li>
      <li><Link to="/flights">Flights</Link></li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("/")}>
          Fly<span>next</span>
        </div>

        {/* NAV LINKS */}
        <ul className="navbar-links">

          {/* Public menu */}
          {!user && (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/flights">Flights</Link></li>
            </>
          )}

          {/* Protected menus */}
          {user?.role === "passenger" && passengerMenu}
          {user?.role === "crew" && crewMenu}
          {user?.role === "admin" && adminMenu}
        </ul>

        {/* RIGHT SECTION */}
        <div className="navbar-right">

          {/* If not logged in */}
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="navbar-btn"
            >
              Sign In
            </button>
          )}

          {/* If logged in */}
          {user && (
            <>
              <span className="welcome-text">
                Hello, {user.first_name} ({user.role})
              </span>

              <button
                className="navbar-btn"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
