import { useEffect, useState } from "react";
import "./CrewPayments.css";

function CrewPayments() {

  const [payments, setPayments] = useState([]);

  const fetchPayments = () => {
    fetch("http://localhost/DBMS/backend/api/crew_payments.php")
      .then(res => res.json())
      .then(data => setPayments(data.data));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updateStatus = (paymentID, newStatus) => {
    fetch("http://localhost/DBMS/backend/api/crew_payments.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentID,
        payment_status: newStatus
      })
    })
      .then(res => res.json())
      .then(() => fetchPayments());
  };

  return (
    <div className="crew-payments">
      <h1>Manage All Payments</h1>
      <p>Modify any payment status in real time.</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Passenger</th>
            <th>Flight</th>
            <th>Method</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(p => (
            <tr key={p.paymentID}>
              <td>{p.paymentID}</td>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.flight_number}</td>
              <td>{p.payment_method}</td>
              <td>{p.payment_status}</td>
              <td>${p.total_amount}</td>
              <td>{p.payment_date}</td>

              <td>
                <select
                  value={p.payment_status}
                  onChange={(e) => updateStatus(p.paymentID, e.target.value)}
                >
                  <option value="completed">completed</option>
                  <option value="pending">pending</option>
                  <option value="failed">failed</option>
                </select>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrewPayments;
