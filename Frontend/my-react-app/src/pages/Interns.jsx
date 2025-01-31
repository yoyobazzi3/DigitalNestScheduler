import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import SearchBar from '../components/SearchBar/SearchBar';
import Filtering from '../components/Filtering/Filtering';
import edit from '../assets/edit.svg';
import del from '../assets/delete.svg';
import profile from '../assets/profile.svg';
import './Interns.css';

const departmentMap = {
    0: "Web Development",
    1: "Design",
    2: "Video"
};

const Interns = () => {
    const [interns, setInterns] = useState([]);
    const [filteredInterns, setFilteredInterns] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(""); 
    const [selectedLocation, setSelectedLocation] = useState(""); 

    const filterInterns = useRef([]); // Holds the original intern list

    useEffect(() => {
        fetch('http://localhost:3360/getInterns')
            .then((response) => response.json())
            .then((data) => {
                filterInterns.current = data; // Store original list
                setInterns(data);
                setFilteredInterns(data);
            })
            .catch((error) => console.error('Error fetching interns:', error));
    }, []);

    

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase().trim();
        const results = filterInterns.current.filter((intern) => {
            const fullName = `${intern.firstName} ${intern.lastName}`.toLowerCase();
            return fullName.includes(lowerQuery);
        });
        setFilteredInterns(results);
    };

    const handleFilterApply = () => {
        const results = filterInterns.current.filter((intern) => {
            const matchesDepartment = selectedDepartment
                ? departmentMap[intern.departmentID] === selectedDepartment
                : true;
            const matchesLocation = selectedLocation
                ? intern.location === selectedLocation
                : true;

            return matchesDepartment && matchesLocation;
        });

        setFilteredInterns(results);
    };

    const handleDeleteInterns = async (internID) => {
        try {
            const response = await fetch(`http://localhost:3360/deleteIntern/${internID}`, {
                method: 'DELETE',
            });
    
            const data = await response.json();
            if (response.ok) {
                alert('Intern deleted successfully');
    
                // Update state by removing the deleted intern
                setFilteredInterns((prevInterns) =>
                    prevInterns.filter((intern) => intern.InternID !== internID)
                );
                
                // Also update the main intern list if needed
                setInterns((prevInterns) =>
                    prevInterns.filter((intern) => intern.InternID !== internID)
                );
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error deleting intern:', error);
            alert('Failed to delete intern');
        }
    };

    const navigate = useNavigate();

    return (
        <div className="big-container">
            <NavBar />
            <div className="container">
                <div className="content">
                    <div className="filtering-wrapper">
                        <h3>Filter Interns</h3>
                        <div className="search-bar-wrapper">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                        <Filtering
                            selectedDepartment={selectedDepartment}
                            setSelectedDepartment={setSelectedDepartment}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            onApplyFilters={handleFilterApply}
                        />
                    </div>

                    <div className="interns-wrapper">
                        <h2>Interns:</h2>
                        <div className="intern-container">
                            <ul>
                                {filteredInterns.length > 0 ? (
                                    filteredInterns.map((intern) => (
                                        <li key={intern.InternID}>
                                            <img src={profile} alt="profile" className="profile" />
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
                                                <img src={del} alt="delete" className="delete" onClick={() => handleDeleteInterns(intern.InternID)}/>
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