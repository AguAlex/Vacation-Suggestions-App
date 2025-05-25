import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./POIMap.css";
import MapLegend from "../components/MapLegend";

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
  const [selectedAirports, setSelectedAirports] = useState([]);


  


  useEffect(() => {
    fetch("http://localhost:3000/points_of_interests")
      .then((res) => res.json())
      .then((data) => {
        console.log("POI data:", data); 
        setPois(data);
      })
      .catch((err) => console.error("Failed to load POIs:", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:3000/api/airports")
      .then((res) => res.json())
      .then((data) => {
        console.log("Airport data:", data);
        setAirports(data);
      })
      .catch((err) => console.error("Failed to load Airports:", err));
  }, []);

  return (
    <div className="map-container" style={{ height: "85vh", width: "100%" }}>
      <MapContainer
        center={[40.71427, -74.00597]}
        zoom={3}
        minZoom={3}
        maxZoom={15}
        scrollWheelZoom={true}
        style={{ height: "85vh", width: "100%" }}
        maxBounds={[
          [-85.05112878, -180],
          [85.05112878, 180],
        ]}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          noWrap={true}
          maxBounds={[
            [-85.05112878, -180],
            [85.05112878, 180],
          ]}
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

        <MapLegend />
      </MapContainer>
    </div>
  );
};

export default POIMap;
