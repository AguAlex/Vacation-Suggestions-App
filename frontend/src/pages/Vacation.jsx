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
        setCountries(data); // Păstrează toate țările
        setFilteredCountries(data); // Filtrarea inițială va fi pentru toate
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCountries(countries); // Dacă nu există termen de căutare, arată toate țările
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  return (
    <div className="countries-page-container">
      <h2>Search for Countries or Cities</h2>
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
              <img src={country.image} alt={country.name} />
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
