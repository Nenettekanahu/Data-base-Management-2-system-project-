import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    fetch("http://localhost/DBMS/backend/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(data => {

      if (data.status === "success") {

        onLogin(data.user);

        if (data.user.role === "crew") {
          navigate("/crew-dashboard");
        }
        else if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        }
        else {
          navigate("/bookings");
        }

      } else {
        setError(data.message || "Login failed");
      }

    })
    .catch(() => setError("Server error, please try again."));
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your bookings and payments.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: "#f97373", marginBottom: 10 }}>{error}</p>}

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <div className="login-row">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="button" className="link-btn">
              Forgot password?
            </button>
          </div>

          <button className="login-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <span>Don’t have an account?</span>
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
