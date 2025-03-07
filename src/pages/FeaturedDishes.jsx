import React from 'react';

const FeaturedDishes = () => {
  const images = [
    '/assets/images/photo_1_2025-03-07_16-29-21.jpg', // Add your image paths here
    // Add more images as needed
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <img key={index} src={src} alt={`Dish ${index + 1}`} className="w-full h-auto rounded-lg" />
      ))}
    </div>
  );
};

export default FeaturedDishes;
