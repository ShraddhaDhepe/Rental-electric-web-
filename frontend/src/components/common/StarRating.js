import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, size = 14 }) => {
  return (
    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} style={{ fontSize: size }}>
          {rating >= star ? (
            <FaStar />
          ) : rating >= star - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
