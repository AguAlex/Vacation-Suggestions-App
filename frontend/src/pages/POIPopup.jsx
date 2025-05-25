import React, { useState } from "react";
import "./POIPopup.css";

const POIPopup = ({ poi }) => {
  const imageLinks = poi.image?.split(",").map((link) => link.trim()) || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + imageLinks.length) % imageLinks.length);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % imageLinks.length);
  };

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  return (
    <div className="poi-popup">
      <strong>{poi.name}</strong>
      <div
        className={`poi-description ${showFullDescription ? "expanded" : ""}`}
      >
        {poi.description || "No description"}
      </div>
      {poi.description && poi.description.length > 120 && (
        <button
          className="toggle-description-btn"
          onClick={(e) => {
            e.stopPropagation();
            toggleDescription();
          }}
        >
          {showFullDescription ? "Vezi mai puțin" : "Vezi mai mult"}
        </button>
      )}

      {imageLinks.length > 0 && (
        <div className="poi-image-wrapper">
          <img
            src={imageLinks[currentIndex]}
            alt={poi.name}
            className="poi-image"
          />
          {imageLinks.length > 1 && (
            <>
              <button onClick={showPrev} className="poi-nav-button left">◀</button>
              <button onClick={showNext} className="poi-nav-button right">▶</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default POIPopup;
