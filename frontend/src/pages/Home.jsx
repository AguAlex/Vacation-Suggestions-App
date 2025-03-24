import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home({ user, setUser }) {
  const navigate = useNavigate();

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
  

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };

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
    </div>
  );
}

export default Home;
