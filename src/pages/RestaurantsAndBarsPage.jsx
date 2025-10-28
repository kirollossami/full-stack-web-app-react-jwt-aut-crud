import React, { useState } from "react";
import "./RestaurantsAndBarsPage.css";

// البيانات الكاملة مع التفاصيل والصور
const items = [
  { 
    id: 1, 
    name: "Sea Breeze Restaurant", type: "restaurant", price: "$25 - $50", conditions: "Reservation recommended", 
    image: "../src/assets/restaurants/restaurant1.jpg",
    details: {
      cuisine: "All Day Dining / Casual / International / A la Carte / Buffet",
      phone: "+204 640 10000",
      email: "ird.palmabay@rotana.com",
      openingHours: { breakfast: "07:00 - 11:00", lunch: "13:00 - 16:00", dinner: "19:00 - 23:00" },
      overview: "Bright, welcoming and full of flavour, Horizon offers a sumptuous all-day buffet and a la carte dining. Enjoy international favourites and regional specialties for breakfast, lunch and dinner in a relaxed setting filled with natural light and coastal charm."
    }
  },
  { 
    id: 2, 
    name: "Coral Garden Restaurant", type: "restaurant", price: "$30 - $60", conditions: "Outdoor seating available", 
    image: "../src/assets/restaurants/restaurant2.jpg",
    details: {
      cuisine: "Casual / International / Buffet",
      phone: "+204 640 10001",
      email: "coralgarden@rotana.com",
      openingHours: { breakfast: "07:30 - 11:30", lunch: "12:30 - 15:30", dinner: "18:30 - 22:30" },
      overview: "A relaxed dining experience with indoor and outdoor seating. Offers a variety of international and local dishes prepared fresh daily."
    }
  },
  { 
    id: 3, 
    name: "Sunset Grill", type: "restaurant", price: "$20 - $45", conditions: "Family-friendly", 
    image: "../src/assets/restaurants/restaurant3.jpg",
    details: {
      cuisine: "Grill / Casual / International",
      phone: "+204 640 10002",
      email: "sunsetgrill@rotana.com",
      openingHours: { breakfast: "07:00 - 10:30", lunch: "12:00 - 15:00", dinner: "18:00 - 22:00" },
      overview: "Sunset Grill offers grilled specialties and a casual dining atmosphere, perfect for families and friends."
    }
  },
  { 
    id: 4, 
    name: "Red Sea Dine", type: "restaurant", price: "$25 - $55", conditions: "Sea view tables", 
    image: "../src/assets/restaurants/restaurant4.jpg",
    details: {
      cuisine: "Seafood / International / Buffet",
      phone: "+204 640 10003",
      email: "redseadine@rotana.com",
      openingHours: { breakfast: "07:00 - 11:00", lunch: "12:30 - 15:30", dinner: "19:00 - 23:00" },
      overview: "Enjoy fresh seafood and international dishes with a beautiful view of the Red Sea."
    }
  },
  { 
    id: 5, 
    name: "Blue Lagoon Restaurant", type: "restaurant", price: "$35 - $70", conditions: "Vegetarian options", 
    image: "../src/assets/restaurants/restaurant5.jpg",
    details: {
      cuisine: "Casual / International / Vegetarian Options",
      phone: "+204 640 10004",
      email: "bluelagoon@rotana.com",
      openingHours: { breakfast: "07:30 - 11:30", lunch: "12:30 - 16:00", dinner: "18:30 - 22:30" },
      overview: "Blue Lagoon offers international cuisine with a focus on fresh ingredients and vegetarian options."
    }
  },
  { 
    id: 6, 
    name: "Harbor Feast", type: "restaurant", price: "$28 - $60", conditions: "Live music on weekends", 
    image: "../src/assets/restaurants/restaurant6.jpg",
    details: {
      cuisine: "Casual / International / Buffet",
      phone: "+204 640 10005",
      email: "harborfeast@rotana.com",
      openingHours: { breakfast: "07:00 - 11:00", lunch: "12:30 - 15:30", dinner: "18:30 - 22:30" },
      overview: "Harbor Feast offers a buffet style dining with live music on weekends."
    }
  },
  { 
    id: 7, 
    name: "Night Owl Bar", type: "bar", price: "$10 - $25", conditions: "Happy hour 6-8 PM", 
    image: "../src/assets/bars/bar1.jpg",
    details: {
      cuisine: "Cocktails / Lounge / Bar Snacks",
      phone: "+204 640 20001",
      email: "nightowl@rotana.com",
      openingHours: { evening: "18:00 - 02:00" },
      overview: "Night Owl Bar offers a lively atmosphere with cocktails and bar snacks, perfect for night owls."
    }
  },
  { 
    id: 8, 
    name: "Coral Reef Lounge", type: "bar", price: "$15 - $30", conditions: "Live DJ on Fridays", 
    image: "../src/assets/bars/bar2.jpg",
    details: {
      cuisine: "Cocktails / Lounge",
      phone: "+204 640 20002",
      email: "coralreef@rotana.com",
      openingHours: { evening: "17:00 - 01:00" },
      overview: "Relax in Coral Reef Lounge with cocktails and live DJ on Fridays."
    }
  },
  { 
    id: 9, 
    name: "Sunset Cocktails", type: "bar", price: "$12 - $28", conditions: "Rooftop seating", 
    image: "../src/assets/bars/bar3.jpg",
    details: {
      cuisine: "Cocktails / Rooftop / Snacks",
      phone: "+204 640 20003",
      email: "sunsetcocktails@rotana.com",
      openingHours: { evening: "17:30 - 01:30" },
      overview: "Sunset Cocktails offers rooftop seating with a wide selection of cocktails."
    }
  },
  { 
    id: 10, 
    name: "Harbor Lights Bar", type: "bar", price: "$10 - $20", conditions: "No cover charge", 
    image: "../src/assets/bars/bar4.jpg",
    details: {
      cuisine: "Cocktails / Bar Snacks",
      phone: "+204 640 20004",
      email: "harborlights@rotana.com",
      openingHours: { evening: "18:00 - 01:00" },
      overview: "Harbor Lights Bar provides a relaxed bar experience with no cover charge."
    }
  },
];

const ItemCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="item-card">
      <img src={item.image} alt={item.name} className="item-image" />
      <h3>{item.name}</h3>
      <p className="type">{item.type}</p>
      <p className="price">Price: {item.price}</p>
      <p className="conditions">{item.conditions}</p>

      <button
        className="show-more-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>

      <div className={`item-details ${isExpanded ? "expanded" : ""}`}>
        {item.details && (
          <>
            <p><strong>Cuisine:</strong> {item.details.cuisine}</p>
            {item.details.phone && <p><strong>Phone:</strong> {item.details.phone}</p>}
            {item.details.email && <p><strong>Email:</strong> {item.details.email}</p>}
            {item.details.openingHours && (
              <>
                <p><strong>Opening Hours:</strong></p>
                <ul>
                  {item.details.openingHours.breakfast && <li>Breakfast: {item.details.openingHours.breakfast}</li>}
                  {item.details.openingHours.lunch && <li>Lunch: {item.details.openingHours.lunch}</li>}
                  {item.details.openingHours.dinner && <li>Dinner: {item.details.openingHours.dinner}</li>}
                  {item.details.openingHours.evening && <li>Evening: {item.details.openingHours.evening}</li>}
                </ul>
              </>
            )}
            <p><strong>Overview:</strong> {item.details.overview}</p>
          </>
        )}
      </div>
    </div>
  );
};

const RestaurantsAndBarsPage = () => {
  const [filter, setFilter] = useState("all");

  const filteredItems = items.filter(item => filter === "all" ? true : item.type === filter);

  return (
    <div className="page-container">
      <h1>Restaurants & Bars</h1>

      <div className="filter-buttons">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
        <button className={filter === "restaurant" ? "active" : ""} onClick={() => setFilter("restaurant")}>Restaurants</button>
        <button className={filter === "bar" ? "active" : ""} onClick={() => setFilter("bar")}>Bars</button>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantsAndBarsPage;
