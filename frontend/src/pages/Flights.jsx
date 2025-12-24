import { useEffect, useState } from "react";
import "./Flights.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/DBMS/backend/api/flights.php")
      .then((res) => res.json())
      .then((data) => {
        setFlights(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching flights:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flights-page">
      <h1>Available Flights</h1>
      <p className="subtitle">
        Browse and manage all available flights in the system.
      </p>

      {loading ? (
        <p>Loading flights...</p>
      ) : (
        <div className="flights-table-container">
          <table className="flights-table">
            <thead>
              <tr>
                <th>Flight</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flightID}>
                  <td>{flight.flight_number}</td>
                  <td>{flight.origin_airportID}</td>
                  <td>{flight.destination_airportID}</td>
                  <td>{flight.departure_time}</td>
                  <td>{flight.arrival_time}</td>
                  <td className="price">${flight.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Flights;
