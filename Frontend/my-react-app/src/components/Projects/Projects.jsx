import React, { useEffect, useState } from 'react';
const Projects  = () => {
  const [projects, setProjects] = useState([]); // State for holding projects
  
  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3360/getProjects');
        if (response.ok) {
          const data = await response.json();
          const animation = data.map((project) => ({
            ...project,
            animationDelay: `${Math.random() * 2}s`, // random delay between 0 and 2 seconds
          }));
          setProjects(animation);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="projects">
      {projects.map((projects) => (
        <div 
          key={projects.projectID}
          className="project-card"
          style={{ animationDelay: projects.animationDelay }} 
        >
          <h3>{projects.projectTitle}</h3>
          </div>
      ))}
    </div>
  );
};

export default Projects