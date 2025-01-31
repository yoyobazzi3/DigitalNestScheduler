import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      const departmentSkills = skillLabels[formData.departmentID];
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

  // Get the skill labels for the current department
  const departmentSkills = skillLabels[formData.departmentID] || [];

  return (
    <div className="edit-intern-container">
      <h2>Edit Intern</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </label>
        <label>
          Location:
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
          Department:
          <select name="departmentID" value={formData.departmentID} onChange={handleChange}>
            <option value="">Select a department</option>
            <option value="0">Web Development</option>
            <option value="1">Design</option>
            <option value="2">Film</option>
          </select>
        </label>
        <h3>Skill Levels</h3>
        {departmentSkills.map((label, index) => {
          const toolID = Object.keys(skillLabels).find(
            (key) => skillLabels[key].includes(label)
          ) * 3 + index; // Derive toolID dynamically
          return (
            <label key={toolID}>
              {label} Skill:
              <input
                type="number"
                name={`skill_${toolID}`}
                value={formData.skills[toolID] || 0}
                onChange={handleChange}
              />
            </label>
          );
        })}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditIntern;
