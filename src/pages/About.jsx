import React from "react";
import "./About.css";
import hotelImg from "../assets/hotel.jpg"; 
import poolImg from "../assets/pool.jpg";   
import restaurantImg from "../assets/restaurant.jpg";
import SupportImg from "../assets/support.jpg";

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="overlay"></div>
        <img src={hotelImg} alt="RedSea Hotel" className="hero-img" />
        <div className="hero-text">
          <h1>Welcome to RedSea Hotel</h1>
          <p>
            Experience luxury and comfort at the heart of Sharm El Sheikh.
          </p>
          <button className="btn-booking"><a href="/booking">Book Now</a></button>
        </div>
      </section>

      <section className="about-section">
        <h2>About Us</h2>
        <p>
          RedSea Hotel offers a unique blend of modern luxury and traditional Egyptian hospitality. 
          Enjoy our spacious rooms, stunning sea views, and world-class amenities.
        </p>

        <div className="features">
          <div className="feature-card">
            <img src={poolImg} alt="Pool" />
            <h3>Luxury Pools</h3>
            <p>Relax and unwind in our beautifully designed swimming pools.</p>
          </div>
          <div className="feature-card">
            <img src={restaurantImg} alt="Restaurant" />
            <h3>Fine Dining</h3>
            <p>Savor exquisite cuisines prepared by our expert chefs.</p>
          </div>
          <div className="feature-card">
            <i className="icon">💬</i>
            <img src={SupportImg} alt="Support" />
            <h3>24/7 Support</h3>
            <p>Our friendly staff is always ready to make your stay unforgettable.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
