import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (!token) {
      navigate("/login"); // Redirecționează utilizatorul la login dacă nu există token
    } else if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser); // Verifică ce date sunt în storedUser
        setUser(parsedUser); // Setează utilizatorul dacă este valid
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        navigate("/login"); // Dacă nu reușește să parseze datele, trimite la login
      }
    } else {
      navigate("/login"); // Dacă nu există utilizator stocat, trimite la login
    }
  }, [navigate]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
        <Header />
        {user ? (
            <div>
              <h1>Hello, {user.nume}!</h1> 
              <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <h1>Loading...</h1>
        )}
    </div>
  );
}

export default Home;
