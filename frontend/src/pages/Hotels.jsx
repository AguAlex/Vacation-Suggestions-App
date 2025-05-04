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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/countries/${id}`);
        const data = await response.json();
        console.log(data);
        setCountryName(data.name || '');
        setCities(data.cities || []);
        setAccomodations(data.accomodations || []);
        setLoading(false);
      } catch (error) {
        console.error("Eroare la încărcare:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="hotels-loading">Se încarcă...</div>;
  }

  const getUserIdFromLocalStorage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/countries/${id}`);
      const data = await response.json();
      setCountryName(data.name || '');
      setCities(data.cities || []);
      setAccomodations(data.accomodations || []);
      setLoading(false);
    } catch (error) {
      console.error("Eroare la încărcare:", error);
      setLoading(false);
    }
  };
  
  const refreshAccomodations = () => {
    fetchData(); // reîncarcă accomodations pentru a actualiza numărul de like-uri
  };

  return (
    <div className="hotels-container">
      <h2 className="section-title">Cities from {countryName}</h2>
      <ul className="city-list">
        {cities.map((city) => (
          <li key={city.id} className="city-item">
            {city.name}
          </li>
        ))}
      </ul>

      <h3 className="section-title">Available hotels</h3>
      <br/>
      <div className="accomodation-grid">
      {accomodations.map((acc) => (
        <div key={acc.id} className="accomodation-card">
          <h4>{acc.name}</h4>
          <p>Price: {acc.price}</p>
          <p>Rating: {acc.rating}</p>
          <p>City: {acc.city_name}</p>

          <p>Total Likes: {acc.likes_count}</p>
          <LikeButton accomodationId={acc.id} onLikeChange={() => refreshAccomodations()} />
        </div>
      ))}
      </div>
    </div>
  );
};

export default Hotels;
