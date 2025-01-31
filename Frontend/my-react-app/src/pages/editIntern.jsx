import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditInterns.css';

const skillLabels = {
  0: ["Frontend", "Backend", "Database"],
  1: ["Photoshop", "Illustrator", "Figma"],
  2: ["Premiere Pro", "Camera Work", "Lighting"],
};

const EditIntern = () => {
  const { internID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    departmentID: "",
    frontendSkill: 0,
    backendSkill: 0,
    databaseSkill: 0,
  });

  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await fetch(`http://localhost:3360/getIntern/${internID}`);
        if (response.ok) {
          const data = await response.json();
  
          // Map skills from the fetched data
          const skillsMap = data.skills.reduce((acc, skill) => {
            acc[skill.toolID] = skill.skillLevel || 0; // Default to 0 for missing values
            return acc;
          }, {});
  
          // Set the formData state with the fetched data
          setFormData({
            firstName: data.firstName,
            lastName: data.lastName,
            location: data.location,
            departmentID: data.departmentID,
            frontendSkill: skillsMap[0] || 0, 
            backendSkill: skillsMap[1] || 0, 
            databaseSkill: skillsMap[2] || 0,
          });
        } else {
          console.error("Failed to fetch intern data");
        }
      } catch (error) {
        console.error("Error fetching intern:", error);
      }
    };
  
    fetchInternData();
  }, [internID]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateAverage = () => {
    const total = formData.frontendSkill + formData.backendSkill + formData.databaseSkill;
    return (total / 3).toFixed(1); // Round to 1 decimal place
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3360/updateIntern/${internID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Intern updated successfully!");
        navigate("/interns");
      } else {
        alert("Failed to update intern");
      }
    } catch (error) {
      console.error("Error updating intern:", error);
      alert("Error updating intern.");
    }
  };

  // Get the skill labels for the current department
  const departmentSkills = skillLabels[formData.departmentID] || ["Skill 1", "Skill 2", "Skill 3"];

  return (
    <div className="editInternContainer">
        <div className="formwrappaer">
            <h2>Edit Intern</h2>
            <form onSubmit={handleSubmit} className="editInternForm">
                <div className="updateNameContainer">
                    <label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    </label>
                    <label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    </label>
                </div>
                <div className="updateLocationDepartmentContainer">
                    <label>
                    <select name="location" value={formData.location} onChange={handleChange}>
                        <option value="">Select a location</option>
                        <option value="Salinas">Salinas</option>
                        <option value="Gilroy">Gilroy</option>
                        <option value="Watsonville">Watsonville</option>
                        <option value="Stockton">Stockton</option>
                        <option value="Modesto">Modesto</option>
                    </select>
                    </label>
                    <label>
                    <select
                        name="departmentID"
                        value={formData.departmentID}
                        onChange={handleChange}
                    >
                        <option value="">Select a department</option>
                        <option value="0">Web Development</option>
                        <option value="1">Design</option>
                        <option value="2">Video</option>
                    </select>
                    </label>
                </div>
                <div className="updateSkillLevelContainer">
                    <h3>Skill Levels</h3>
                    <div className="updateSkillWrapper">
                        <div className="updateFirstSkill">
                            <label>
                            {departmentSkills[0]} Skill:
                            <input
                                type="number"
                                name="frontendSkill"
                                value={formData.frontendSkill}
                                onChange={handleChange}
                            />
                            </label>
                        </div>
                        <div className="updateSecondSkill">
                            <label>
                            {departmentSkills[1]} Skill:
                            <input
                                type="number"
                                name="backendSkill"
                                value={formData.backendSkill}
                                onChange={handleChange}
                            />
                            </label>
                        </div>
                        <div className="updateThirdSkill">
                            <label>
                            {departmentSkills[2]} Skill:
                            <input
                                type="number"
                                name="databaseSkill"
                                value={formData.databaseSkill}
                                onChange={handleChange}
                            />
                            </label>
                        </div>
                        <div className="overallScoreContainer">
                            <p>Overall Score</p>
                            <div className="overallScoreBox">
                                {calculateAverage()}
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="buttonsContainer">
                    <button type="submit">Update</button>
                    <button type="cancel" onClick={() => navigate('/interns')}>Cancel</button>
                </div>
                
            </form>
        </div>
      
    </div>
  );
};

export default EditIntern;
