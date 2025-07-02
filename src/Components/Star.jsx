import React from 'react';
import '../Style/Star.css';

const Star = ({ rating = "0" , review= "0" }) => {
  // Convert string rating to number
  const numRating = parseFloat(rating);
  
  // Ensure rating is between 0 and 5
  const clampedRating = Math.max(0, Math.min(5, numRating));
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      let starImage;
      
      if (clampedRating >= i) {
        // Full star
        starImage = '/star.png';
      } else if (clampedRating >= i - 0.5) {
        // Half star
        starImage = '/starhalf.png';
      } else {
        // Empty star
        starImage = '/starempty.png';
      }
      
      stars.push(
        <img 
          key={i} 
          src={starImage} 
          alt="star" 
          className="star-image"
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="star-rating">
      {renderStars()}  ({review})
    </div>
  );
};

export default Star;