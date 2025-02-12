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
            alert('Project deleted successfully');
            navigate('/'); // Redirect to homepage
        } else {
            alert('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
    }
  };

  const calculateAverageDifficulty = () => {
    if (!project || !project.tools || project.tools.length === 0) {
      return null;
    }
    const total = project.tools.reduce((sum, tool) => sum + (tool.difficulty || 0), 0);
    return (total / project.tools.length).toFixed(1);
  };

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
        <div className="projectInfoWrapper">
        <div className='projectDisplayContainer'>
          <h1>{project.projectTitle}</h1>
          <div className="toolContainer">
            {project.tools.length > 0 ? (
              project.tools.map((tool, index) => (
                <div key={index}>
                  <h4 className='toolName'>{toolNames[tool.toolID] || `Tool ${tool.toolID}`}</h4>
                  <p className='toolBox'>{tool.difficulty !== null ? tool.difficulty.toFixed(1) : "N/A"}</p>
                </div>
              ))
            ) : (
              <p>No skills assigned to this project.</p>
            )}
          </div>
          <div className="toolAverageContainer">
          <h4>Average</h4>
          <p className='averageBox'>{calculateAverageDifficulty()}</p>
        </div>
        </div>
        <div className="projectDescriptionContainer">
          <h4>Project Description:</h4>
          <p className='projectDescritionDetails'>{project.projectDescription ? project.projectDescription : "No description available."}</p>
        </div>
        <div className="assignedWrapper">
          <div className="assignedInternContainer">
            <h2>Assigned Interns</h2>
            <div className="assignedInternNames">
              {project.assignedInterns && project.assignedInterns.length > 0 ? (
                project.assignedInterns.map((intern, index) => (
                  <div key={index} className="assignedIntern">
                    <p>{`${intern.firstName} ${intern.lastName}`}</p>
                    <p>{intern.role}</p>
                  </div>
                ))
              ) : (
                <p>No interns assigned to this project.</p>
              )}
            </div>
          </div>
          <div className="assignedLeaderContainer">
            <h2>Assigned Leaders</h2>
            <div className="assignedLeaderNames">
              
            </div>
          </div>
        </div>
        <div className="projectInfoButtonContainer">
          <button onClick={deleteProject} className="delete-project">
            Delete Project
          </button>
          <button className='completeProject'>
            Mark Complete
          </button>
          <button className='backToProjects' onClick={()=>navigate('/')}>
          Return to Projects
        </button>
        </div>
      </div>
    </div>
    
        </div>
        
  );
};

export default ProjectInfoPage;
