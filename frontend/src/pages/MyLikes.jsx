import React, { useEffect, useState } from 'react';
import './MyLikes.css';

const MyLikes = () => {
  const [likedAccommodations, setLikedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      const fetchLikedAccommodations = async () => {
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

      fetchLikedAccommodations();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="my-likes-container">
      <h2>Your Liked Accommodations</h2>
      {likedAccommodations.length === 0 ? (
        <p className="no-likes">You haven't liked any accommodations yet. Start liking some!</p>
      ) : (
        <div className="accommodation-list">
          {likedAccommodations.map((acc) => (
            <div key={acc.id} className="accommodation-card">
              <h4>{acc.name}</h4>
              <p><strong>Price:</strong> {acc.price}</p>
              <p><strong>Rating:</strong> {acc.rating}</p>
              <p><strong>City:</strong> {acc.city_name}</p>
              <p><strong>Total Likes:</strong> {acc.likes_count}</p>
              <p>
                <button
                  onClick={() => window.open(acc.link, '_blank')}
                  className="external-link-button"
                >
                  Visit Hotel Website 🌐
                </button>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLikes;
