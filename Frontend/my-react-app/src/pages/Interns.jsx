import React, { useState, useEffect } from 'react';
import NavBar from '../components/Navbar/NavBar';
import SearchBar from '../components/SearchBar/SearchBar';
import edit from '../assets/edit.svg';
import del from '../assets/delete.svg';
import profile from '../assets/profile.svg';
import './Interns.css';
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
    <div className="container">
      <NavBar />
      <div className="content">
        <div className="search-bar-wrapper">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="interns-wrapper">
          <h2>Interns:</h2>
          <ul>
            {filteredInterns.length > 0 ? (
              filteredInterns.map((intern) => (
                <li key={intern.InternID}>
                <img src={profile} alt="profile" className="profile" />
                <span className="name">
                  {intern.firstName} {intern.lastName}
                </span>
                <div className="icon-container">
                  <img src={edit} alt="edit" className="edit" />
                  <img src={del} alt="delete" className="delete" />
                </div>
              </li>
              
              ))
            ) : (
              <p>No interns found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
  };
  
  export default Interns;
  
