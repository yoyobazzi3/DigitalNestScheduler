import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import './Recommendations.css'; // Add a CSS file for styling

const Recommendations = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get('projectID');
    const departmentID = queryParams.get('departmentID');

    console.log('Query Parameters:', { projectID, departmentID });

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
  }, [location.search]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading recommendations...</p>;

  // Calculate average difficulty
  const calculateAverageDifficulty = () => {
    if (data.projects[0]?.tools?.length) {
      const total = data.projects[0].tools.reduce((sum, tool) => sum + tool.difficulty, 0);
      return (total / data.projects[0].tools.length).toFixed(1);
    }
    return 0;
  };

  const averageDifficulty = calculateAverageDifficulty();

  return (
    <div className="recommendations-container">
      <NavBar />
      
      <div className="project-stats">
        <div className="project-title">
          <div className="title-box">{data.projects[0]?.projectTitle || 'N/A'}</div>
        </div>
        <div className="difficulty">
          {data.projects[0]?.tools?.map((tool, index) => (
            <div key={index} className="tool-box">
                {/* h4 should render actual tool name */}
              <h4>{`Tool ${tool.toolID}`}</h4>
              <div className="tool-boxes">{tool.difficulty}</div>
            </div>
          ))}
        </div>
        <div className="average-difficulty">
          <h4>Average</h4>
          <div className="avg-box">{averageDifficulty}</div>
        </div>
      </div>

    <div className="suggestions-container">
      {/* <div className="row-1">row 1</div>
      <div className="row-2">row 2</div>
      <div className="row-3">row 3</div> */}
      </div>
    </div>
  );
};

export default Recommendations;