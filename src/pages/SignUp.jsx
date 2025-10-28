import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaLock, FaFacebookF, FaGoogle, FaMicrosoft } from "react-icons/fa";
import "./SignUp.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // استخدام URL مباشر
    const API_URL = "http://localhost:5000";
    const apiUrl = `${API_URL}/api/auth/signup`;
    
    console.log("🔄 Attempting signup...");
    console.log("URL:", apiUrl);
    console.log("Data:", { name, email, password: "***" });

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("📨 Response status:", response.status);
      console.log("📨 Response ok:", response.ok);

      const data = await response.json();
      console.log("📨 Response data:", data);

      if (response.ok) {
        alert("🎉 Account created successfully!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/booking");
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert("Server error - please try again later\n\nCheck browser console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    alert(`${provider} OAuth is not configured yet`);
  };

  return (
    <div className="signup-bg">
      <div className="signup-card">
        <div className="signup-header">
          <h1>RedSea Hotel</h1>
          <p>Create your account</p>
          <div style={{ 
            fontSize: '12px', 
            color: 'green', 
            marginTop: '10px',
            padding: '5px',
            backgroundColor: '#f0fff0',
            borderRadius: '4px',
            border: '1px solid green'
          }}>
            ✅ Server: http://localhost:5000
          </div>
        </div>

        <div className="social-login">
          <button 
            className="social-btn facebook" 
            onClick={() => handleSocialSignup("Facebook")}
            disabled={loading}
          >
            <FaFacebookF /> 
            Sign up with Facebook
          </button>
          
          <button 
            className="social-btn google" 
            onClick={() => handleSocialSignup("Google")}
            disabled={loading}
          >
            <FaGoogle /> 
            Sign up with Google
          </button>
          
          <button 
            className="social-btn microsoft" 
            onClick={() => handleSocialSignup("Microsoft")}
            disabled={loading}
          >
            <FaMicrosoft /> 
            Sign up with Microsoft
          </button>
        </div>

        <p className="or-text">or sign up with email</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FaUserAlt className="icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              minLength="2"
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="icon" />
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

          <button 
            type="submit" 
            className="btn signup-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="privacy-notice">
          <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;