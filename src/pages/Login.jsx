import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserAlt, FaLock, FaSpinner } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/booking";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("📧 Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Attempting login...");

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📨 Response status:", response.status);
      const data = await response.json();
      console.log("📨 Response data:", data);

      if (response.ok) {
        const token = data?.data?.token;
        const user = data?.data?.user;

        if (!token || !user) {
          console.warn("Token or user missing in response!");
          console.log("Full backend response:", data);
          setError("Invalid response format from server. Check backend structure.");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Saved token:", token);
        console.log("Saved user:", user);
        alert("🎉 Login successful!");
        navigate(from, { replace: true });


        console.log("✅ Token saved to localStorage:", token);
        alert("🎉 Login successful!");
        navigate(from, { replace: true });
      } else {
        // Login failed
        let errorMessage = "Login failed";
        if (response.status === 401) {
          errorMessage = "❌ Invalid email or password";
        } else if (response.status === 404) {
          errorMessage = "📭 User not found";
        } else if (response.status === 400) {
          errorMessage = data.message || "Invalid data";
        } else {
          errorMessage = data.message || "Server error";
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("🚫 Cannot connect to server - please check your connection");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("123456");
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-header">
          <h1>RedSea Hotel</h1>
          <p>Welcome Back! Login to your account</p>
          {location.state?.from && (
            <div
              style={{
                fontSize: "12px",
                color: "#667eea",
                marginTop: "5px",
                fontStyle: "italic",
              }}
            >
              ↪ Redirecting to: {location.state.from.pathname}
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn demo-btn"
            style={{
              background: "#6c757d",
              color: "white",
              padding: "8px 16px",
              fontSize: "12px",
            }}
          >
            🚀 Try with demo data
          </button>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            <Link
              to="/forgot-password"
              style={{ fontSize: "14px", color: "#667eea" }}
            >
              Forgot your password?
            </Link>
          </p>
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "#666",
            textAlign: "center",
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          🔧 Debug Info:
          <br />
          Server: http://localhost:5000
          <br />
          Endpoint: /api/auth/login
          <br />
          Redirecting to: {from}
        </div>
      </div>
    </div>
  );
};

export default Login;
