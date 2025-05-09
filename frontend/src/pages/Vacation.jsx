import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Vacation.css";

function Vacation() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  return (
    <div className="countries-page-container">
      <h2>Search for Countries</h2>
      <input
        type="text"
        placeholder="Search for a city or country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="countries-container">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <Link to={`/hotels/${country.id}`} className="country-card">
              <h3>{country.name}</h3>
              <img src={`images/${country.name}.png`} alt={country.name} />
            </Link>
          ))
        ) : (
          <p>No countries found...</p>
        )}
      </div>
    </div>
  );
}

export default Vacation;
