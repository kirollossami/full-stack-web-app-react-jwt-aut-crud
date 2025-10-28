/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditUser.css';

const EditUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/users`);
      const user = response.data.users.find(u => u.id === parseInt(id));
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email || '',
          role: user.role || 'user',
          phone: user.phone || ''
        });
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Error fetching user data');
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
      await axios.put(`${API_URL}/dashboard/users/${id}`, formData);
      alert('User updated successfully');
      navigate('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.error || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading user data...</div>;
  }

  return (
    <div className="edit-user">
      <div className="content-header">
        <h2>Edit User</h2>
        <button 
          className="back-btn"
          onClick={() => navigate('/dashboard/users')}
        >
          ← Back to Users
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Name: *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email: *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/dashboard/users')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;