import React from 'react';
import './Filtering.css'
const Filtering = () => {
  return (
      <div className="filtering">

        {/* Dropdown for Department */}
        <div>
          <label htmlFor="department">Department</label>
          <select id="department" defaultValue="">
            <option value="" disabled>Select Department</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
            <option value="Video">Video</option>
          </select>
        </div>

        {/* Dropdown for Location */}
        <div>
          <label htmlFor="location">Location</label>
          <select id="location" defaultValue="">
            <option value="" disabled>Select Location</option>
            <option value="Salinas">Salinas</option>
            <option value="Watsonville">Watsonville</option>
            <option value="Gilroy">Gilroy</option>
            <option value="Stockton">Stockton</option>
            <option value="Modesto">Modesto</option>
          </select>
        </div>

        <button>Apply Filters</button>
      </div>
  );
};

export default Filtering;