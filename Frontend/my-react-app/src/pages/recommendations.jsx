import React from 'react';
import { useEffect, useState } from 'react';
import NavBar from '../components/Navbar/NavBar.jsx';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get('projectID');
    const departmentID = queryParams.get('departmentID');

    console.log('Query Parameters:', { projectID, departmentID }); // Debug log

    if (!projectID || !departmentID) {
      setError('Missing projectID or departmentID in the URL');
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3360/recommendations?projectID=${projectID}&departmentID=${departmentID}`
        );
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          setError(result.message || 'Error fetching recommendations');
        }
      } catch (err) {
        setError('Failed to fetch recommendations');
      }
    };

    fetchRecommendations();
  }, [location.search]); // Updated dependency array

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading recommendations...</p>;

  return (
    <div className="recommendations-container">
      <NavBar />
      <div className="project-stats">project Stats</div>
      <div className="row-1">row 1</div>
      <div className="row-2">row 2</div>
      <div className="row-3">row 3</div>
    </div>
  );
};

export default Recommendations;