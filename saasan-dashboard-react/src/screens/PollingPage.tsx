import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { usePolling } from "../hooks/usePolling";
import type {
  Poll,
  CreatePollData,
  UpdatePollData,
} from "../../../shared/types/polling";
import {
  BarChart3,
  Plus,
  Search,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Eye,
  Trash2,
  Vote,
} from "lucide-react";
import { PollAnalyticsChart } from "../components/polling/PollAnalyticsChart";
import { PoliticianComparisonChart } from "../components/polling/PoliticianComparisonChart";
import { PartyComparisonChart } from "../components/polling/PartyComparisonChart";
import { PollModal } from "../components/polling/PollModal";
import { PollDetailsModal } from "../components/polling/PollDetailsModal";

const PollingPage: React.FC = () => {
  const {
    loading,
    error,
    polls,
    analytics,
    categories,
    statuses,
    types,
    loadPolls,
    loadAnalytics,
    loadCategories,
    loadStatuses,
    loadTypes,
    createPoll,
    updatePoll,
    deletePoll,
    createCategory,
    createType,
  } = usePolling();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadPolls();
    loadAnalytics();
    loadCategories();
    loadStatuses();
    loadTypes();
  }, [loadPolls, loadAnalytics, loadCategories, loadStatuses, loadTypes]);

  const filteredPolls = polls.filter((poll) => {
    const matchesSearch =
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || poll.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || poll.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreatePoll = async (data: CreatePollData | UpdatePollData) => {
    try {
      await createPoll(data as CreatePollData);
      setShowPollModal(false);
      setIsEditMode(false);
      await loadPolls();
    } catch (error) {
      console.error("Failed to create poll:", error);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      try {
        await deletePoll(pollId);
      } catch (error) {
        console.error("Failed to delete poll:", error);
      }
    }
  };

  const handleViewDetails = (poll: Poll) => {
    setSelectedPoll(poll);
    setShowDetailsModal(true);
  };

  const handleEditPoll = (poll: Poll) => {
    setSelectedPoll(poll);
    setShowDetailsModal(false);
    setIsEditMode(true);
    setShowPollModal(true);
  };

  const handleBackToView = () => {
    setShowPollModal(false);
    setIsEditMode(false);
    setShowDetailsModal(true);
  };

  const handleUpdatePoll = async (data: UpdatePollData) => {
    if (!selectedPoll) return;
    try {
      await updatePoll(selectedPoll.id, data);
      setShowPollModal(false);
      setIsEditMode(false);
      setShowDetailsModal(true); // Go back to view mode after update
      // Force refresh the polls list
      await loadPolls();
    } catch (error) {
      console.error("Failed to update poll:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    return status;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => loadPolls()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Polling & Surveys
          </h1>
          <p className="text-gray-600">
            Manage polls, analyze results, and track political engagement
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPoll(null);
            setIsEditMode(false);
            setShowPollModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Poll
        </Button>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Polls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total_polls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Polls
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.active_polls}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Votes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.total_votes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Vote className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Participation Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.participation_rate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="polls" className="space-y-6">
        <TabsList>
          <TabsTrigger value="polls">All Polls</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="comparisons">Comparisons</TabsTrigger>
        </TabsList>

        {/* Polls Tab */}
        <TabsContent value="polls" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search polls..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as string | "all")
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem
                      value="all"
                      className="bg-white hover:bg-gray-50"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="bg-white hover:bg-gray-50"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="bg-white hover:bg-gray-50"
                    >
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    <SelectItem
                      value="all"
                      className="bg-white hover:bg-gray-50"
                    >
                      All Categories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="bg-white hover:bg-gray-50"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Polls List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center h-32">
                <div className="text-gray-600">Loading polls...</div>
              </div>
            ) : filteredPolls.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-32">
                <div className="text-gray-600">No polls found</div>
              </div>
            ) : (
              filteredPolls.map((poll) => (
                <Card
                  key={poll.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(poll)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">
                        {poll.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            poll.status,
                          )}`}
                        >
                          {getStatusText(poll.status)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePoll(poll.id);
                          }}
                          className="text-red-600 hover:text-red-700 p-1 h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {poll.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Ends: {new Date(poll.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{poll.total_votes} votes</span>
                    </div>
                    {poll.district && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {poll.district}
                          {poll.municipality ? `, ${poll.municipality}` : ""}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(poll);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <div className="text-xs text-gray-500">
                        Click anywhere to view details
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <PollAnalyticsChart
                    data={analytics.category_breakdown}
                    type="category"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>District Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PollAnalyticsChart
                    data={analytics.district_breakdown}
                    type="district"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Comparisons Tab */}
        <TabsContent value="comparisons" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Politician Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <PoliticianComparisonChart
                  data={analytics?.politician_performance || []}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Party Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <PartyComparisonChart
                  data={analytics?.party_performance || []}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PollModal
        isOpen={showPollModal}
        onClose={() => {
          setShowPollModal(false);
          setIsEditMode(false);
        }}
        onSubmit={isEditMode ? handleUpdatePoll : handleCreatePoll}
        poll={isEditMode ? selectedPoll : undefined}
        categories={categories}
        statuses={statuses}
        types={types}
        createCategory={createCategory}
        createType={createType}
        onBackToView={isEditMode ? handleBackToView : undefined}
      />

      {selectedPoll && (
        <PollDetailsModal
          poll={selectedPoll}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEditPoll}
        />
      )}
    </div>
  );
};

export default PollingPage;
