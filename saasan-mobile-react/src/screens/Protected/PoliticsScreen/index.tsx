import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, DollarSign } from "lucide-react";

const politicsPages = [
  {
    name: "Politicians",
    description: "View and manage politician profiles",
    path: "/politicians",
    icon: Users,
    color: "text-blue-600",
  },
  {
    name: "Political Parties",
    description: "Browse and analyze political parties",
    path: "/parties",
    icon: FileText,
    color: "text-green-600",
  },
  {
    name: "Budget Analysis",
    description: "View and manage budget analysis",
    path: "/budget",
    icon: DollarSign,
    color: "text-purple-600",
  },
];

export default function PoliticsScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Politics</h1>
        <p className="text-gray-600">
          Manage political information and analysis
        </p>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-2 gap-4">
        {politicsPages.map(({ name, description, path, icon: Icon, color }) => (
          <Card
            className="cursor-pointer transition-all hover:shadow-md p-4"
            onClick={() => navigate(`/politics${path}`)}
          >
            <CardContent className="p-0 text-center">
              <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
