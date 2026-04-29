import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Search, DollarSign, TrendingUp, Calendar, X } from "lucide-react";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { Input } from "@/components/ui/input";
import { ScrollHideHeaderLayout } from "@/components/ui/scroll-hide-header-layout";
import { apiService } from "@/services/api";

export default function BudgetScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => apiService.getBudgets(),
    staleTime: 2 * 60 * 1000,
  });

  const budgetItems = data?.data || [];

  const filteredBudgetItems = useMemo(
    () =>
      budgetItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [budgetItems, searchQuery],
  );

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B NPR`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M NPR`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K NPR`;
    }
    return `${amount} NPR`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        error={error instanceof Error ? error.message : "Failed to load budget"}
        refresh={() => refetch()}
      />
    );
  }

  return (
    <ScrollHideHeaderLayout
      title="Budget Overview"
      showBackButton={true}
      subHeader={
        <>
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search budget items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              {searchQuery && (
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  size={20}
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
          </div>

          <div className="bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <DollarSign size={20} />
                  <span className="text-lg font-bold">
                    {formatAmount(
                      budgetItems.reduce((sum, item) => sum + item.amount, 0),
                    )}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total Budget</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <TrendingUp size={20} />
                  <span className="text-lg font-bold">{budgetItems.length}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Budget Items</p>
              </div>
            </div>
          </div>
        </>
      }
    >
      <div className="p-4">
        {filteredBudgetItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <DollarSign className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-center">
              {searchQuery
                ? "No budget items found matching your search."
                : "No budget data available."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBudgetItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">{item.department}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatAmount(item.amount)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>Fiscal Year {item.year}</span>
                    </div>
                    {item.category && (
                      <span className="uppercase tracking-wide text-gray-500">
                        {item.category.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollHideHeaderLayout>
  );
}
