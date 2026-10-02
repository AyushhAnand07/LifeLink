import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="page-center">
      <div className="auth-card">
        <div className="brand">
          <h1>🩸 LifeLink</h1>
          <p>Emergency Blood Donor Matching</p>
        </div>
        <h2>Welcome back</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <p className="switch-text">
          No account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
