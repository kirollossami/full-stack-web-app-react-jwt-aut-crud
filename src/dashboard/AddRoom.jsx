import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRoom.css';

const AddRoom = () => {
  const [formData, setFormData] = useState({
    room_name: '',
    type: '',
    price: '',
    description: '',
    image_url: '',
    status: 'Available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

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
      await axios.post(`${API_URL}/dashboard/rooms`, formData);
      alert('Room added successfully');
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('Error adding room:', error);
      setError(error.response?.data?.error || 'Error adding room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-room">
      <div className="content-header">
        <h2>Add New Room</h2>
        <button 
          className="back-btn"
          onClick={() => navigate('/dashboard/rooms')}
        >
          ← Back to Rooms
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Room Name: *</label>
            <input
              type="text"
              name="room_name"
              value={formData.room_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type: *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price: *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Image URL:</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Room'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/dashboard/rooms')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;