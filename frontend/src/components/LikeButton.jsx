import React, { useEffect, useState } from "react";

const LikeButton = ({ accomodationId }) => {
  const userId = JSON.parse(localStorage.getItem("user"))?.id;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLiked = async () => {
      const res = await fetch(`http://localhost:3000/accomodations/${accomodationId}/liked/${userId}`);
      const data = await res.json();
      setLiked(data.liked);
    };
    checkLiked();
  }, [accomodationId, userId]);

  const handleLike = async () => {
    const method = liked ? 'DELETE' : 'POST';
    const url = liked
      ? `http://localhost:3000/accomodations/${accomodationId}/unlike/${userId}`
      : `http://localhost:3000/accomodations/${accomodationId}/like/${userId}`;

    await fetch(url, { method });
    setLiked(!liked);
  };

  return (
    <button onClick={handleLike}>
      {liked ? "💔 Unlike" : "❤️ Like"}
    </button>
  );
};

export default LikeButton;
