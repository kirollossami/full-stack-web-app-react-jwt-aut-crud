import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Accommodation.css";

const Accommodation = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/rooms");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setRooms(result.data || result.rooms || []);
        } else {
          setError(result.message || "Failed to fetch rooms");
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="accommodation-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading rooms...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="accommodation-section">
        <div className="error-container">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="accommodation-section">
      <div className="accommodation-header">
        <h1>Our Accommodations</h1>
        <p>Choose your perfect stay at RedSea Hotel</p>
      </div>

      <div className="rooms-container">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms available at the moment.</p>
            <p>Please check back later.</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id || room.room_id} className="rooms-card">
              <img
                src={
                  room.image_url 
                    ? `/images/rooms/${room.image_url}`
                    : "https://via.placeholder.com/400x300/1a2d3e/ffffff?text=No+Image+Available"
                }
                alt={room.room_name || room.name || "Room"}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300/1a2d3e/ffffff?text=No+Image+Available";
                }}
              />
              <div className="room-info">
                <h3>{room.room_name || room.name || "Unnamed Room"}</h3>
                <p className="room-type">{room.type || room.room_type || "Standard Room"}</p>
                <p className="room-description">
                  {room.description || "No description available."}
                </p>
                
                <div className="room-details">
                  <span className="room-price">
                    ${room.price ? Number(room.price).toFixed(2) : "0.00"} / night
                  </span>
                  <span className={`room-status ${room.status || room.availability}`}>
                    {room.status === 'available' || room.availability === 'available' ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <button 
                  className={`btn-booking ${!(room.status === 'available' || room.availability === 'available') ? 'disabled' : ''}`}
                  disabled={!(room.status === 'available' || room.availability === 'available')}
                >
                  <Link to={`/booking?room=${room.id || room.room_id}`}>
                    {room.status === 'available' || room.availability === 'available' ? 'Book Now' : 'Not Available'}
                  </Link>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Accommodation;