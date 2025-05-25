import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LikeButton from '../components/LikeButton';

const Hotels = () => {
  const { id } = useParams();
  const [countryName, setCountryName] = useState('');
  const [cities, setCities] = useState([]);
  const [accomodations, setAccomodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  const refreshAccomodations = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setSelectedCity(null);
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredAccomodations = accomodations.filter((acc) => {
    const matchesCity = selectedCity ? acc.city_name === selectedCity : true;
    const matchesMin = minPrice ? acc.price >= Number(minPrice) : true;
    const matchesMax = maxPrice ? acc.price <= Number(maxPrice) : true;
    return matchesCity && matchesMin && matchesMax;
  });

  return (
    <div className="w-screen mx-auto pt-[70px] font-sans px-4">
      <div className="flex">
        {showFilters && (
          <aside className="w-[250px] mr-8 bg-gray-100 p-4 rounded-lg border border-gray-300">
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
                className="w-full p-2 rounded border border-gray-300"
              />
            </div>

            <div className="mb-5">
              <label className="font-bold block mb-1">Max Budget</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="w-full p-2 rounded border border-gray-300"
              />
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
            <h3 className="text-2xl font-semibold text-center mb-4">
              Available hotels in {countryName}
            </h3>
            <button
              className="mb-4 px-4 py-2 bg-black/20 text-black rounded w-fit mx-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {loading ? (
            <div className="text-center mt-16 text-lg">Loading hotels...</div>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {filteredAccomodations.length === 0 ? (
                <p className="text-center col-span-full">
                  No hotels available for selected filters.
                </p>
              ) : (
                filteredAccomodations.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex flex-col items-center justify-between bg-white border border-gray-300 rounded-xl p-6 shadow hover:-translate-y-1 transition-transform text-center"
                  >
                    {/* Imaginea hotelului */}
                    {acc.imagine && (
                      <img  
                        src={acc.imagine}
                        alt={acc.name}
                        className="w-full h-32 object-cover rounded-md mb-4"
                      />
                    )}

                    <h4 className="text-lg font-bold">{acc.name}</h4>
                    <p>
                      from <span className="font-bold">&#8364;{acc.price}</span>
                    </p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={i <= acc.rating ? "text-yellow-400" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p>City: {acc.city_name}</p>
                    <p>Total Likes: {acc.likes_count}</p>

                    {localStorage.getItem("token") && (
                      <LikeButton
                        accomodationId={acc.id}
                        onLikeChange={refreshAccomodations}
                      />
                    )}

                    <button
                      onClick={() => window.open(acc.link, "_blank")}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
                    >
                      Visit Hotel Website 🌐
                    </button>
                  </div>

                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Hotels;
