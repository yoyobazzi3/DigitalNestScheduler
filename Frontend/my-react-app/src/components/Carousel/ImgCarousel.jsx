import React from 'react';
import './ImgCarousel.css'; // Assuming styles are stored here

const  Carousel = () => {
  return (
    <div className="rectangle-container">
      <div className="row">
        <div className="rectangle rectangle-small">
            <h2>Top Growth</h2>
            <h3>By Location</h3>
            </div>
        <div className="rectangle rectangle-small">
        <h2>Top Growth</h2>
        <h3>By Department</h3>
        </div>
      </div>
      <div className="row">
        <div className="rectangle rectangle-large">
            <h1>Overall Team Growth</h1>
        </div>
      </div>
    </div>
  );
};

export default Carousel;