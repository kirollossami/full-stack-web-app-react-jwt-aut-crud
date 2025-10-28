import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardRooms.css';

const DashboardRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/rooms`);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${API_URL}/dashboard/rooms/${roomId}`);
        fetchRooms();
        alert('Room deleted successfully');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error deleting room');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="dashboard-rooms">
      <div className="content-header">
        <h2>🏠 Rooms Management</h2>
        <button 
          className="add-btn"
          onClick={() => navigate('/dashboard/rooms/add')}
        >
          + Add Room
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Room Name</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.room_name}</td>
                <td>
                  <span className={`type-badge ${room.type?.toLowerCase()}`}>
                    {room.type}
                  </span>
                </td>
                <td>${room.price}</td>
                <td>
                  <span className={`status-badge ${room.status?.toLowerCase()}`}>
                    {room.status}
                  </span>
                </td>
                <td>{room.description || '-'}</td>
                <td className="actions">
                  <button 
                    className="edit-btn"
                    onClick={() => navigate(`/dashboard/rooms/edit/${room.id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRoom(room.id)}
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

export default DashboardRooms;