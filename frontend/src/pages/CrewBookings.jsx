import { useEffect, useState } from "react";
import "./CrewBookings.css";

function CrewBookings() {
  const [bookings, setBookings] = useState([]);
  const [editData, setEditData] = useState(null);

  // Fetch all bookings
  const loadBookings = () => {
    fetch(`http://localhost/DBMS/backend/api/crewBookings.php`)
      .then((res) => res.json())
      .then((data) => setBookings(data.data));
  };

  useEffect(() => loadBookings(), []);

  // Handle booking delete
  const deleteBooking = (id) => {
    if (!window.confirm("Delete this booking?")) return;

    fetch(
      `http://localhost/DBMS/backend/api/crewBookings.php?bookingID=${id}`,
      { method: "DELETE" }
    )
      .then((res) => res.json())
      .then(() => loadBookings());
  };

  // Handle update
  const saveUpdate = () => {
    fetch(`http://localhost/DBMS/backend/api/crewBookings.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then(() => {
        setEditData(null);
        loadBookings();
      });
  };

  return (
    <div className="crewbookings-page">
      <h1>Manage Bookings 👨‍✈️</h1>
      <p className="subtitle">View, edit, and cancel bookings</p>

      <table className="crewbookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Passenger</th>
            <th>Flight</th>
            <th>Route</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Edit</th>
            <th>Cancel</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingID}>
              <td>{b.bookingID}</td>
              <td>{b.first_name} {b.last_name}</td>
              <td>{b.flight_number}</td>
              <td>{b.origin} → {b.dest}</td>
              <td>${b.total_amount}</td>
              <td>{b.booking_date}</td>

              <td>
                <button 
                  className="edit-btn"
                  onClick={() => setEditData({
                    bookingID: b.bookingID,
                    flightID: "",
                    airportID: "",
                    total_amount: ""
                  })}
                >
                  Edit
                </button>
              </td>

              <td>
                <button 
                  className="delete-btn"
                  onClick={() => deleteBooking(b.bookingID)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editData && (
        <div className="edit-box">
          <h3>Edit Booking #{editData.bookingID}</h3>

          <input
            type="number"
            placeholder="New flight ID"
            onChange={(e) => 
              setEditData({ ...editData, flightID: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="New airport ID"
            onChange={(e) => 
              setEditData({ ...editData, airportID: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="New amount"
            onChange={(e) => 
              setEditData({ ...editData, total_amount: e.target.value })
            }
          />

          <button onClick={saveUpdate}>Save</button>
          <button onClick={() => setEditData(null)}>Cancel</button>
        </div>
      )}

    </div>
  );
}

export default CrewBookings;
