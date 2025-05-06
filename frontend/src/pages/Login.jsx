import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './Home';
import image from '../assets/travel.png';

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email, 
      password, 
    };

    try {
      const response = await fetch("http://localhost:3000/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
      
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log("Data received from server:", data);
        console.log("Storing user in localStorage:", data.user);
 
        navigate('/home');  
      } else {
        
        console.log('Login failed:', data.message || 'Unknown error');
        setErrorMessage(data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending the request:', error);
      setErrorMessage('Error sending the request. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="login-container" >
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin} className="login-form">
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
          <button type="submit">Login</button>

          {errorMessage && <div className="error-message">{errorMessage}</div>} 

          <p>
            Don't have an account?{' '}
            <span className="link" onClick={() => navigate('/signup')}>Sign up</span>
          </p>
        </form>
      </div>

      <img className="login-image" src={image} alt="Image" />
      
    </div>
  );
};

export default Login;
