import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 

  useEffect(() => {
    // Initialize Google Sign In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "937599745109-jc0ho2gsoqum7v2r0b4njvt2ob7q406v.apps.googleusercontent.com", // Replace with your actual client ID
        callback: handleGoogleResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("http://localhost:3000/sessions/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      } else {
        setErrorMessage(data.message || 'Google authentication failed');
      }
    } catch (error) {
      setErrorMessage('Error during Google authentication');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:3000/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');  
      } else {
        setErrorMessage(data.message || 'Unknown error');
      }
    } catch (error) {
      setErrorMessage('Error sending the request. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen font-sans flex justify-evenly pt-[70px]">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/sssquiggly.svg')" }} />

      <div className="max-w-md mx-auto h-[450px] my-20 relative rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-300 p-0.5 shadow-lg">
        <div className="darkMode max-w-[400px] h-[446px] p-10 bg-white shadow-lg rounded-lg z-10 text-center">
          <h2 className="mb-5 text-gray-800 text-2xl font-semibold">Welcome Back</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-300 transition"
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-teal-300 transition"
            />
            <button 
              type="submit" 
              className="w-full p-3 bg-emerald-300 text-white font-bold rounded-lg hover:bg-emerald-400 transition"
            >
              Login
            </button>

            <div className="my-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div id="googleSignInDiv" className="w-full"></div>

            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>} 

            <p className="mt-4 text-gray-500">
              Don't have an account?{' '}
              <span 
                className="text-teal-400 cursor-pointer underline" 
                onClick={() => navigate('/signup')}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
