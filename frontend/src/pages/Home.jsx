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

  // Schimbă slide-ul la fiecare 3 secunde
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
              <div className="img-text">
                <h3>{country.name}</h3>
                <div></div>
              </div>
              
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
          <p>Welcome back to Vacation Suggestion App!</p>
        </div>
      ) : (
        <div>
          <h1>Hello! You can sign up.</h1>
        </div>
      )}
      <br />
      <ChatBot />
    </div>
  );
}

export default Home;
