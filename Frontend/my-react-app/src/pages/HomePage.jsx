import React, { useEffect } from 'react';
import NavBar from '../components/Navbar/NavBar.jsx';
import './HomePage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
        <div className="projects">
          <div className="project-card1">
            <h3>UCSC</h3>
          </div>
          <div className="project-card2">
            <h3>DN-Site</h3>
          </div>
          <div className="project-card3">
            <h3>TedX</h3>
          </div>
          <div className="project-card4">
            <h3>Fruition</h3>
          </div>
          <div className="project-card5">
            <h3>Martinelli's</h3>
          </div>
          <div className="project-card6">
            <h3>Cabrillo College</h3>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="image-carousel">
            <p>[IMG Carousel]</p>
          </div>
          <button className="create-project-button">Create Project</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomePage;