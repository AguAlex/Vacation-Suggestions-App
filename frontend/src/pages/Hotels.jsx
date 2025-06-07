import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; 
import LikeButton from '../components/LikeButton';

const Hotels = () => {
  const { id } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const cityFromQuery = queryParams.get('city');

  const [countryName, setCountryName] = useState('');
  const [cities, setCities] = useState([]);
  const [accomodations, setAccomodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/countries/${id}`);
      const data = await response.json();
      setCountryName(data.name || '');
      setCities(data.cities || []);
      setAccomodations(data.accomodations || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (cityFromQuery) {
      setSelectedCity(cityFromQuery);
      setShowFilters(true);
    }
  }, [cityFromQuery]);

  const refreshAccomodations = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setSelectedCity(null);
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
  };

  const filteredAccomodations = accomodations.filter((acc) => {
    const matchesCity = selectedCity ? acc.city_name === selectedCity : true;
    const matchesMin = minPrice ? acc.price >= Number(minPrice) : true;
    const matchesMax = maxPrice ? acc.price <= Number(maxPrice) : true;
    const matchesRating = minRating ? acc.rating >= Number(minRating) : true;
    return matchesCity && matchesMin && matchesMax && matchesRating;
  });

  return (
    <div className="w-screen mx-auto pt-[70px] font-sans px-4">
      <div className="flex">
        {showFilters && (
          <aside className="darkModeTop3 w-[250px] mr-8 bg-gray-100 p-4 rounded-lg">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">Filters</h3>
            </div>

            <div className="mb-5">
              <label className="font-bold block mb-1">City</label>
              <ul className="flex flex-wrap gap-2 p-0">
                {cities.map((city) => (
                  <li
                    key={city.id}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      selectedCity === city.name
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-gray-200 text-black'
                    }`}
                    onClick={() =>
                      setSelectedCity((prevCity) =>
                        prevCity === city.name ? null : city.name
                      )
                    }
                  >
                    {city.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-5">
              <label className="font-bold block mb-1">Min Budget</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="text-gray-800 w-full p-2 rounded border border-gray-300"
              />
            </div>

            <div className="mb-5">
              <label className="font-bold block mb-1">Max Budget</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="text-gray-800 w-full p-2 rounded border border-gray-300"
              />
            </div>

            <div className="mb-5">
              <label className="font-bold block mb-1">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="text-gray-800 w-full p-2 rounded border border-gray-300"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r} stars</option>
                ))}
              </select>
            </div>

            <button
              className="mt-4 w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </aside>
        )}

        <section className="flex-1">
          <div className="grid justify-center mb-4">
            <h3 className="text-4xl font-myfont text-center mb-4">
              Available hotels in {countryName}
            </h3>
            <button
              className="darkModeTop3 mb-4 px-4 py-2 bg-black/20 text-black rounded w-fit mx-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {loading ? (
            <div className="text-center mt-16 text-lg">Loading hotels...</div>
          ) : filteredAccomodations.length === 0 ? (
              <div className="text-center mt-16 text-lg text-gray-500">
                No hotels found matching your filters.
              </div>)
           : (
            <div className="flex flex-wrap justify-center items-center gap-6">
              {filteredAccomodations.map((acc) => (
                <div
                  key={acc.id}
                  className="relative flex flex-col items-center justify-center p-5 w-72 h-64 hover:-translate-y-1 transform transition-transform"
                >
                  {acc.imagine && (
                    <img
                      src={acc.imagine}
                      alt={acc.name}
                      className="absolute top-0 right-0 -z-10 w-full h-48 object-cover rounded-md mb-4"
                    />
                  )}

                  {localStorage.getItem("token") && (
                    <LikeButton
                      accomodationId={acc.id}
                      onLikeChange={refreshAccomodations}
                      className="absolute -top-4 right-2"
                    />
                  )}

                  <div
                    onClick={() => window.open(acc.link, '_blank')}
                    className="darkModeTop3 cursor-pointer rounded-lg mt-[40%] bg-white text-black shadow-md w-full p-4 flex flex-col items-start items-center"
                  >
                    <h4 className="text-l font-myfont">{acc.name}</h4>
                    <p className="text-gray-600">
                      from <span className="darkModeButtons font-bold text-gray-800">&#8364;{acc.price}</span>
                    </p>
                    <div className="flex items-center justify-evenly w-full">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={i <= acc.rating ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-red-400">{acc.likes_count}&#x2764;</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">City: {acc.city_name}</p>
                  </div>
                </div>
              ))}

            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Hotels;
