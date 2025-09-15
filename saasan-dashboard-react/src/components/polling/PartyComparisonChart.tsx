import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface PartyComparisonChartProps {
  data: Array<{
    party_id: string;
    party_name: string;
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
  "#8DD1E1",
  "#D084D0",
];

export const PartyComparisonChart: React.FC<PartyComparisonChartProps> = ({
  data,
}) => {
  const chartData = data.map((party) => ({
    name:
      party.party_name.length > 15
        ? party.party_name.substring(0, 15) + "..."
        : party.party_name,
    fullName: party.party_name,
    pollsCreated: party.polls_created,
    totalVotes: party.total_votes_received,
    averageRating: party.average_rating,
  }));

  const pieData = data.map((party) => ({
    name: party.party_name,
    value: party.total_votes_received,
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
        No party data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart - Polls Created */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Polls Created by Parties
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

      {/* Pie Chart - Vote Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Vote Distribution by Party
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) =>
                `${entry.name}: ${entry.percentage.toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Performance Trend */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Average Rating Trend
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis domain={[0, 5]} />
            <Tooltip content={renderTooltip} />
            <Line
              type="monotone"
              dataKey="averageRating"
              stroke="#00C49F"
              strokeWidth={2}
              dot={{ fill: "#00C49F", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Party Performance Summary
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vote Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((party, index) => {
                const totalVotes = data.reduce(
                  (sum, p) => sum + p.total_votes_received,
                  0
                );
                const voteShare =
                  totalVotes > 0
                    ? ((party.total_votes_received / totalVotes) * 100).toFixed(
                        1
                      )
                    : 0;

                return (
                  <tr key={party.party_id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        {party.party_name}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {party.polls_created}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {party.total_votes_received.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {party.average_rating.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {voteShare}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
