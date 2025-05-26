import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./POIMap.css";
import MapLegend from "../components/MapLegend";
import POIPopup from "./POIPopup";
import { useNavigate } from "react-router-dom";

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
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [routes, setRoutes] = useState([]); // array de perechi de aeroporturi conectate


  const handleAirportClick = (airport) => {
    setSelectedAirports((prev) => {
      if (prev.length === 0) {
        return [airport];
      } else if (prev.length === 1) {
        // dacă dai click pe același aeroport îl ignorăm
        if (prev[0].id === airport.id) return prev;
        return [prev[0], airport];
      } else {
        // dacă sunt deja 2 aeroporturi, resetează la primul click nou
        return [airport];
      }
    });
  };

  const handleConnectCities = () => {
    // Filtrăm aeroporturile după orașe (case insensitive)
    const airportsCity1 = airports.filter(airport =>
      airport.cityName?.toLowerCase() === city1.trim().toLowerCase()
    );

    const airportsCity2 = airports.filter(airport =>
      airport.cityName?.toLowerCase() === city2.trim().toLowerCase()
    );

    // Construim toate perechile posibile între aeroporturile celor 2 orașe
    let newRoutes = [];
    airportsCity1.forEach(a1 => {
      airportsCity2.forEach(a2 => {
        newRoutes.push([a1, a2]);
      });
    });

    setRoutes(newRoutes);
  };


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
  const navigate = useNavigate();

  return (
  <div className="map-wrapper">
      <MapContainer
        center={[40.71427, -74.00597]}
        zoom={3}
        minZoom={3}
        maxZoom={15}
        scrollWheelZoom={true}
        className="leaflet-container"
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
        />

        {pois.map((poi, idx) => (
          <Marker
            key={`poi-${idx}`}
            position={[poi.latitude, poi.longitude]}
            icon={poiIcon}
          >
            <Popup maxWidth={240}>
              <POIPopup poi={poi} />
            </Popup>
          </Marker>
        ))}

        {airports.map((airport, idx) => (
          <Marker
            key={`airport-${idx}`}
            position={[airport.latitude, airport.longitude]}
            icon={airportIcon}
            eventHandlers={{
              click: () => handleAirportClick(airport),
            }}
          >
            <Popup>
              <strong>{airport.name}</strong>
              <br />
              {airport.description || "No description"}
            </Popup>
          </Marker>
        ))}

        {selectedAirports.length === 2 && (
          <Polyline
            positions={[
              [selectedAirports[0].latitude, selectedAirports[0].longitude],
              [selectedAirports[1].latitude, selectedAirports[1].longitude],
            ]}
            pathOptions={{
              color: 'red',
              dashArray: '10,10',
              weight: 3,
            }}
          />
        )}

        {routes.map(([a1, a2], idx) => (
          <Polyline
            key={`route-${idx}`}
            positions={[
              [a1.latitude, a1.longitude],
              [a2.latitude, a2.longitude],
            ]}
            pathOptions={{
              color: 'blue',
              dashArray: '8,6',
              weight: 1,
            }}
          />
        ))}

        <MapLegend />
      </MapContainer>

      {/* FORMULAR CA OVERLAY PE HARTĂ */}
      <div className="darkMode form-overlay">
        <input
          type="text"
          className="darkModeTop3 p-1 rounded-lg"
          placeholder="City 1"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
        />
        <input
          type="text"
          className="darkModeTop3 p-1 rounded-lg"
          placeholder="City 2"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
        />
        <button onClick={handleConnectCities}>Connect</button>

        {/* 👇 Buton nou pentru Home */}
        <button
          className="ml-6 bg-grax-100 p-[0.3rem_0.6rem] darkModeTop3 rounded-lg"
          onClick={() => navigate("/home")}
        >
          ⬅ Home
        </button>
      </div>

    </div>
  );

};

export default POIMap;
