import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ user, setUser }) {

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser)); // Setăm utilizatorul
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); // Eliminăm utilizatorul din stare
    };

    return (
        <header className="header">
        <div className="logo">Vaccation Suggestion App</div>
        <nav className="nav-links">
            <li><Link to="/home">Home</Link></li>
            {!user ? (
                <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                </>
            ) : (
                <li><button onClick={handleLogout}>Logout</button></li>
            )}
        </nav>
        </header>
    );
}

export default Header;
