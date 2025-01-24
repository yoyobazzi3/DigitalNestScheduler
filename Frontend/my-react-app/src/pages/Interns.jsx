import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import SearchBar from '../components/SearchBar/SearchBar';
import Filtering from '../components/Filtering/Filtering';
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
                setInterns(data);
                setFilteredInterns(data);
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

    const navigate = useNavigate();

    return (
        <div className="big-container">
            <NavBar/>
        <div className="container">

            <div className="content">
                <div className="filtering-wrapper">
                    <h3>Filter Interns</h3>
                    <div className="search-bar-wrapper">
                        <SearchBar onSearch={handleSearch}/>
                    </div>
                    <Filtering/>
                </div>

                <div className="interns-wrapper">
                    <h2>Interns:</h2> {/* Keep this outside the scrollable area */}
                    <div className="intern-container"> {/* New container for scrolling */}
                        <ul>
                            {filteredInterns.length > 0 ? (
                                filteredInterns.map((intern) => (
                                    <li key={intern.InternID}>
                                        <img src={profile} alt="profile" className="profile"/>
                                        <span className="name">
              {intern.firstName} {intern.lastName}
            </span>
                                        <div className="icon-container">
                                            <img
                                                src={edit}
                                                alt="edit"
                                                className="edit"
                                                onClick={() => navigate(`/editIntern/${intern.InternID}`)}
                                            />
                                            <img src={del} alt="delete" className="delete"/>
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
        </div>
        </div>
    );
};

export default Interns;