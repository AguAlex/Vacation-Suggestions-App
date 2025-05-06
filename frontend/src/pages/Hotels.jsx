import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Hotels.css';
import LikeButton from '../components/LikeButton';

const Hotels = () => {
  const { id } = useParams();
  const [countryName, setCountryName] = useState('');
  const [cities, setCities] = useState([]);
  const [accomodations, setAccomodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/countries/${id}`);
      const data = await response.json();
      setCountryName(data.name || '');
      setCities(data.cities || []);
      setAccomodations(data.accomodations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const refreshAccomodations = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setSelectedCity(null);
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredAccomodations = accomodations.filter((acc) => {
    const matchesCity = selectedCity ? acc.city_name === selectedCity : true;
    const matchesMin = minPrice ? acc.price >= Number(minPrice) : true;
    const matchesMax = maxPrice ? acc.price <= Number(maxPrice) : true;
    return matchesCity && matchesMin && matchesMax;
  });

  return (
    <div className="hotels-container">

      <div className="hotels-content">
        {showFilters && (
          <aside className="filters-sidebar">
            <div className="filters-title"><h3>Filters</h3></div>

            <div className="filter-group">
              <label>City</label>
              <ul className="city-list">
                {cities.map((city) => (
                  <li
                    key={city.id}
                    className={`city-item ${selectedCity === city.name ? 'selected' : ''}`}
                    onClick={() =>
                      setSelectedCity((prevCity) => (prevCity === city.name ? null : city.name))
                    }
                  >
                    {city.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <label>Min Budget</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
              />
            </div>

            <div className="filter-group">
              <label>Max Budget</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
              />
            </div>

            <button className="reset-button" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </aside>
        )}

        <section className="accommodations-section">
          <div className="section-header">
            <h3 className="section-title">Available hotels</h3>
            <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
              <p>{showFilters ? 'Hide Filters' : 'Show Filters'}</p>
            </button>
          </div>
          <div className="accommodation-grid">
            {filteredAccomodations.length === 0 ? (
              <p>No hotels available for selected filters.</p>
            ) : (
              filteredAccomodations.map((acc) => (
                <div key={acc.id} className="accommodation-card">
                  <h4>{acc.name}</h4>
                  <p>Price: {acc.price}</p>
                  <p>Rating: {acc.rating}</p>
                  <p>City: {acc.city_name}</p>
                  <p>Total Likes: {acc.likes_count}</p>
                  {localStorage.getItem("token") ? (
                    <LikeButton
                      accomodationId={acc.id}
                      onLikeChange={refreshAccomodations}
                    />
                  ) : (
                    <p className="not-logged-message">Log in to like this hotel!</p>
                  )}
                  <button
                    onClick={() => window.open(acc.link, '_blank')}
                    className="external-link-button"
                  >
                    Visit Hotel Website 🌐
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hotels;
