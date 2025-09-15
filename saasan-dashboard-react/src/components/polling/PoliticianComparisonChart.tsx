import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface PoliticianComparisonChartProps {
  data: Array<{
    politician_id: string;
    politician_name: string;
    polls_created: number;
    total_votes_received: number;
    average_rating: number;
  }>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
];

export const PoliticianComparisonChart: React.FC<
  PoliticianComparisonChartProps
> = ({ data }) => {
  const chartData = data.map((politician) => ({
    name:
      politician.politician_name.length > 15
        ? politician.politician_name.substring(0, 15) + "..."
        : politician.politician_name,
    fullName: politician.politician_name,
    pollsCreated: politician.polls_created,
    totalVotes: politician.total_votes_received,
    averageRating: politician.average_rating,
  }));

  const radarData = data.map((politician) => ({
    politician:
      politician.politician_name.length > 10
        ? politician.politician_name.substring(0, 10) + "..."
        : politician.politician_name,
    polls: politician.polls_created,
    votes: Math.min(politician.total_votes_received / 100, 100), // Normalize for radar chart
    rating: politician.average_rating * 20, // Scale to 0-100
  }));

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-gray-600">
            Polls Created: {data.pollsCreated}
          </p>
          <p className="text-sm text-gray-600">
            Total Votes: {data.totalVotes}
          </p>
          <p className="text-sm text-gray-600">
            Avg Rating: {data.averageRating.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No politician data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart - Polls Created */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Polls Created by Politicians
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={renderTooltip} />
            <Bar dataKey="pollsCreated" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart - Total Votes */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Total Votes Received
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={renderTooltip} />
            <Bar dataKey="totalVotes" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart - Performance Overview */}
      {data.length <= 5 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Performance Overview
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="politician" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              {radarData.map((_, index) => (
                <Radar
                  key={index}
                  name={radarData[index].politician}
                  dataKey="polls"
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.3}
                />
              ))}
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Performance Summary
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Politician
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Polls Created
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Votes
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Rating
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((politician) => (
                <tr key={politician.politician_id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {politician.politician_name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {politician.polls_created}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {politician.total_votes_received.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {politician.average_rating.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
