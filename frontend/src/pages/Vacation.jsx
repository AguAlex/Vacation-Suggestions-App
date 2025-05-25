import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Vacation() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 5;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/countries");
        if (!response.ok) throw new Error("Failed to fetch countries");
        const data = await response.json();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

    useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:3000/cities");
        if (!response.ok) throw new Error("Failed to fetch cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, countries]);

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const usaCities = cities.filter(city => city.country === "UnitedStates" || city.country === "United States");

  return (
    <div className="flex flex-col items-center w-full pt-20 min-h-screen px-4">
      <h2 className="text-5xl text-gray-800 mb-6 font-myfont font-bold">Where to?</h2>

      <div className="w-full max-w-sm min-w-[200px] mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a city or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease-in-out focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm"
          />
          {/* <button
            type="button"
            className="shadow-2xl absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 text-sm text-white hover:bg-slate-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              />
            </svg>
            Search
          </button> */}
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <hr className="border-1 ml-[25vw] w-[70vw] border-emerald-500 rounded-full" />
          <h2 className="font-myfont text-semibold text-4xl">Trending destinations</h2>
          <hr className="border-1 mr-[25vw] w-[70vw] border-emerald-500 rounded-full" />
        </div>

        {filteredCountries.length > 0 ? (
          <div className="w-full flex flex-row items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
            
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex flex-col items-center justify-center text-black w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex flex-wrap justify-center gap-4 flex-grow max-w-7xl">
              {currentCountries.map((country) => (
                <Link
                  key={country.id}
                  to={`/hotels/${country.id}`}
                  className="bg-transparent rounded-xl w-full sm:w-[45%] md:w-[30%] lg:w-[18%] max-w-[220px] p-4 text-center text-gray-800 no-underline transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn"
                >
                  <h3 className="text-xl font-semibold mb-2">{country.name}</h3>
                  <img
                    src={`images/${country.name}.png`}
                    alt={country.name}
                    className="w-full h-40 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                  />
                </Link>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={currentPage === totalPages}
              className="flex flex-col items-center justify-center text-black w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <p className="text-lg text-gray-600 text-center mt-6">No countries found...</p>
        )}
      </div>

      <hr className="border-1 border-gray-500 rounded-full w-[100vw] mt-10" />

      <div className="w-full flex gap-4 mt-10">
        <h1 className="text-3xl text-black ml-20 font-myfont">Explore the USA!</h1>
<div className="flex flex-wrap justify-center gap-6">
          {usaCities.length > 0 ? (
            usaCities.slice(0, 6).map((city) => (
              <Link
                key={city.id}
                to={`/hotels/${city.id}`}
                className="bg-white rounded-xl w-[160px] sm:w-[180px] md:w-[200px] p-4 text-center text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <h3 className="text-lg font-semibold mb-2">{city.name}</h3>
                <img
                  src={`images/${city.name}.jpg`}
                  alt={city.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </Link>
            ))
          ) : (
            <p className="text-gray-600">No cities from the USA found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Vacation;
