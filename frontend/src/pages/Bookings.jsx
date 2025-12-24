import { useEffect, useState } from "react";
import "./Bookings.css";

function Bookings({ user }) {
  const [passenger, setPassenger] = useState(null);
  const [airports, setAirports] = useState([]);
  const [search, setSearch] = useState({
    from: "",
    to: "",
    date: "",
  });
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);

  // ============================
  // Load passenger + airports + bookings
  // ============================
  useEffect(() => {
    // 1) get passenger for current user
    fetch(
      `http://localhost/DBMS/backend/api/getPassenger.php?userID=${user.userID}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setPassenger(data.data);
        }
      });

    // 2) airports list
    fetch("http://localhost/DBMS/backend/api/airports.php")
      .then((res) => res.json())
      .then((data) => setAirports(data.data || []));

    // 3) user bookings
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    fetch(
      `http://localhost/DBMS/backend/api/bookings.php?userID=${user.userID}`
    )
      .then((res) => res.json())
      .then((data) => setBookings(data.data || []));
  };

  // ============================
  // Search form handlers
  // ============================
  const handleSearchChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (search.from) params.append("from", search.from);
    if (search.to) params.append("to", search.to);
    if (search.date) params.append("date", search.date);

    fetch(
      `http://localhost/DBMS/backend/api/flights.php?${params.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {
        setAvailableFlights(data.data || []);
        setSelectedFlight(null);
      });
  };

  // ============================
  // Booking creation
  // ============================
  const handleConfirmBooking = () => {
    if (!passenger) {
      alert("Passenger not found for this user.");
      return;
    }
    if (!selectedFlight) {
      alert("Please select a flight first.");
      return;
    }

    const payload = {
      passengerID: passenger.passengerID,
      airportID: selectedFlight.origin_airportID, // we use origin airport
      flightID: selectedFlight.flightID,
      total_amount: selectedFlight.price,
    };

    fetch("http://localhost/DBMS/backend/api/bookings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchBookings();
        setSelectedFlight(null);
        alert("Booking created successfully!");
      });
  };

  // helper to display airport nicely
  const getAirportLabel = (airportID) => {
    const a = airports.find((ap) => ap.airportID === Number(airportID));
    if (!a) return "";
    return `${a.city} (${a.airport_code})`;
  };

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <p className="subtitle">
        Search for flights and manage your reservations.
      </p>

      {/* SEARCH + AVAILABLE FLIGHTS */}
      <div className="booking-form-container">
        <h2>Search Flights</h2>

        <form className="booking-form" onSubmit={handleSearchSubmit}>
          <select
            name="from"
            value={search.from}
            onChange={handleSearchChange}
          >
            <option value="">From (City)</option>
            {airports.map((a) => (
              <option key={a.airportID} value={a.airportID}>
                {a.city} ({a.airport_code})
              </option>
            ))}
          </select>

          <select name="to" value={search.to} onChange={handleSearchChange}>
            <option value="">To (City)</option>
            {airports.map((a) => (
              <option key={a.airportID} value={a.airportID}>
                {a.city} ({a.airport_code})
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={search.date}
            onChange={handleSearchChange}
          />

          <button type="submit">Search Flights</button>
        </form>

        {/* AVAILABLE FLIGHTS TABLE */}
        {availableFlights.length > 0 && (
          <div className="available-flights">
            <h3>Available Flights</h3>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {availableFlights.map((f) => (
                  <tr
                    key={f.flightID}
                    className={
                      selectedFlight && selectedFlight.flightID === f.flightID
                        ? "selected-row"
                        : ""
                    }
                  >
                    <td>{f.flight_number}</td>
                    <td>
                      {f.origin_city} ({f.origin_code}) → {f.dest_city} (
                      {f.dest_code})
                    </td>
                    <td>{f.departure_time}</td>
                    <td>{f.arrival_time}</td>
                    <td className="price">${f.price}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedFlight(f)}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedFlight && (
              <div className="selected-flight-summary">
                <p>
                  Selected: <strong>{selectedFlight.flight_number}</strong> —{" "}
                  {selectedFlight.origin_city} ({selectedFlight.origin_code}) →
                  {selectedFlight.dest_city} ({selectedFlight.dest_code}) —{" "}
                  <strong>${selectedFlight.price}</strong>
                </p>
                <button onClick={handleConfirmBooking}>
                  Confirm Booking
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BOOKING HISTORY */}
      <div className="bookings-table-container">
        <h2>Booking History</h2>

        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Passport</th>
              <th>Flight</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingID}>
                <td>{b.bookingID}</td>
                <td>{b.passport_number}</td>
                <td>{b.flight_number}</td>
                <td>{b.booking_date}</td>
                <td className="price">${b.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p style={{ marginTop: 10 }}>No bookings yet.</p>
        )}
      </div>
    </div>
  );
}

export default Bookings;
