/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditRoom.css';

const EditRoom = () => {
  const [formData, setFormData] = useState({
    room_name: '',
    type: '',
    price: '',
    description: '',
    image_url: '',
    status: 'Available'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/rooms`);
      const room = response.data.rooms.find(r => r.id === parseInt(id));
      if (room) {
        setFormData({
          room_name: room.room_name || '',
          type: room.type || '',
          price: room.price || '',
          description: room.description || '',
          image_url: room.image_url || '',
          status: room.status || 'Available'
        });
      } else {
        setError('Room not found');
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      setError('Error fetching room data');
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
      await axios.put(`${API_URL}/dashboard/rooms/${id}`, formData);
      alert('Room updated successfully');
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('Error updating room:', error);
      setError(error.response?.data?.error || 'Error updating room');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading room data...</div>;
  }

  return (
    <div className="edit-room">
      <div className="content-header">
        <h2>Edit Room</h2>
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
              {loading ? 'Updating...' : 'Update Room'}
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

export default EditRoom;