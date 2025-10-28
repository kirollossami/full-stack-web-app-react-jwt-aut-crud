/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ تحميل بيانات المستخدم
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = data.data.user;

        if (u.created_at) u.created_at = u.created_at.replace(" ", "T");
        if (u.updated_at) u.updated_at = u.updated_at.replace(" ", "T");

        setUser(u);
      } catch (err) {
        console.error("❌ Failed to load profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // ✅ جلب حجوزات المستخدم
  const fetchUserBookings = async () => {
    if (!token) return;

    setBookingsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/my-bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUserBookings(res.data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  // ✅ استدعاء جلب الحجوزات عند تحميل المكون
  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleChange("avatar", event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/update",
        {
          name: user.name,
          email: user.email,
          password: user.password === "********" ? undefined : user.password,
          phone: user.phone,
          avatar: user.avatar,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = data.data;
      if (updatedUser.created_at)
        updatedUser.created_at = updatedUser.created_at.replace(" ", "T");
      if (updatedUser.updated_at)
        updatedUser.updated_at = updatedUser.updated_at.replace(" ", "T");

      setUser(updatedUser);
      setIsEditing({});
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  // ✅ دالة إلغاء الحجز
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    if (!token) {
      alert("Please log in to cancel booking.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/cancel-booking/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        alert("Booking cancelled successfully!");
        fetchUserBookings();
      } else {
        alert("Failed to cancel booking: " + res.data.message);
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        alert("Error cancelling booking. Please try again.");
      }
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!user) return <div className="profile-container">No user data found.</div>;

  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "password", label: "Password" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "N/A";
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>

      {/* Avatar */}
      <div className="profile-section">
        <div className="avatar-section">
          <div className="avatar-container">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.name?.split(" ").map((n) => n[0]).join("")}
              </div>
            )}
          </div>

          <div className="avatar-controls">
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
              className="file-input"
            />
            <label htmlFor="avatar-upload" className="upload-btn">
              Change Avatar
            </label>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="profile-section">
        <h2 className="section-title">Personal Information</h2>

        {fields.map(({ key, label }) => (
          <div className="field-group" key={key}>
            <label className="field-label">{label}</label>
            <div className="field-controls">
              {isEditing[key] ? (
                <>
                  <input
                    type={key === "password" ? "password" : "text"}
                    value={user[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="field-input"
                  />
                  <button onClick={() => toggleEdit(key)} className="btn btn-cancel">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="field-value">
                    {key === "password" ? "********" : user[key] || "N/A"}
                  </span>
                  <button onClick={() => toggleEdit(key)} className="btn btn-edit">
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        <button className="btn btn-save-all btn-success mt-2" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* System Info */}
      <div className="profile-section">
        <h2 className="section-title">System Information</h2>
        <div className="field-group">
          <label className="field-label">Role</label>
          <span className="field-value">{user.role || "User"}</span>
        </div>
        <div className="field-group">
          <label className="field-label">Provider</label>
          <span className="field-value">{user.provider || "Website System"}</span>
        </div>
        <div className="field-group">
          <label className="field-label">Created At</label>
          <span className="field-value">{formatDate(user.created_at)}</span>
        </div>
        <div className="field-group">
          <label className="field-label">Updated At</label>
          <span className="field-value">{formatDate(user.updated_at)}</span>
        </div>
      </div>

      {/* ✅ قسم حجوزات المستخدم */}
      <div className="profile-section">
        <h2 className="section-title">My Bookings</h2>
        {bookingsLoading ? (
          <div className="loading-container">
            <div className="loading-spinner small"></div>
            <p>Loading your bookings...</p>
          </div>
        ) : userBookings.length > 0 ? (
          <div className="bookings-list">
            {userBookings.map((booking) => (
              <div key={booking.id} className={`booking-card ${booking.status}`}>
                <div className="booking-info">
                  <h3>{booking.room_name}</h3>
                  <p><strong>Type:</strong> {booking.type}</p>
                  <p><strong>Check-in:</strong> {new Date(booking.check_in).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(booking.check_out).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ${booking.total_price}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </p>
                  <p><strong>Booked on:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => handleCancelBooking(booking.id)}
                    className="btn cancel-btn"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You don't have any bookings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;