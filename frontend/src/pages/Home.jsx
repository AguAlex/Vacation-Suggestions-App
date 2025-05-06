import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import france from "../assets/France.jpg";
import uk from "../assets/UnitedKingdom.jpg";
import us from "../assets/UnitedStates.jpg";
import ChatBot from "../components/Chatbot";

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [topAccomodations, setTopAccomodations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch top 3 hotels after initial load
  useEffect(() => {
    const fetchTopAccomodations = async () => {
      try {
        const response = await fetch("http://localhost:3000/top_accomodations");
        const data = await response.json();
        console.log(data);
        setTopAccomodations(data);
      } catch (error) {
        console.error("Error fetching top hotels:", error);
      }
    };

    fetchTopAccomodations();
  }, []);

  // Schimba slide-ul la fiecare 3 secunde
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % countries.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [countries]);

  const images = {
    0: uk,
    1: us,
    2: france,
  };
  
  return (
    <div className="home-container">
      <div className="countries-slideshow">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div
              key={country.id}
              className={`mySlides ${index === slideIndex ? "active" : ""}`}
            >
              <img src={images[index]} alt={country.name} />
            </div>
          ))
        ) : (
          <p>Loading countries...</p>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        {countries.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === slideIndex ? "active" : ""}`}
            onClick={() => setSlideIndex(index)}
          ></span>
        ))}
              </div>

      <br />
      {user ? (
        <div>
          <h1>Hello, {user.nume}!</h1>
          <p>Welcome back to the Vacation Suggestion App! 🌍</p>
          <p>We missed you! Start exploring your favorite destinations! ✈️</p>
        </div>
      ) : (
        <div className="not-logged-message">
          <h2>Welcome to Vacation Suggestion App! 🎉</h2>
          <p>Sign in or sign up to unlock amazing features, including:</p>
          <ul>
            <li>💙 Save your favorite destinations</li>
            <li>🤖 Get personalized recommendations through our chatbot</li>
            <li>📅 Enjoy exclusive travel tips and offers</li>
          </ul>
          <p>If you're not logged in yet, no worries! Let's find the perfect vacation for you! 🌴</p>
        </div>
      )}
      
      <br />

      {/* Top 3 Hotels Section */}
      <div className="top-hotels-section">
        <div className="theme-switch-wrapper">
            <label className="theme-switch">
              <input
                type="checkbox"
                onChange={(e) => {
                  const isDark = e.target.checked;
                  document.body.classList.toggle("dark-mode", isDark);
                  localStorage.setItem("theme", isDark ? "dark" : "light");
                }}
                defaultChecked={localStorage.getItem("theme") === "dark"}
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">🌙 Dark Mode</span>
          </div>
        <h2>Top 3 Hotels Based on Likes</h2>
        <div className="top-accomodations">
          {topAccomodations.length > 0 ? (
            topAccomodations.map((acc) => (
              <div
                key={acc.id}
                className="accomodation-card"
                
              >
                <h4>{acc.name}</h4>
                <p>Price: {acc.price}</p>
                <p>Rating: {acc.rating}</p>
                <p>{acc.country_name}, {acc.city_name}</p>
                <p>Total Likes: {acc.likes_count}</p>
                <p>
                  <button
                    onClick={() => window.open(acc.link, '_blank')}
                    className="external-link-button"
                  >
                    Visit Hotel Website 🌐
                  </button>
                </p>
              </div>
            ))
          ) : (
            <p>Loading top hotels...</p>
          )}
        </div>
      </div>

      <br />
      {user ? <ChatBot /> : null}
      
    </div>
  );
}

export default Home;
