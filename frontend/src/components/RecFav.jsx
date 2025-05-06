import React, { useEffect, useState } from "react";
import "./RecFav.css";

const RecFav = () => {
  const [recommendations, setRecommendations] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:3000/users/${user.id}/recommended`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching data", err);
        setRecommendations([]);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="heading">Recommended Based on Your Liked Hotels</h1>
      {recommendations.length === 0 ? (
        <p className="no-recommendations">No recommendations available.</p>
      ) : (
        <ul className="recommendations-list">
          {recommendations.map((item, index) => (
            <li key={index} className="recommendation-item">
              <div className="recommendation-name">{item.name}</div>
              <div className="recommendation-location">
                Location: Lat {item.geoCode?.latitude}, Long {item.geoCode?.longitude}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecFav;
