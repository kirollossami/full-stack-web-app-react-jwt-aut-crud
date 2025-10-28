/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardLogin.css';

const DashboardLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dashboard admin credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin@redseahotel.com',
    password: 'admin123'
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check admin credentials
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Store admin session
        localStorage.setItem('adminToken', 'admin-authenticated');
        localStorage.setItem('adminUser', JSON.stringify({
          name: 'Admin',
          email: ADMIN_CREDENTIALS.email,
          role: 'admin'
        }));
        
        navigate('/dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-login-container">
      <div className="dashboard-login-card">
        <div className="dashboard-login-header">
          <h1>🏨 RedSea Hotel</h1>
          <h2>Admin Dashboard</h2>
          <p>Please enter your admin credentials</p>
        </div>

        <form onSubmit={handleLogin} className="dashboard-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@redseahotel.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Email:</strong> admin@redseahotel.com</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;