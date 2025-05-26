import React, { useEffect, useState } from 'react';
import LikeButton from '../components/LikeButton';

const MyLikes = () => {
  const [likedAccommodations, setLikedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchLikedAccommodations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}/likes`);
      const data = await response.json();
      setLikedAccommodations(data);
    } catch (error) {
      console.error('Error fetching liked accommodations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedAccommodations();
  }, []);

  const refreshAccomodations = () => {
    fetchLikedAccommodations();
  };



  if (loading) {
    return (
      <div className="text-center text-lg py-10 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen px-4">
      <h2 className="text-center text-3xl mb-8 text-gray-800 font-myfont">
        Your Liked Accommodations
      </h2>

      {likedAccommodations.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          You haven't liked any accommodations yet. Start liking some!
        </p>
      ) : (
        <div className="flex flex-col text-center items-center mb-6">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {likedAccommodations.map((acc) => (
              <div
                key={acc.id}
                className="relative flex flex-col items-centerrounded-xl justify-center p-5 w-72 hover:-translate-y-1 transform transition-transform"
              >
                {acc.imagine && (
                  <img
                    src={acc.imagine}
                    alt={acc.name}
                    className="absolute top-0 right-0 -z-10 w-full h-[60%] object-cover rounded-md mb-4"
                  />
                )}

                <LikeButton
                  accomodationId={acc.id}
                  onLikeChange={refreshAccomodations}
                  className="fixed -top-6 right-0"
                />

                <div 
                  onClick={() => window.open(acc.link, '_blank')}
                  className="darkModeTop3 cursor-pointer rounded-lg mt-[40%] bg-white text-black shadow-md w-full p-4 flex flex-col items-start items-center">
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
                </div>
              </div>
            ))}
          </div>

          <br></br>
        </div>
      )}
    </div>
  );
};

export default MyLikes;
