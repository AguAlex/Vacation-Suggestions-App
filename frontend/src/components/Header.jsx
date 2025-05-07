import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header({ user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Obține locația curentă a rutei
  const isHomePage = location.pathname === "/home"; // Verifică dacă suntem pe pagina Home
   const [showPersonalize, setShowPersonalize] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Alege clasa pentru header în funcție de pagina curentă
  const headerClass = isHomePage ? "header" : "header-other";

  return (
    <header
      className={`header ${scrolled ? "header-scrolled" : ""} ${headerClass}`}
    >
      <ul className="nav-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/vacation">See Vacations</Link>
        </li>
       

        {!user ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        ) : (
          <>
            <Link to="/my-likes">My Likes</Link>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>

            <li>
              <Link to="/map">Points of Interest Map</Link>
            </li>

          </>
        )}
        <div className="personalize-button-container">
          <button className="personalize-btn" onClick={() => setShowPersonalize(!showPersonalize)}>
            Personalize
          </button>
        </div>

        {showPersonalize && (
          <aside className="personalize-aside">
            <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isDark = e.target.checked;
                    document.body.classList.toggle("dark-mode", isDark);
                    localStorage.setItem("theme", isDark ? "dark" : "light");
                  }}
                  defaultChecked={localStorage.getItem("theme") === "dark"}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">🌙 Dark Mode</span>
            </div>

                  
            <div className="font-size-label">
              <button className="small-font" onClick={() => {
                document.documentElement.classList.remove("font-medium", "font-large");
                document.documentElement.classList.add("font-small");
              }}>A</button>

              <button className="medium-font" onClick={() => {
                document.documentElement.classList.remove("font-small", "font-large");
                document.documentElement.classList.add("font-medium");
              }}>A</button>

              <button className="large-font" onClick={() => {
                document.documentElement.classList.remove("font-small", "font-medium");
                document.documentElement.classList.add("font-large");
              }}>A</button>
            </div>

          </aside>
        )}


      </ul>
    </header>
  );
}

export default Header;
