import { useEffect, useState } from "react";
import "./Payments.css";

function Payments({ user }) {
  const [payments, setPayments] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [formData, setFormData] = useState({
    bookingID: "",
    payment_method: "",
    payment_status: "",
  });

  // Load booking dropdown + payments
  useEffect(() => {
    fetchBookingList();
    fetchPayments();
  }, []);

  // ============================
  // Fetch bookings for dropdown
  // ============================
  const fetchBookingList = () => {
    fetch(
      `http://localhost/DBMS/backend/api/bookingList.php?userID=${user.userID}`
    )
      .then((res) => res.json())
      .then((data) => setBookingList(data.data || []));
  };

  // ============================
  // Fetch user payments
  // ============================
  const fetchPayments = () => {
    fetch(
      `http://localhost/DBMS/backend/api/payments.php?userID=${user.userID}`
    )
      .then((res) => res.json())
      .then((data) => setPayments(data.data || []));
  };

  // ============================
  // Input handler
  // ============================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // Submit new payment
  // ============================
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/DBMS/backend/api/payments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchPayments();
        setFormData({
          bookingID: "",
          payment_method: "",
          payment_status: "",
        });
        alert("Payment added successfully!");
      });
  };

  return (
    <div className="payments-page">
      <h1>My Payments</h1>
      <p className="subtitle">Track and manage your flight payments.</p>

      {/* FORM */}
      <div className="payment-form-container">
        <h2>Add Payment</h2>

        <form className="payment-form" onSubmit={handleSubmit}>
          {/* BOOKING SELECT */}
          <select
            name="bookingID"
            value={formData.bookingID}
            onChange={handleChange}
          >
            <option value="">Choose Booking</option>
            {bookingList.map((b) => (
              <option key={b.bookingID} value={b.bookingID}>
                #{b.bookingID} — {b.origin} → {b.dest} — ${b.total_amount}
              </option>
            ))}
          </select>

          {/* METHOD */}
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <option value="">Payment Method</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>

          {/* STATUS */}
          <select
            name="payment_status"
            value={formData.payment_status}
            onChange={handleChange}
          >
            <option value="">Payment Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <button type="submit">Confirm Payment</button>
        </form>
      </div>

      {/* HISTORY */}
      <div className="payments-table-container">
        <h2>Payment History</h2>

        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Flight</th>
              <th>Route</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Receipt</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p.paymentID}>
                <td>{p.paymentID}</td>
                <td>{p.flight_number}</td>
                <td>
                  {p.origin} → {p.dest}
                </td>
                <td className="price">${p.total_amount}</td>
                <td>{p.payment_method}</td>
                <td className={`status ${p.payment_status}`}>
                  {p.payment_status}
                </td>
                <td>{p.payment_date}</td>
                <td>
                  <a 
                    href={`http://localhost/DBMS/backend/api/paymentReceipt.php?paymentID=${p.paymentID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p style={{ marginTop: 10 }}>No payments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Payments;
