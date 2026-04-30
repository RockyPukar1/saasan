import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText } from "lucide-react";

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
];

export default function PoliticsScreen() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f6f8fc] px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 lg:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
            Explore Politics
          </p>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
            Politics
          </h1>
          <p className="text-gray-600">
            Explore political information, compare leaders, and understand
            public institutions in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:max-w-2xl">
          {politicsPages.map(
            ({ name, description, path, icon: Icon, color }) => (
              <Card
                key={name}
                className="min-h-40 cursor-pointer border-0 p-1 shadow-sm ring-1 ring-slate-200/70 transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => navigate(`/politics${path}`)}
              >
                <CardContent className="p-4 text-left sm:p-6">
                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 sm:h-12 sm:w-12 ${color}`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold leading-snug text-gray-900 sm:text-lg">
                    {name}
                  </h3>
                  <p className="text-xs leading-5 text-gray-600 sm:text-sm sm:leading-6">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
