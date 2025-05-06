import React, { useEffect, useState } from 'react';
import './MyLikes.css';
import LikeButton from '../components/LikeButton';

const MyLikes = () => {
  const [likedAccomodations, setLikedAccomodations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLikedAccommodations = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    fetchLikedAccommodations();
  }, []);

  const refreshAccomodations = () => {
    fetchLikedAccommodations();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-likes-container">
      <h2>Your Liked Accommodations</h2>
      {likedAccomodations.length === 0 ? (
        <p>You haven't liked any accommodations yet. Start liking some!</p>
      ) : (
        <div className="accommodation-list">
          {likedAccomodations.map((acc) => (
            <div key={acc.id} className="likes-accommodation-card">
              <h4>{acc.name}</h4>
              <p>Price: {acc.price}</p>
              <p>Rating: {acc.rating}</p>
              <p>City: {acc.city_name}</p>
              <p>Total Likes: {acc.likes_count}</p>
              <LikeButton
                accomodationId={acc.id}
                onLikeChange={refreshAccomodations} // Refresh the list after liking/unliking
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLikes;
