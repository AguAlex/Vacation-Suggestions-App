import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 

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

      <div class="max-w-md mx-auto h-[358px] my-20 relative rounded-lg bg-gradient-to-tr from-emerald-600 to-sky-300 p-0.5 shadow-lg">
        <div className="darkMode max-w-[400px] p-10 bg-white shadow-lg rounded-lg z-10 text-center">
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
              className="w-full p-3 bg-teal-300 text-white font-bold rounded-lg hover:bg-teal-400 transition"
            >
              Login
            </button>

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
