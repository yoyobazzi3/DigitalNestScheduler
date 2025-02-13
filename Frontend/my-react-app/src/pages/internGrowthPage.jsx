import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InternGrowthPage = () => {
    const [growthData, setGrowthData] = useState(null);
    const [averageGrowth, setAverageGrowth] = useState(null);
    const { internId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the growth data from the backend
        fetch(`/internGrowth/${internId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setGrowthData(data.data);
                    
                    // Calculate overall average growth
                    const totalGrowth = data.data.reduce((sum, item) => sum + parseFloat(item.growthPercentage), 0);
                    const avgGrowth = (data.data.length > 0) ? (totalGrowth / data.data.length).toFixed(2) + "%" : "0%";
                    
                    setAverageGrowth(avgGrowth);
                }
            })
            .catch(error => console.error('Error fetching growth data:', error));
    }, [internId]);

    if (!growthData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
            <button onClick={() => navigate(`/editIntern/${internId}`)} style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
                Back
            </button>
            <h1>Intern Growth</h1>
            
            <h2>Individual Skill Growth</h2>
            {growthData.map((growth, index) => (
                <div key={index} style={{ border: "1px solid #ccc", padding: "15px", margin: "10px auto", width: "60%", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <p><strong>Tool ID:</strong> {growth.toolID}</p>
                    <p>
                        <strong>Progress:</strong> {growth.initialSkillLevel} 
                        <span style={{ padding: "0 10px", fontSize: "20px", fontWeight: "bold", color: "#007BFF" }}>→</span> 
                        {growth.growthPercentage} 
                        <span style={{ padding: "0 10px", fontSize: "20px", fontWeight: "bold", color: "#007BFF" }}>→</span> 
                        {growth.currentSkillLevel}
                    </p>
                </div>
            ))}

            <h2>Overall Growth</h2>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#28A745" }}>{averageGrowth}</p>
        </div>
    );
};

export default InternGrowthPage;