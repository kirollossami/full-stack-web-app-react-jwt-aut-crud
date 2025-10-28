/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditBooking.css';

const EditBooking = () => {
  const [formData, setFormData] = useState({
    status: '',
    total_price: ''
  });
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/bookings`);
      const bookingData = response.data.bookings.find(b => b.id === parseInt(id));
      if (bookingData) {
        setBooking(bookingData);
        setFormData({
          status: bookingData.status || '',
          total_price: bookingData.total_price || ''
        });
      } else {
        setError('Booking not found');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Error fetching booking data');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`${API_URL}/dashboard/bookings/${id}/status`, {
        status: formData.status
      });
      alert('Booking updated successfully');
      navigate('/dashboard/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(error.response?.data?.error || 'Error updating booking');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading booking data...</div>;
  }

  if (!booking) {
    return <div className="error-message">Booking not found</div>;
  }

  return (
    <div className="edit-booking">
      <div className="content-header">
        <h2>Edit Booking</h2>
        <button 
          className="back-btn"
          onClick={() => navigate('/dashboard/bookings')}
        >
          ← Back to Bookings
        </button>
      </div>

      <div className="booking-info">
        <h3>Booking Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>User:</label>
            <span>{booking.user_name} ({booking.user_email})</span>
          </div>
          <div className="info-item">
            <label>Room:</label>
            <span>{booking.room_name} - {booking.room_type}</span>
          </div>
          <div className="info-item">
            <label>Check-in:</label>
            <span>{new Date(booking.check_in).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Check-out:</label>
            <span>{new Date(booking.check_out).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Total Price:</label>
            <span>${booking.total_price}</span>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Status: *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Price:</label>
            <input
              type="number"
              name="total_price"
              value={formData.total_price}
              onChange={handleInputChange}
              disabled
            />
            <small>Price cannot be edited directly</small>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Booking'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/dashboard/bookings')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBooking;