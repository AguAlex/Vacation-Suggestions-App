import React, { useEffect, useState } from "react";
import "./Clusters.css";

const Clusters = () => {
  const [clusters, setClusters] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/som_result.json")
      .then((res) => res.json())
      .then((data) => setClusters(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  return (
    <div className="clusters-container">
      {Object.entries(clusters).map(([key, pois]) => (
        <div key={key} className="cluster-box">
          <h2 className="cluster-title">
            📍 Cluster {key.replace(/[()]/g, "")}
          </h2>
          <ul>
            {pois.map((poi, index) => (
              <li key={index} className="poi-item">
                <strong>{poi.name}</strong> <br />
                Rating: {poi.rating} <br />
                Lat: {poi.latitude}, Long: {poi.longitude}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Clusters;
