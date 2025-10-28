/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './HomePage.css';
import bgVideo from '../assets/Video/video.mp4';

const HomePage = () => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for ${destination} from ${checkIn} to ${checkOut}, ${adults} adults, ${rooms} room(s)`);
  };

  // Special Offers Data
  const specialOffers = [
    {
      id: 1,
      title: "Golden Beach Package",
      description: "Enjoy luxury accommodation with direct sea view",
      discount: "25% OFF",
      price: "$199",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Honeymoon Special",
      description: "Romantic stay with special dinner and spa experience",
      discount: "30% OFF",
      price: "$299",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      title: "Weekend Getaway",
      description: "Perfect weekend escape with breakfast included",
      discount: "20% OFF",
      price: "$149",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  // Categories Data
  const categories = [
    {
      id: 1,
      title: "Luxury Hotels",
      count: "120+ Hotels",
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Beach Resorts",
      count: "85+ Resorts",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      title: "Apartments",
      count: "210+ Apartments",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80"
    },
    {
      id: 4,
      title: "Villas",
      count: "75+ Villas",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    }
  ];

  // Testimonials Data
  const testimonials = [
    {
      id: 1,
      name: "John Smith",
      location: "New York, USA",
      rating: 5,
      comment: "Amazing experience! The hotel was clean and service was excellent. Will definitely come back.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "London, UK",
      rating: 4,
      comment: "Great website, easy to use. Helped me find the best deals for my vacation.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 3,
      name: "Mike Wilson",
      location: "Sydney, Australia",
      rating: 5,
      comment: "Booking was quick and easy. Everything exceeded my expectations. Thank you!",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "How can I modify or cancel my booking?",
      answer: "You can modify or cancel your booking through your personal account on the website, or by contacting our customer service team."
    },
    {
      id: 2,
      question: "What is the cancellation policy?",
      answer: "Cancellation policies vary by hotel and offer. You can check the details during the booking process."
    },
    {
      id: 3,
      question: "Can I book without a credit card?",
      answer: "Yes, we offer multiple payment options including bank transfer and pay-at-hotel for some properties."
    },
    {
      id: 4,
      question: "How can I contact customer service?",
      answer: "You can reach us via email or phone at the number provided on the contact page."
    }
  ];

  return (
    <div className="home">
      {/* Header Video */}
      <header className="home-header">
        <video className="bg-video" autoPlay loop muted playsInline>
          <source src={bgVideo} type="video/mp4" />
        </video>
      </header>

      {/* Special Offers Section */}
      <section className="special-offers-section">
        <div className="section-header">
          <h2>Special Offers</h2>
          <p>Discover exclusive deals for your next stay</p>
        </div>
        <div className="offers-grid">
          {specialOffers.map(offer => (
            <div key={offer.id} className="offer-card">
              <div className="offer-image">
                <img src={offer.image} alt={offer.title} />
                <div className="offer-badge">{offer.discount}</div>
              </div>
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="offer-price">
                  <span className="price">{offer.price}</span>
                  <span className="period">/ night</span>
                </div>
                <a className="offer-btn" href="/booking">Book Now</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Browse By Category</h2>
          <p>Choose from a variety of accommodation options</p>
        </div>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <img src={category.image} alt={category.title} />
              <div className="category-overlay">
                <h3>{category.title}</h3>
                <p>{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>See what our customers say about their experience with us</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img src={testimonial.avatar} alt={testimonial.name} />
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.location}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-comment">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Answers to the most common questions</p>
        </div>
        <div className="faq-list">
          {faqs.map(faq => (
            <div key={faq.id} className="faq-item">
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;