import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectInfoPage.css';

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

  return (
    <div className="project-info">
      <h1>{project.projectTitle}</h1>
      <p>{project.projectDescription}</p>
      <button onClick={deleteProject} className="delete-project">
        Delete Project
      </button>
    </div>
  );
};

export default ProjectInfoPage;