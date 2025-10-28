import React, { useState } from "react";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent!\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`);
    setName(""); setEmail(""); setPhone(""); setMessage("");
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact <span>Us</span></h1>
        <p>We’d love to hear from you! Reach out for any questions or reservations.</p>
      </div>

      <div className="contact-container">
        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-box">
            <FaMapMarkerAlt className="icon"/>
            <h3>Address</h3>
            <p>Sharm El Sheikh, Egypt</p>
          </div>
          <div className="info-box">
            <FaEnvelope className="icon"/>
            <h3>Email</h3>
            <p>redsea.hotel@example.com</p>
          </div>
          <div className="info-box">
            <FaPhoneAlt className="icon"/>
            <h3>Phone</h3>
            <p>+20 1026495325</p>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Your Message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-contact">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
