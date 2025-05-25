import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const MapLegend = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "topright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend bg-white p-2 rounded shadow-md");
      div.style.background = "white";
      div.style.padding = "8px";
      div.style.borderRadius = "8px";
      div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      div.style.fontSize = "14px";
      div.innerHTML = `
        <h4 style="margin:0 0 8px 0; font-weight:bold;">Legenda</h4>
        <div style="display:flex; align-items:center; margin-bottom:4px;">
          <img src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" alt="POI" style="width:20px; height:20px; margin-right:8px;" />
          Puncte de Interes
        </div>
        <div style="display:flex; align-items:center;">
          <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="Airport" style="width:20px; height:20px; margin-right:8px;" />
          Aeroporturi
        </div>
      `;
      // Pt zoom
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    legend.addTo(map);

    // Cleanup când componenta se demontează
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default MapLegend;
