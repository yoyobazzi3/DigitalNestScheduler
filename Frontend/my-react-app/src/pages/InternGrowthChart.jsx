import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import "./InternGrowthChart.css"; // Import CSS for styling

// Mapping toolID to tool names
const toolMap = {
    0: "Frontend",
    1: "Backend",
    2: "Wordpress",
    3: "Photoshop",
    4: "Illustrator",
    5: "Figma",
    6: "Premiere Pro",
    7: "Camera Work"
};

const InternGrowthChart = () => {
    const { internID } = useParams();
    const [growthData, setGrowthData] = useState([]);
    const [internName, setInternName] = useState("");

    useEffect(() => {
        if (!internID) {
            console.warn("No internID provided, skipping API call.");
            return;
        }

        console.log(`Fetching data for internID: ${internID}`);

        // Fetch Intern Details (Name)
        const fetchInternDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3360/getIntern/${internID}`);
                if (!response.ok) {
                    console.error("Failed to fetch intern data");
                    return;
                }

                const data = await response.json();
                console.log("Fetched Intern Data:", data); // Debugging log

                if (data) {
                    setInternName(`${data.firstName} ${data.lastName}`);
                } else {
                    console.error("Error: Intern data missing from API response.");
                }
            } catch (error) {
                console.error("Error fetching intern details:", error);
            }
        };

        // Fetch Growth Data
        const fetchGrowthData = async () => {
            try {
                const response = await fetch(`http://localhost:3360/internGrowth/${internID}`);
                const data = await response.json();
                console.log("Fetched Growth Data:", data);

                if (data.success) {
                    const formattedData = data.data.map(item => ({
                        ...item,
                        toolName: toolMap[item.toolID] || `Tool ${item.toolID}`
                    }));
                    setGrowthData(formattedData);
                } else {
                    console.error("Failed to fetch growth data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching intern growth:", error);
            }
        };

        fetchInternDetails();
        fetchGrowthData();
    }, [internID]);

    if (!internID) {
        return <p>Loading intern growth data...</p>;
    }

    return (
        <div className="intern-growth-container">
            <h1 className="intern-growth-title">
                {internName ? `${internName}'s Growth` : "Intern Growth"}
            </h1>

            <div className="charts-wrapper">
                {/* First Graph (Skill Growth) */}
                <div className="chart-container">
                    <h2>Skill Growth</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis dataKey="toolName" angle={-30} textAnchor="end" />
                            <YAxis label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="growthPercentage" fill="#8884d8" name="Growth %">
                                <LabelList dataKey="growthPercentage" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Second Graph (Current Skill Levels) */}
                <div className="chart-container">
                    <h2>Current Skill Levels</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis dataKey="toolName" angle={-30} textAnchor="end" />
                            <YAxis label={{ value: "Skill Level", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="currentSkillLevel" fill="#82ca9d" name="Current Skill Level">
                                <LabelList dataKey="currentSkillLevel" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default InternGrowthChart;
