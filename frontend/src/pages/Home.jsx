import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import country1Img from "../assets/us.jpg";

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Poți lăsa user-ul null dacă parsing-ul e invalid
        setUser(null);
      }
    } else {
      // Nu există token sau user, îl lași pe user null.
      setUser(null);
    }
  }, [setUser]);
  

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        console.log(data);
        setCountries(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="home-container">
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

      <h2>Top Countries</h2>
      <div className="countries-container">
        {countries.length > 0 ? (
          countries.map((country) => (
            <div className="country-card" key={country.id}>
              <h3>{country.name}</h3>
              {/* Dacă ai poze sau descriere, le pui aici */}
              <img src={country1Img} alt="Country 1" />
              
            </div>
          ))
        ) : (
          <p>Loading countries...</p>
        )}
      </div>
    </div>
  );
}

export default Home;
