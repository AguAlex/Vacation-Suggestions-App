import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RecFav = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:3000/users/${user.id}/recommended`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRecommendations(data);
        } else {
          setRecommendations([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching data", err);
        setRecommendations([]);
      });
  }, []);

  return (
    <div className="px-5 py-10 max-w-6xl mx-auto flex flex-col gap-8">

      <div className="flex items-center gap-4">
        <h1 className="text-3xl text-gray-800 font-semibold font-myfont">
          You might also like...
        </h1>
        <hr className="flex-1 border-1 border-emerald-500 rounded-full" />
      </div>

      
      {recommendations.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No recommendations available.</p>
      ) : (
        <ul className="flex flex-wrap justify-center gap-6 list-none p-0">
          {recommendations.map((item, index) => (
            <Link
              key={index}
              to={`/hotels/${item.country_id}`}
              className="flex-1 max-w-sm bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
            >
              <li className="flex flex-col justify-between h-full">
                
                {item.country_image && (
                  <div className="w-full aspect-video overflow-hidden rounded-md mb-4">
                    <img
                      src={`/images/${item.country_name.toLowerCase()}.png`}
                       alt={item.country_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-lg font-semibold text-gray-800 mb-2">{item.name}</div>

                <div className="text-sm text-gray-600">
                  Location: Lat {item.geoCode?.latitude}, Long {item.geoCode?.longitude}
                </div>
              </li>
            </Link>
          ))}
        </ul>

      )}

      <div className="flex items-center gap-4">
        <hr className="flex-1 border-1 border-emerald-500 rounded-full" />
        <h1 className="text-3xl text-gray-800 font-semibold font-myfont">
          Check these out!
        </h1>
      </div>
    </div>
  );
};

export default RecFav;
