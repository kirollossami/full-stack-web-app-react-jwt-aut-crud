import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">RedSea Hotel</h3>
          <p>Your perfect getaway in Sharm El Sheikh. Luxury, comfort, and unforgettable experiences.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Overview</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/accommodation">Accommodation</Link></li>
            <li><Link to="/restaurantsandbars">Restaurants&Bars</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt className="icon" /> Sharm El Sheikh, Egypt</p>
          <p><FaEnvelope className="icon" /> <a href="mailto:redsea.hotel@example.com">redsea.hotel@example.com</a></p>
          <p><FaPhoneAlt className="icon" /> <a href="https://wa.me/201034037540" target="_blank" rel="noopener noreferrer">+20 1034037540</a></p>

          <div className="social-icons">
            <a href="https://www.facebook.com"><FaFacebookF /></a>
            <a href="https://www.twitter.com"><FaTwitter /></a>
            <a href="https://www.instagram.com/"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} RedSea Hotel. All Rights Reserved.</p>
        <p >Designed by <a className="author-footer" href="https://www.linkedin.com/in/kirollossamy" target="_blank">Kirollos Samy</a></p>
      </div>
    </footer>
  );
};

export default Footer;
