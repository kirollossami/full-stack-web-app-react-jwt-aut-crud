import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [navbarBg, setNavbarBg] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Change background when users scroll
  const changeBackground = () => {
    if (window.scrollY >= 80) setNavbarBg(true);
    else setNavbarBg(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  // Login Check
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, [location]);

  // Log out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <div className="top-nav">
        <div className="contact-item">
          <FaMapMarkerAlt className="icon" />
          <span>Sharm El Sheikh, Egypt</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="icon" />
          <a href="mailto:redsea.hotel@example.com" className="email-link">
            redsea.hotel@example.com
          </a>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="icon" />
          <a
            href="https://wa.me/201026495325"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            +01034037540
          </a>
        </div>

        <div className="auth-buttons d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="logout-btn nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </div>
      </div>

      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          navbarBg ? "navbar-light bg-light shadow-sm" : "navbar-dark bg-transparent"
        }`}
      >
        <div className="container">
          <button
            className="navbar-toggler"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Overview
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/accommodation">
                  Accommodation
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/restaurantsandbars">
                  Restaurants & Bars
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
