import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar/NavBar';
import SearchBar from '../components/SearchBar/SearchBar';

const Interns = () => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3360/getInterns') 
      .then((response) => response.json())
      .then((data) => {
        setInterns(data);  // Save the full list of interns
        setFilteredInterns(data);  // Initially show all interns
      })
      .catch((error) => console.error('Error fetching interns:', error));
  }, []);

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase().trim();

    const results = interns.filter((intern) => {
      const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
      return fullName.includes(lowerQuery);
    });

    setFilteredInterns(results);
  };
  
  
  

  return (
    <div>
      <NavBar />
      <SearchBar onSearch={handleSearch} />
      <h2>Test Interns: </h2>
      <ul>
        {filteredInterns.length > 0 ? (
          filteredInterns.map((intern) => (
            <li key={intern.InternID}>
              {intern.firstName} {intern.lastName}
            </li>
          ))
        ) : (
          <p>No interns found</p>
        )}
      </ul>
    </div>
  );
};

export default Interns;