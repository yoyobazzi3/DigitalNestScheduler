// src/components/NewProject/NewProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';

const NewProject = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectInfo, setProjectInfo] = useState('');
  const [department, setDepartment] = useState('');
  const [skillInput, setSkillInput] = useState({ frontend: '', backend: '', wordpress: '' });
  const [statusMessage, setStatusMessage] = useState(''); // for displaying success or error messages

  // handlers for form fields
  const handleProjectTitleChange = (event) => setProjectTitle(event.target.value);
  const handleProjectInfoChange = (event) => setProjectInfo(event.target.value);
  const handleDepartmentChange = (event) => setDepartment(event.target.value);

const handleSkillInputChange = (key, value) => {
    setSkillInput((prevInputs) => ({
        ...prevInputs,
        [key]: value,
    }));
};

  //check if all previous fields are filled before displaying skill input
  const areFieldsFilled = projectTitle && projectInfo && department;
  
  const navigate = useNavigate();
  // const handleClick = (event) => {
  //   event.preventDefault();
  //   navigate("/recommendations");
  // }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const projectData = {
      projectTitle,
      projectDescription: projectInfo,
      departmentID: department,
      skills: skillInput,
    };

    try {
      const response = await fetch('http://localhost:3360/newProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage('Project added successfully!');
        console.log('Server Response: ', result);
        navigate('recommendations');
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding project: ', error);
      setStatusMessage('An Error occured while adding project');
    }
  };

  return (
    <div className="new-project-container">
      <form onSubmit={handleSubmit}>
        {/* Add fields for project details */}
        <input 
            type="text" 
            placeholder="Project Title" 
            value={projectTitle}
            onChange={handleProjectTitleChange}
        />

        <input 
            type="text" 
            placeholder="Project Info" 
            value={projectInfo}
            onChange={handleProjectInfoChange}
        />

        {/* Dropdown menu here */}
        <select 
            name="department" 
            className="department-dropdown"
            value={department}
            onChange={handleDepartmentChange}
        >
          <option value="" disabled selected>
            Department
          </option>
          <option value="Web Development">Web Development</option>
          <option value="Design">Design</option>
          <option value="Film">Film</option>
        </select>

        {/* Conditionally render skill input if all fields are filled */}
        {areFieldsFilled && (
          <div className="skill-input-container">

            {/* Input sections */}
            <div>
              <h4>Frontend</h4>
              <input
                  type="number"
                  placeholder="OVR"
                  step="any" //allows floating point numbers
                  value={skillInput.frontend || ''} 
                  onChange={(e) => handleSkillInputChange('frontend', e.target.value)}
                  min="0"
                  max="3"
              />
              </div>
              <div>
              <h4>Backend</h4>
              <input
                  type="number"
                  placeholder="OVR"
                  step="any" //allows floating point numbers
                  value={skillInput.backend || ''}
                  onChange={(e) => handleSkillInputChange('backend', e.target.value)}
                  min="0"
                  max="3"
              />
              </div>
              <div>
              <h4>Wordpress</h4>
              <input
                  type="number"
                  placeholder="OVR"
                  step="any" //allows floating point numbers
                  value={skillInput.wordpress || ''}
                  onChange={(e) => handleSkillInputChange('wordpress', e.target.value)}
                  min="0"
                  max="3"
              />
              </div>
          </div>
        )}
       <div className="submit-btn-div">
        <button /* onClick={handleClick}*/ type="submit" className="submit-btn">Submit</button>
        </div>
        {/* Display success or error messages */}
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </div>
  );
};

export default NewProject;