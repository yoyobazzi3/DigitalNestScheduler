import React, { useEffect, useState } from 'react';

const CompletedProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3360/getCompletedProjects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.error('Failed to fetch projects');
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Completed Projects</h1>
            {projects.map((project) => (
                <div key={project.projectID}>
                    <h2>{project.projectTitle}</h2>
                    <p>{project.projectDescription}</p>
                </div>
            ))}
        </div>
    );
}
export default CompletedProjects;