import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./POIMap.css";

// Marker galben pentru POI
const poiIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Marker albastru pentru aeroporturi
const airportIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Fix pentru iconul implicit
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const POIMap = () => {
  const [pois, setPois] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/points_of_interests") // Ai grijă ca backend-ul să expună aceste date
      .then((res) => res.json())
      .then((data) => {
        console.log("POI data:", data); // Vezi exact ce e aici
        setPois(data);
      })
      .catch((err) => console.error("Failed to load POIs:", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/api/airports") // Ai grijă ca backend-ul să expună aceste date
      .then((res) => res.json())
      .then((data) => {
        console.log("Airport data:", data); // Vezi exact ce e aici
        setAirports(data);
      })
      .catch((err) => console.error("Failed to load Airports:", err));
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
          <Marker
            key={`poi-${idx}`}
            position={[poi.latitude, poi.longitude]}
            icon={poiIcon}
          >
            <Popup>
              <strong>{poi.name}</strong>
              <br />
              {poi.description || "No description"}
            </Popup>
          </Marker>
        ))}

        {airports.map((airport, idx) => (
          <Marker
            key={`airport-${idx}`}
            position={[airport.latitude, airport.longitude]}
            icon={airportIcon}
          >
            <Popup>
              <strong>{airport.name}</strong>
              <br />
              {airport.description || "No description"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default POIMap;
