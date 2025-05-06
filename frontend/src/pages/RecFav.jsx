import React, { useEffect, useState } from "react";
import "./RecFav.css"; // Importăm fișierul CSS

const RecFav = () => {
  const [recommendations, setRecommendations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:3000/users/${user.id}/recommended`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]); // fallback
        }
      })
      .catch((err) => {
        console.error("Error fetching data", err);
        setRecommendations([]);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="heading">Recommended Locations</h1>
      {recommendations.length === 0 ? (
        <p className="no-recommendations">No recommendations available.</p>
      ) : (
        <ul className="recommendations-list">
          {recommendations.map((item, index) => (
            <li key={index} className="recommendation-item">
              <div className="recommendation-name">
                {item.name} (IATA Code: {item.iataCode})
              </div>
              <div className="recommendation-location">
                Lat: {item.geoCode?.latitude}, Long: {item.geoCode?.longitude}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecFav;
