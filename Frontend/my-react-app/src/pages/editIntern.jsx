import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditInterns.css';

const skillLabels = {
  0: ["Frontend", "Backend", "Wordpress"],
  1: ["Photoshop", "Illustrator", "Figma"],
  2: ["Premiere Pro", "Camera Work"],
};

const EditIntern = () => {
  const { internID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    departmentID: "",
    skills: {}, // skills are dynamically rendered based on department
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
            skills: skillsMap,
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
    if (name.startsWith("skill_")) {
      const toolID = name.split("_")[1];
      setFormData({
        ...formData,
        skills: { ...formData.skills, [toolID]: Number(value) },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Organize skills by category
      //const departmentSkills = skillLabels[formData.departmentID];
      const webDevSkills = {};
      const designSkills = {};
      const filmSkills = {};

      Object.entries(formData.skills).forEach(([toolID, skillLevel]) => {
        const id = Number(toolID);
        if (id >= 0 && id <= 2) webDevSkills[id] = skillLevel;
        else if (id >= 3 && id <= 5) designSkills[id] = skillLevel;
        else if (id >= 6 && id <= 7) filmSkills[id] = skillLevel;
      });

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        location: formData.location,
        departmentID: formData.departmentID,
        webDevSkills,
        designSkills,
        filmSkills,
      };

      const response = await fetch(`http://localhost:3360/updateIntern/${internID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

  const calculateAverageSkill = () => {
    const skillValues = Object.values(formData.skills);
    if (skillValues.length === 0) return 0;
  
    const total = skillValues.reduce((acc, skill) => acc + skill, 0);
    return Math.round((total / skillValues.length) * 10) / 10;
  };

  // Get the skill labels for the current department
  const departmentSkills = skillLabels[formData.departmentID] || [];

  return (
    <div className="editInternContainer">
      <div className="formWrapper">
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
              <select name="departmentID" value={formData.departmentID} onChange={handleChange}>
                <option value="">Select a department</option>
                <option value="0">Web Development</option>
                <option value="1">Design</option>
                <option value="2">Film</option>
              </select>
            </label>
          </div>
          <div className="updateSkillLevelContainer">
            <h3>Skill Levels</h3>
            <div className="departmentSkillLevelsContainer">
              {departmentSkills.map((label, index) => {
                const toolID = Object.keys(skillLabels).find(
                  (key) => skillLabels[key].includes(label)
                ) * 3 + index; // Derive toolID dynamically
                return (
                  <label key={toolID} className="skillItem">
                        {label} Skill:
                        <input
                          type="number"
                          name={`skill_${toolID}`}
                          value={formData.skills[toolID] ? formData.skills[toolID].toFixed(1) : 0}
                          onChange={handleChange}
                        />
                  </label>
                );
              })}
              <div className="averageSkillBlock">
                Overall: 
                <div className="averageValue">{calculateAverageSkill()}</div>
              </div>
            </div>    
          </div>
          <div className="buttonsContainer">
              <button type="submit">Update</button>
              <button type="cancel" onClick={() => navigate('/interns')}>Back</button>
          </div>
        </form>
      </div>
      
    </div>
  );
};

export default EditIntern;
