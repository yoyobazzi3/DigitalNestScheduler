import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList, LineChart, Line } from "recharts";
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
    const [monthlyGrowthData, setMonthlyGrowthData] = useState([]);
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
                console.log("Fetched Intern Data:", data);

                if (data) {
                    setInternName(`${data.firstName} ${data.lastName}`);
                } else {
                    console.error("Error: Intern data missing from API response.");
                }
            } catch (error) {
                console.error("Error fetching intern details:", error);
            }
        };

        // Fetch Skill Growth Data (Bar Graph)
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

        // Fetch Monthly Growth Data (Line Graph)
        const fetchMonthlyGrowthData = async () => {
            try {
                const response = await fetch(`http://localhost:3360/getMonthlyGrowth/${internID}`);
                const data = await response.json();
                console.log("Fetched Monthly Growth Data:", data);

                if (data.success) {
                    // Sort by year and month for correct display order
                    const sortedData = data.data.sort((a, b) => 
                        new Date(`${a.month} 1, ${a.year}`) - new Date(`${b.month} 1, ${b.year}`)
                    );
                    setMonthlyGrowthData(sortedData);
                } else {
                    console.error("Failed to fetch monthly growth data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching monthly growth:", error);
            }
        };

        fetchInternDetails();
        fetchGrowthData();
        fetchMonthlyGrowthData();
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
                {/* First Graph (Bar Chart - Skill Growth) */}
                <div className="chart-container">
                    <h2>Skill Growth</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis dataKey="toolName" angle={0} textAnchor="end" />
                            <YAxis label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="growthPercentage" fill="#8884d8" name="Growth %">
                                <LabelList dataKey="growthPercentage" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Second Graph (Line Chart - Monthly Growth Over Time) */}
                <div className="chart-container">
                    <h2>Monthly Growth Over Time</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={monthlyGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <XAxis dataKey="month" />
                            <YAxis label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="growthPercentage" stroke="#ff7300" name="Monthly Growth %" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default InternGrowthChart;