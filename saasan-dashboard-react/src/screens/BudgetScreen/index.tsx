import { useQuery } from "@tanstack/react-query";
import { Landmark, Wallet } from "lucide-react";
import { budgetApi } from "@/services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BudgetScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => budgetApi.getAll(),
  });

  const budgets = data?.data || [];
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
        <p className="text-gray-600">
          Review seeded budget lines and their latest approval status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4" />
              Total Budget Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Landmark className="h-4 w-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              NPR {totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latest Year</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {budgets[0]?.year || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Register</CardTitle>
          <CardDescription>
            Sorted by fiscal year and amount from the backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : budgets.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No budget records available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => (
                    <tr key={budget.id || budget._id} className="border-b">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {budget.title}
                          </p>
                          {budget.description && (
                            <p className="text-sm text-gray-500">
                              {budget.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {budget.department}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {budget.year}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-700">
                          {budget.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        NPR {budget.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
