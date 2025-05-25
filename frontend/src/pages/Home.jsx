import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import uk from "../assets/UnitedKingdom.jpg";
import france from "../assets/France.jpg";
import us from "../assets/UnitedStates.jpg";

import ChatBot from "../components/Chatbot";
import RecFav from "../components/RecFav";

function Home({ user, setUser }) {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [topAccomodations, setTopAccomodations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    fetch("http://localhost:3000/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/top_accomodations")
      .then((res) => res.json())
      .then((data) => setTopAccomodations(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % countries.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [countries]);

  const images = {
    0: uk,
    1: us,
    2: france,
  };
  
  return (
    <div className=" min-h-screen flex flex-col items-center">
      <div className="relative w-screen h-[80vh] overflow-hidden">
        {countries.map((country, index) => (
          <div
            key={country.id}
            className={`absolute inset-0 flex justify-center items-center duration-500 ${
              index === slideIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={images[index]}
              alt={country.name}
              className="w-full h-[50vw] object-cover"
            />
            <div className="slidesGradient bg-[linear-gradient(to_top,_#f0f9ff_0%,_rgba(247,228,233,0)_15%)] absolute inset-0 pointer-events-none"></div>
          </div>
        ))}
      </div>

      <br />
      {user ? (
        <div className="flex gap-10 items-center justify-center mt-10">
          <div className="mt-6 w-8 h-8 bg-gradient-to-r to-emerald-600 from-sky-400 rounded-full"></div>
          <div className="mt-6 w-16 h-16 bg-gradient-to-r from-emerald-600 to-sky-400 rounded-full"></div>
          <div className="mt-6 w-32 h-32 bg-gradient-to-r to-emerald-600 from-sky-400 rounded-full"></div>
          <div className="font-myfont p-10 text-center mt-6 w-100 h-100 bg-gradient-to-r from-emerald-600 to-sky-400 rounded-full">
            <h1 className="text-4xl text-sky-50">Hello, {user.nume}!</h1>
            <p className="text-lg text-sky-50 mt-2">
              Welcome back to the Vacation Suggestion App! 
            </p>
            <p className="text-lg text-sky-50">We missed you! Start exploring your favorite destinations! </p>
          </div>
          <div className="mt-6 w-32 h-32 bg-gradient-to-r to-emerald-600 from-sky-400 rounded-full"></div>
          <div className="mt-6 w-16 h-16 bg-gradient-to-r from-emerald-600 to-sky-400 rounded-full"></div>
          <div className="mt-6 w-8 h-8 bg-gradient-to-r to-emerald-600 from-sky-400 rounded-full"></div>
        </div>
      ) : (
        <div className="font-myfont border-4 p-6 mt-6 rounded-xl w-4/5 text-center text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Welcome to Vacation Suggestion App! 🎉</h2>
          <p className="mb-3">Sign in or sign up to unlock amazing features, including:</p>
          <div className="text-left list-none text-lg pl-0 text-gray-800">
            <p className="mb-2">💙 Save your favorite destinations</p>
            <p className="mb-2">🤖 Get personapzed recommendations through our chatbot</p>
            <p className="mb-2">📅 Enjoy exclusive travel tips and offers</p>
          </div>
          <p className="mt-4 text-base text-gray-700">
            If you're not logged in yet, no worries! Let's find the perfect vacation for you! 
          </p>
        </div>
      )}
      <br />
      <div className="w-screen px-5 mt-10 text-center">
        <h2 class="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Top 3 Hotels based on likes</span>
        </h2>
        
        <div className="flex w-full gap-4 border-t-2 border-b-2 border-gray-300 p-4">
          {topAccomodations.map((acc, index) => (
            <div
              key={acc.id}
              onClick={() => window.open(acc.link, "_blank")}
              className="border-1 border-gray-100 cursor-pointer basis-1/3 transition-all duration-500 ease-in-out hover:basis-1/2 shadow-lg rounded-lg overflow-hidden"
            >
              
              <img
                src={acc.imagine}
                alt={acc.name}
                className="w-full h-32 object-cover"/>
              <div className="darkModeTop3 bg-white text-black shadow-md w-full p-4 flex flex-col items-start items-center">
                <h4 className="text-xl font-semibold mb-2">{acc.name}</h4>
                <div className="flex justify-evenly w-full">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={i <= acc.rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                      </span>
                    ))}
                  </div>

                  <p>{acc.country_name}, {acc.city_name}</p>
                  <p className="text-red-400">{acc.likes_count}&#x2764;</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {user && <ChatBot />}
      <br />
      {user && <RecFav />}
    </div>
  );
}

export default Home;