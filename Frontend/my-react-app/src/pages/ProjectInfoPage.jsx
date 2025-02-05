import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectInfoPage.css';
import NavBar from '../components/Navbar/NavBar';

const ProjectInfoPage = () => {
  const { projectID } = useParams(); // Extract projectID from the URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3360/getProject/${projectID}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Failed to fetch project data');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };
    fetchProject();
  }, [projectID]);

  const deleteProject = async () => {
    try {
        const response = await fetch(`http://localhost:3360/deleteProject/${projectID}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Project deleted succesfully');
            navigate('/'); // Redirect to homepage
        } else {
            alert('Failed to delete project')
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
    }
  }

  if (!project) {
    return <p>Loading project details...</p>;
  }

  const toolNames = {
    0: "Frontend",
    1: "Backend",
    2: "Wordpress",
    3: "Photoshop",
    4: "Illustrator",
    5: "Figma",
    6: "Premiere Pro",
    7: "Camera Work"
  };

  return (
    <div className="containerDisplayCompleteInfo">
      <NavBar />
      <div className="project-info">
      <div className='projectDisplayContainer'>
        <h1>{project.projectTitle}</h1>
        {project.tools.length > 0 ? (
          project.tools.map((tool, index) => (
            <div key={index} className='projectToolInfoContainer'>
              <h4 className='toolName'>{toolNames[tool.toolID]}</h4>
               <p className='toolBox'>{tool.difficulty.toFixed(1)}</p>
            </div>
          ))
        ) : (
          <p>No skills assigned to this project.</p>
        )}
      </div>
      <p>{project.projectDescription}</p>

      <button onClick={deleteProject} className="delete-project">
        Delete Project
      </button>
    </div>
    </div>
    
  );
};

export default ProjectInfoPage;