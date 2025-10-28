/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Booking.css";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomType, setRoomType] = useState("Standard");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  // الحصول على تاريخ اليوم بصيغة YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // الحصول على تاريخ الغد بصيغة YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // دالة مساعدة للحصول على تاريخ الغد من تاريخ محدد
  const getTomorrowDateFromDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  // التحقق من صحة التوكن وجلب بيانات المستخدم
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // تعبئة بيانات المستخدم تلقائياً
        setName(parsedUser.name || "");
        setEmail(parsedUser.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }

    setLoading(false);
  }, [navigate]);

  // جلب الغرف المتاحة مع التوكن
  const fetchAvailableRooms = () => {
    const token = localStorage.getItem("token");
    
    if (!token) return;

    setRoomsLoading(true);
    axios
      .get("http://localhost:5000/api/available-rooms", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.rooms)) {
          setRooms(res.data.rooms);
        } else {
          setRooms([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .finally(() => {
        setRoomsLoading(false);
      });
  };

  // استدعاء الدوال عند تحميل المكون
  useEffect(() => {
    if (user) {
      fetchAvailableRooms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      let days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      days = days > 0 ? days : 1;

      let multiplier = 1;
      if (roomType === "Deluxe") multiplier = 1.5;
      else if (roomType === "Suite") multiplier = 2;

      setTotalPrice(days * selectedRoom.price * multiplier);
    } else {
      setTotalPrice(0);
    }
  }, [selectedRoom, checkIn, checkOut, roomType]);

  const handleCheckInChange = (date) => {
    setCheckIn(date);
    
    if (date && checkOut && new Date(checkOut) <= new Date(date)) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date);
  };

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      return "Please select both check-in and check-out dates.";
    }

    const today = new Date(getTodayDate());
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate < today) {
      return "Check-in date cannot be in the past.";
    }

    if (checkOutDate <= checkInDate) {
      return "Check-out date must be after check-in date.";
    }

    return null;
  };

  const handleBooking = () => {
    if (!selectedRoom || !name || !email || !phone || !checkIn || !checkOut) {
      alert("Please fill all fields and select a room.");
      return;
    }

    const dateError = validateDates();
    if (dateError) {
      alert(dateError);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to make a booking.");
      navigate("/login");
      return;
    }

    const bookingData = {
      userId: user?.id,
      roomId: selectedRoom.id,
      roomType,
      name,
      email,
      phone,
      checkIn,
      checkOut,
      totalPrice,
    };

    setBookingLoading(true);
    axios
      .post("http://localhost:5000/api/book", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        if (res.data.success) {
          alert(`Booking successful! Total: $${res.data.totalPrice}`);
          setSelectedRoom(null);
          setRoomType("Standard");
          setName("");
          setEmail("");
          setPhone("");
          setCheckIn("");
          setCheckOut("");
          setTotalPrice(0);
          fetchAvailableRooms();
        } else {
          alert("Booking failed: " + res.data.message);
        }
      })
      .catch((err) => {
        console.error("Booking error:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          alert("Booking failed. Try again.");
        }
      })
      .finally(() => {
        setBookingLoading(false);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <h2>Authentication Required</h2>
          <p>Please log in to access booking page.</p>
          <button onClick={() => navigate("/login")} className="btn login-redirect-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-header">
        <div className="header-content">
          <h1>Hotel Booking</h1>
          <p>Select your preferred room and complete your reservation</p>
        </div>
        <div className="user-info">
          <span className="welcome-text">Welcome, <strong>{user.name}</strong>!</span>
          <button onClick={handleLogout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="booking-container">
        <div className="rooms-section">
          <h2>Available Rooms</h2>
          {roomsLoading ? (
            <div className="rooms-loading">
              <div className="loading-spinner small"></div>
              <p>Loading available rooms...</p>
            </div>
          ) : rooms.length > 0 ? (
            <div className="rooms-list">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${selectedRoom?.id === room.id ? "selected" : ""}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="room-image-container">
                    <img 
                      src={room.image_url ? `/images/rooms/${room.image_url}` : "https://via.placeholder.com/150x110"} 
                      alt={room.name}
                      className="room-image"
                    />
                    <div className="room-overlay">
                      <span>Select Room</span>
                    </div>
                  </div>
                  <div className="room-details">
                    <h3>{room.name}</h3>
                    <p className="room-description">{room.description}</p>
                    <div className="room-price-container">
                      <span className="room-price">${room.price}</span>
                      <span className="price-period">/night</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-rooms">
              <p>No available rooms at the moment.</p>
              <p>Please check back later.</p>
            </div>
          )}
        </div>

        {selectedRoom && (
          <div className="booking-form-container">
            <div className="booking-form">
              <div className="form-header">
                <h2>Complete Your Booking</h2>
                <p>You're booking: <strong>{selectedRoom.name}</strong></p>
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email" 
                  placeholder="Your Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  id="phone"
                  type="tel" 
                  placeholder="Your Phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div className="dates-container">
                <div className="form-group">
                  <label htmlFor="checkin">Check-in Date</label>
                  <input 
                    id="checkin"
                    type="date" 
                    value={checkIn} 
                    onChange={(e) => handleCheckInChange(e.target.value)} 
                    min={getTomorrowDate()}
                  />
                  {checkIn && new Date(checkIn) < new Date(getTodayDate()) && (
                    <small className="error-text">Check-in date cannot be in the past</small>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="checkout">Check-out Date</label>
                  <input 
                    id="checkout"
                    type="date" 
                    value={checkOut} 
                    onChange={(e) => handleCheckOutChange(e.target.value)} 
                    min={checkIn ? getTomorrowDateFromDate(checkIn) : getTomorrowDate()}
                  />
                  {checkIn && checkOut && new Date(checkOut) <= new Date(checkIn) && (
                    <small className="error-text">Check-out must be after check-in</small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select 
                  id="roomType"
                  value={roomType} 
                  onChange={(e) => setRoomType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe (+50%)</option>
                  <option value="Suite">Suite (x2)</option>
                </select>
              </div>

              <div className="price-summary">
                <div className="price-line">
                  <span>Room Price:</span>
                  <span>${selectedRoom.price}/night</span>
                </div>
                {roomType !== "Standard" && (
                  <div className="price-line">
                    <span>{roomType} Upgrade:</span>
                    <span>
                      {roomType === "Deluxe" ? "+50%" : "x2"}
                    </span>
                  </div>
                )}
                {checkIn && checkOut && (
                  <>
                    <div className="price-line">
                      <span>Nights:</span>
                      <span>
                        {Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="price-total">
                      <span>Total Price:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <button 
                onClick={handleBooking} 
                className="btn confirm-btn"
                disabled={bookingLoading || validateDates() !== null}
              >
                {bookingLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    Processing...
                  </>
                ) : (
                  `Confirm Booking - $${totalPrice.toFixed(2)}`
                )}
              </button>

              {validateDates() && (
                <div className="booking-error">
                  <small>{validateDates()}</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;