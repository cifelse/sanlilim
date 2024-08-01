import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Earthquake {
  datetime: number;  // Changed from string to number
  magnitude: number;
  location: string;  // Added location
}

interface TrendChartProps {
  earthquakes: Earthquake[];
}

const TrendChart: React.FC<TrendChartProps> = ({ earthquakes }) => {
    const chartData = earthquakes
      .slice()
      .reverse()
      .map(eq => ({
        datetime: new Date(eq.datetime).toLocaleDateString(),
        magnitude: eq.magnitude,
        location: eq.location
      }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="datetime" 
            angle={-45}
            textAnchor="end"
            height={70}
            interval={0}
            tick={{fontSize: 10}}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="magnitude" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded">
        <p className="label">{`Date: ${label}`}</p>
        <p className="intro">{`Magnitude: ${payload[0].value}`}</p>
        <p className="desc">{`Location: ${payload[0].payload.location}`}</p>
      </div>
    );
  }

  return null;
};

export default TrendChart;