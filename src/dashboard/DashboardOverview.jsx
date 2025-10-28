import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, bookingsResponse] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/dashboard/bookings`)
      ]);

      setStats(statsResponse.data.stats);
      setRecentBookings(bookingsResponse.data.bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading overview...</div>;
  }

  return (
    <div className="dashboard-overview">
      <h2>📊 Overview</h2>
      
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.total_users || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Rooms</h3>
          <p className="stat-number">{stats.total_rooms || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.total_bookings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p className="stat-number">{stats.active_bookings || 0}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <h3>Recent Bookings</h3>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/dashboard/bookings')}
          >
            View All
          </button>
        </div>
        <div className="activity-list">
          {recentBookings.map(booking => (
            <div key={booking.id} className="activity-item">
              <div className="activity-info">
                <strong>{booking.user_name}</strong> booked <strong>{booking.room_name}</strong>
              </div>
              <div className="activity-meta">
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
                <span>{new Date(booking.check_in).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;