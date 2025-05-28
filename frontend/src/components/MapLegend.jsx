import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const MapLegend = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "topright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "darkMode info bg-white legend p-6 rounded-lg text-[14px] shadow-md");
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
