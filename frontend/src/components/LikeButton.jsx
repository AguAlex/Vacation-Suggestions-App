import React, { useEffect, useState } from "react";

const LikeButton = ({ accomodationId, onLikeChange }) => {
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
    onLikeChange(); // notifică Hotels să reîncarce
  };

  return (
    <button
      className={`mt-6 w-8 h-8 rounded-full text-sm flex items-center justify-center font-medium transition
        ${liked
          ? "bg-red-200 text-red-800 hover:bg-red-300"
          : "bg-gray-100 text-gray-800 hover:bg-pink-100"}
      `}
      onClick={handleLike}
    >
      {liked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#dc2626"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#dc2626"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.623-2.052-4.75-4.583-4.75-1.538 0-2.897.784-3.667 1.981C12.48 4.284 11.122 3.5 9.583 3.5 7.052 3.5 5 5.627 5 8.25c0 4.775 7 9.75 7 9.75s7-4.975 7-9.75z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.623-2.052-4.75-4.583-4.75-1.538 0-2.897.784-3.667 1.981C12.48 4.284 11.122 3.5 9.583 3.5 7.052 3.5 5 5.627 5 8.25c0 4.775 7 9.75 7 9.75s7-4.975 7-9.75z"
          />
        </svg>
      )}
    </button>
  );
};

export default LikeButton;
