import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Vacation() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 5;
  const [accomodations, setAccomodations] = useState([]);

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

  useEffect(() => {
    const fetchAccomodations = async () => {
      try {
        const response = await fetch("http://localhost:3000/accomodations");
        if (!response.ok) throw new Error("Failed to fetch accomodations");
        const data = await response.json();
        setAccomodations(data);
      } catch (error) {
        console.error("Error fetching accomodations:", error);
      }
    };

    fetchAccomodations();
  }, []);


  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const usaCities = cities.filter(city =>
  city.country?.name === "United States" || city.country?.name === "UnitedStates"
  );

  const citiesWithPropertyCount = usaCities.map(city => {
    const count = accomodations.filter(acc => acc.city_id === city.id).length;
    return {
      ...city,
      propertyCount: count,
    };
  });

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
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <hr className="border-1 ml-[25vw] w-[70vw] border-emerald-500 rounded-full" />
          <h2 className="font-myfont text-semibold text-4xl">Our destinations</h2>
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

      <div className="w-full grid gap-4 mt-10">
        <h1 className="text-3xl text-black ml-20 font-myfont">Explore the USA!</h1>
        <div className="flex flex-wrap justify-center gap-6 p-7">
            {usaCities.length > 0 ? (
              citiesWithPropertyCount.slice(0, 5).map((city) => (
                <Link
                  key={city.id}
                  to={`/hotels/${city.country?.id}?city=${encodeURIComponent(city.name)}`}
                  className="darkModeTop3 rounded-xl w-[160px] sm:w-[180px] md:w-[200px] p-4 text-center text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold mb-2">{city.name}</h3>
                  <p>{city.propertyCount} properties</p>
                  {/* <img
                    src={`images/${city.name}.jpg`}
                    alt={city.name}
                    className="w-full h-32 object-cover rounded-lg"
                  /> */}
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
