import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Carousel from '../components/Carousel/ImgCarousel.jsx';
import NewProject from '../components/NewProject/NewProject.jsx';
import './HomePage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showNewProject, setShowNewProject] = useState(false); // state to toggle components
  // const navigate = useNavigate();

  useEffect(() => {
    // Add/remove 'no-scroll' class to body based on menu state
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMenuOpen]);
  return (
    <div className="nav-container">
      <NavBar setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} />
    <div className="homepage-container">
      <header>
        <h1 className="homepage-title">BizzNest Flow</h1>
      </header>
      <div className="content-container">
        {/* Left Section */}
        <Projects />
        {/* Right Section */}
        <div className="right-section">
          <div className="dynamic-component">
          {/* Conditionally render components */}
          {showNewProject ? <NewProject /> : <Carousel />}
          </div>
          <button
              className="create-project-button"
              onClick={() => setShowNewProject(true)}>
              Create Project
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;