import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header({ user, setUser }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Obține locația curentă a rutei
  const isHomePage = location.pathname === "/home"; // Verifică dacă suntem pe pagina Home

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
      <div className="logo">Vaccation Suggestion App</div>
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
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
