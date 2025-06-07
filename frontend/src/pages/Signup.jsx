import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        alert('Google authentication failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      alert('Error during Google authentication');
    }
  };

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
      
      <div className="max-w-md mx-auto h-[484px] my-20 relative rounded-lg bg-gradient-to-tr from-emerald-600 to-sky-300 p-0.5 shadow-lg">
        <div className="darkMode max-w-md h-[480px] w-full bg-white shadow-lg rounded-lg p-10 text-center z-50">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button
              type="submit"
              className="w-full py-3 bg-emerald-300 text-white font-bold rounded-lg hover:bg-emerald-400 transition duration-300"
            >
              Sign Up
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

            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-emerald-400 cursor-pointer underline hover:text-emerald-500"
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
