import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 0, reviewsCount, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5 text-amber-400">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && <StarHalf size={size} className="fill-amber-400 text-amber-400" />}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-slate-300 fill-slate-100" />
        ))}
      </div>

      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 ml-0.5">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
      )}

      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
