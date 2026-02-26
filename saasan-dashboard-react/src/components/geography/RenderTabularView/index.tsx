import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IRenderTabularView {
  data: any[];
  columns: { key: string; label: string }[];
  detailsPage: string;
}

export default function RenderTabularView({
  data,
  columns,
  detailsPage,
}: IRenderTabularView) {
  const navigate = useNavigate();
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 flex justify-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-900"
                  >
                    {column.key.split(".").reduce((obj, k) => obj?.[k], item) ||
                      "-"}
                  </td>
                ))}
                <td className="px-4 py-3 text-sm flex justify-end">
                  <div className={item.id}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${detailsPage}/${item.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
