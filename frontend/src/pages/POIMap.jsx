import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./POIMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const POIMap = () => {
  const [pois, setPois] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/points_of_interests")
      .then((res) => res.json())
      .then((data) => setPois(data))
      .catch((err) => console.error("Failed to load POIs:", err));
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[40.71427, -74.00597]}
        zoom={2}
        scrollWheelZoom
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pois.map((poi, idx) => (
          <Marker key={idx} position={[poi.latitude, poi.longitude]}>
            <Popup>
              <strong>{poi.name}</strong>
              <br />
              {poi.description || "No description"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default POIMap;
