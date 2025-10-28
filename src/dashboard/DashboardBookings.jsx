import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardBookings.css';

const DashboardBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/bookings`);
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`${API_URL}/dashboard/bookings/${bookingId}/status`, {
        status: newStatus
      });
      fetchBookings();
      alert('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  const deleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`${API_URL}/dashboard/bookings/${bookingId}`);
        fetchBookings();
        alert('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="dashboard-bookings">
      <div className="content-header">
        <h2>📅 Bookings Management</h2>
        <button 
          className="add-btn"
          onClick={() => alert('Add booking functionality to be implemented')}
        >
          + Add Booking
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>
                  <div>
                    <strong>{booking.user_name}</strong>
                    <br />
                    <small>{booking.user_email}</small>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{booking.room_name}</strong>
                    <br />
                    <small>{booking.room_type} - ${booking.room_price}/night</small>
                  </div>
                </td>
                <td>{new Date(booking.check_in).toLocaleDateString()}</td>
                <td>{new Date(booking.check_out).toLocaleDateString()}</td>
                <td>${booking.total_price}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                    className={`status-select ${booking.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="actions">
                  <button 
                    className="edit-btn"
                    onClick={() => navigate(`/dashboard/bookings/edit/${booking.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardBookings;