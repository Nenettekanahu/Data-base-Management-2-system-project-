import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    passport_number: "",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/DBMS/backend/api/register.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {

        if (data.status === "success") {
          setMsg("Account created! You can login now.");
        } else {
          setMsg(data.message);
        }
      });
  };

  return (
    <div className="register-page">
      <div className="register-box">
        
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join Flynext and start booking flights instantly.</p>
        </div>

        {msg && <p style={{ color: "#ffaa00", marginBottom: 12 }}>{msg}</p>}

        <form className="register-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="text"
            name="passport_number"
            placeholder="Passport No."
            value={formData.passport_number}
            onChange={handleChange}
          />

          <button type="submit" className="register-btn">
            Register
          </button>

        </form>

        <div className="register-footer">
          Already have an account? 
          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;
