import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
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

// Setare fallback pentru marker implicit
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
  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  const handleAirportClick = (airport) => {
    setSelectedAirports((prev) => {
      if (prev.length === 0) {
        return [airport];
      } else if (prev.length === 1) {
        if (prev[0].id === airport.id) return prev;
        return [prev[0], airport];
      } else {
        return [airport];
      }
    });
  };

  const handleConnectCities = () => {
    const airportsCity1 = airports.filter(
      (airport) =>
        airport.cityName?.toLowerCase() === city1.trim().toLowerCase()
    );
    const airportsCity2 = airports.filter(
      (airport) =>
        airport.cityName?.toLowerCase() === city2.trim().toLowerCase()
    );

    let newRoutes = [];
    airportsCity1.forEach((a1) => {
      airportsCity2.forEach((a2) => {
        newRoutes.push([a1, a2]);
      });
    });

    setRoutes(newRoutes);
  };

  useEffect(() => {
    fetch("http://localhost:3000/points_of_interests")
      .then((res) => res.json())
      .then((data) => setPois(data))
      .catch((err) => console.error("Failed to load POIs:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Failed to load Airports:", err));
  }, []);

  return (
    <div className="relative w-full h-screen">
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
              [
                selectedAirports[0].latitude,
                selectedAirports[0].longitude,
              ],
              [
                selectedAirports[1].latitude,
                selectedAirports[1].longitude,
              ],
            ]}
            pathOptions={{
              color: "red",
              dashArray: "10,10",
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
              color: "blue",
              dashArray: "8,6",
              weight: 1,
            }}
          />
        ))}

        <MapLegend />
      </MapContainer>

      {/* Form Overlay */}
      <div className="form-overlay absolute top-1 gap-1 left-1/2 transform -translate-x-1/2 text-black dark:text-white p-3 z-[1000] flex items-center">
        <input
          type="text"
          placeholder="City 1"
          value={city1}
          onChange={(e) => setCity1(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />
        <input
          type="text"
          placeholder="City 2"
          value={city2}
          onChange={(e) => setCity2(e.target.value)}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        />
        <button
          onClick={handleConnectCities}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          Connect
        </button>
        <button
          className="ml-4 bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
          onClick={() => navigate("/home")}
        >
          ⬅ Home
        </button>
      </div>
    </div>
  );
};

export default POIMap;
