import { useState, useEffect } from "react";
import "./AdminDashboard.css";

function AdminDashboard({ user }) {

  // ---------------------------------------------------------
  // FORM STATE (CREATE CREW)
  // ---------------------------------------------------------
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    job_title: "Pilot",
  });

  // ---------------------------------------------------------
  // CREW LIST STATE
  // ---------------------------------------------------------
  const [crewList, setCrewList] = useState([]);

  // ---------------------------------------------------------
  // EDIT MODAL STATE
  // ---------------------------------------------------------
  const [editModal, setEditModal] = useState(null);

  // ---------------------------------------------------------
  // FETCH CREW LIST
  // ---------------------------------------------------------
  const fetchCrew = () => {
    fetch("http://localhost/DBMS/backend/api/getCrew.php")
      .then(res => res.json())
      .then(data => setCrewList(data.data));
  };

  useEffect(() => {
    fetchCrew();
  }, []);

  // ---------------------------------------------------------
  // HANDLE INPUT CHANGES
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ---------------------------------------------------------
  // CREATE CREW MEMBER
  // ---------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/DBMS/backend/api/createCrew.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setMsg(data.message);
        fetchCrew();
      });
  };

  // ---------------------------------------------------------
  // DELETE CREW MEMBER
  // ---------------------------------------------------------
  const deleteCrew = (id) => {
    if (!window.confirm("Delete this employee?")) return;

    fetch("http://localhost/DBMS/backend/api/deleteCrew.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: id })
    })
      .then(res => res.json())
      .then(() => fetchCrew());
  };

  // ---------------------------------------------------------
  // UPDATE CREW MEMBER
  // ---------------------------------------------------------
  const updateCrew = () => {
    fetch("http://localhost/DBMS/backend/api/updateCrew.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editModal)
    })
      .then(res => res.json())
      .then(() => {
        setEditModal(null);
        fetchCrew();
      });
  };

  return (
    <div className="admin-dashboard">

      {/* HEADER ------------------------------------------------ */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome {user.first_name} — manage users, crew, flights, and bookings.</p>
      </div>

      {/* CARDS ------------------------------------------------- */}
      <div className="admin-cards">
        <div className="admin-card"><h2>Total Users</h2><p className="stat-number">34</p></div>
        <div className="admin-card"><h2>Total Crew</h2><p className="stat-number">{crewList.length}</p></div>
        <div className="admin-card"><h2>Total Bookings</h2><p className="stat-number">62</p></div>
        <div className="admin-card"><h2>Total Payments</h2><p className="stat-number">$24,820</p></div>
      </div>

      {/* FORM TITLE ------------------------------------------- */}
      <h2 className="section-title">➕ Create Crew Member</h2>

      {msg && <p className="form-message">{msg}</p>}

      {/* FORM -------------------------------------------------- */}
      <form className="crew-form" onSubmit={handleSubmit}>
        
        <input type="text" name="username" placeholder="Username"
          value={form.username} onChange={handleChange} required />

        <input type="text" name="first_name" placeholder="First Name"
          value={form.first_name} onChange={handleChange} required />

        <input type="text" name="last_name" placeholder="Last Name"
          value={form.last_name} onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email Address"
          value={form.email} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required />

        <select name="job_title" value={form.job_title} onChange={handleChange}>
          <option value="Pilot">Pilot</option>
          <option value="Flight Attendant">Flight Attendant</option>
          <option value="Engineer">Engineer</option>
        </select>

        <button type="submit" className="admin-btn">Create Crew</button>
      </form>

      {/* CREW LIST TABLE -------------------------------------- */}
      <h2 className="section-title">👥 Crew Members</h2>

      <table className="crew-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {crewList.map(c => (
            <tr key={c.userID}>
              <td>{c.first_name} {c.last_name}</td>
              <td>{c.email}</td>
              <td>{c.job_title}</td>
              <td>
                <button 
                  onClick={() => setEditModal(c)}
                >Edit</button>

                <button 
                  onClick={() => deleteCrew(c.userID)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL ------------------------------------------- */}
      {editModal && (
        <div className="modal">
          <div className="modal-box">

            <h2>Edit Crew Member</h2>

            <input 
              value={editModal.first_name}
              onChange={(e) => setEditModal({...editModal, first_name: e.target.value})}
            />

            <input 
              value={editModal.last_name}
              onChange={(e) => setEditModal({...editModal, last_name: e.target.value})}
            />

            <input 
              value={editModal.email}
              onChange={(e) => setEditModal({...editModal, email: e.target.value})}
            />

            <select
              value={editModal.job_title}
              onChange={(e) => setEditModal({...editModal, job_title: e.target.value})}
            >
              <option>Pilot</option>
              <option>Flight Attendant</option>
              <option>Engineer</option>
            </select>

            <button onClick={updateCrew}>Save</button>
            <button onClick={() => setEditModal(null)}>Cancel</button>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
