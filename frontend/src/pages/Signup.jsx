import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';
import image from '../assets/travel2.png';

const Signup = () => {
  const [nume, setNume] = useState("");     // numele userului
  const [email, setEmail] = useState("");   // emailul userului
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Structurăm datele de signup
    const signupData = {
      email, // email-ul
      password,// parola
      nume,// numele utilizatorului
    };

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: signupData }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Signup successful:', data);
        navigate('/login');
      } else {
        alert('Signup failed: ' + data.errors.join(', '));
      }
    } catch (error) {
      console.error('Error sending the request:', error);
      alert('Error sending the request');
    }
  };

  return (
    <div className="container" style={{ backgroundColor: 'rgb(247, 228, 233)'}}>
      <img className="signup-image" src={image} alt="Image" />

      <div className="signup-container">
        <h2>Create an Account</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input 
            type="text" 
            placeholder="Name" 
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Signup;
