import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = {
      email,
      password,
      nume,
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
    <div className="relative flex justify-evenly min-h-screen items-center overflow-hidden">
      
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/sssquiggly.svg')" }} />
      
      <div class="max-w-md mx-auto h-[421px] my-20 relative rounded-lg bg-gradient-to-tr from-emerald-600 to-sky-300 p-0.5 shadow-lg">
        <div className="darkMode max-w-md w-full bg-white shadow-lg rounded-lg p-10 text-center z-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={nume}
                onChange={(e) => setNume(e.target.value)}
                required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="submit"
              className="w-full py-3 bg-orange-300 text-white font-bold rounded-lg hover:bg-orange-400 transition duration-300"
            >
              Sign Up
            </button>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-orange-400 cursor-pointer underline hover:text-orange-500"
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
