import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const InternGrowthChart = ({ internID }) => {
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGrowthData = async () => {
            try {
                const response = await fetch(`http://localhost:3360/internGrowth/${internID}`);
                const result = await response.json();
                console.log("API Response:", result); // Debugging line
    
                if (result.success) {
                    const formattedData = result.data.map(item => ({
                        toolID: `Tool ${item.toolID}`,
                        growthPercentage: parseFloat(item.growthPercentage) // Ensure it's a number
                    }));
    
                    console.log("Formatted Data:", formattedData); // Debugging line
                    setGrowthData(formattedData);
                } else {
                    setError("Failed to fetch data");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error fetching intern growth data");
            } finally {
                setLoading(false);
            }
        };
    
        if (internID) {
            fetchGrowthData();
        }
    }, [internID]);

    if (loading) return <p>Loading growth data...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h2>Intern Growth Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
            <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="toolID" />
            <YAxis label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="growthPercentage" fill="#4CAF50" />
            </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default InternGrowthChart;       