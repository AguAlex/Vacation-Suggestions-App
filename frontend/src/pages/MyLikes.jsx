import React, { useEffect, useState } from 'react';
import './MyLikes.css';
const MyLikes = () => {
  const [likedAccomodations, setLikedAccomodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const fetchLikedAccommodations = async () => {
        try {
          const response = await fetch(`http://localhost:3000/users/${user.id}/likes`);
          const data = await response.json();
          console.log("Liked accommodations response:", data);
          setLikedAccomodations(data);
        } catch (error) {
          console.error('Error fetching liked accomodations:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLikedAccommodations();
    } else {
      setLoading(false);  // Dacă nu este utilizator logat, nu mai facem nimic
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-likes-container">
      <h2>Your Liked Accomodations</h2>
      {likedAccomodations.length === 0 ? (
        <p>You haven't liked any accommodations yet. Start liking some!</p>
      ) : (
        <div className="accommodation-list">
          {likedAccomodations.map((acc) => (
            <div key={acc.id} className="accommodation-card">
              <h4>{acc.name}</h4>
              <p>Price: {acc.price}</p>
              <p>Rating: {acc.rating}</p>
              <p>City: {acc.city_name}</p>
              <p>Total Likes: {acc.likes_count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLikes;
