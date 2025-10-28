/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = 'http://localhost:5000/api';

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Get active tab from URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'users';
    if (path.includes('/rooms')) return 'rooms';
    if (path.includes('/bookings')) return 'bookings';
    return 'overview';
  };

  const handleTabChange = (tab) => {
    switch (tab) {
      case 'overview':
        navigate('/dashboard');
        break;
      case 'users':
        navigate('/dashboard/users');
        break;
      case 'rooms':
        navigate('/dashboard/rooms');
        break;
      case 'bookings':
        navigate('/dashboard/bookings');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/dashboard-login');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-fullscreen">
          <h2>🔄 Loading Dashboard...</h2>
          <p>Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>RedSea Hotel Dashboard</h1>
        <div className="header-info">
          <p>Complete Hotel Management System</p>
        </div>
      </header>

      <nav className="dashboard-nav">
        {['overview', 'users', 'rooms', 'bookings'].map(tab => (
          <button
            key={tab}
            className={`nav-btn ${getActiveTab() === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;