import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Calendar,
  Phone,
  Mail,
  Globe,
  Share,
  Flag,
  Award,
  DollarSign,
  FileText,
  MessageCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePoliticians } from "@/hooks/usePoliticians";
import type { IPolitician } from "@/types/politics";
import Loading from "@/components/Loading";
import TabSelector from "@/components/common/TabSelector";

export default function PoliticianDetailScreen() {
  const { politicianId } = useParams();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "promises" | "achievements" | "contact"
  >("overview");
  const [politician, setPolitician] = useState<IPolitician | null>(null);

  const { loading, fetchPoliticianById } = usePoliticians();

  useEffect(() => {
    (async () => {
      if (politicianId) {
        const politician = await fetchPoliticianById(politicianId);
        setPolitician(politician);
      }
    })();
  }, [politicianId]);

  const getPartyColor = (party: string) => {
    const colors: { [key: string]: string } = {
      "CPN-UML": "bg-red-500",
      "Nepali Congress": "bg-green-500",
      RSP: "bg-purple-500",
      "CPN-MC": "bg-yellow-500",
    };
    return colors[party] || "bg-gray-500";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-green-600" size={20} />;
      case "down":
        return <TrendingDown className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-500";
      case "ongoing":
        return "bg-yellow-500";
      case "broken":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "policy":
        return <FileText className="text-blue-600" size={16} />;
      case "development":
        return <Award className="text-green-600" size={16} />;
      case "social":
        return <Users className="text-purple-600" size={16} />;
      case "economic":
        return <DollarSign className="text-yellow-600" size={16} />;
      default:
        return <Award className="text-gray-600" size={16} />;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white m-4 border-b border-gray-200">
        <div className="flex items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mr-4 p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {politician?.fullName}
            </h1>
            <p className="text-gray-600">
              {politician?.sourceCategories?.positions?.[0] || "Position"}
            </p>
          </div>
          <Button
            variant="ghost"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share className="text-gray-600" size={20} />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="m-4">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                  <Users className="text-gray-500" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {politician?.fullName}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {politician?.sourceCategories?.positions?.[0] || "Position"}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`px-3 py-1 rounded-full ${getPartyColor(
                        politician?.isIndependent
                          ? "Independent"
                          : politician?.sourceCategories?.party || "",
                      )}`}
                    >
                      <p className="text-white text-xs font-semibold">
                        {politician?.isIndependent
                          ? "Independent"
                          : politician?.sourceCategories?.party || ""}
                      </p>
                    </div>
                    {politician?.rating !== undefined && getTrendIcon("stable")}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="text-gray-500" size={14} />
                    <p className="text-gray-600 ml-1 text-sm">
                      {/* {politician?.constituency} */}
                      {/* Constituency info not available in current interface */}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating & Stats */}
              <div className="flex justify-around mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {politician?.rating || 0}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Rating</p>
                  <Star
                    className="text-yellow-500 mx-auto mt-1"
                    size={16}
                    fill="#EAB308"
                  />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {politician?.totalVotes
                      ? (politician.totalVotes / 1000).toFixed(0) + "K"
                      : "0"}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Votes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {politician?.promises && politician.promises.length > 0
                      ? Math.round(
                          (politician.promises.filter(
                            (p) => p.status === "fulfilled",
                          ).length /
                            politician.promises.length) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Promises</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <TabSelector
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            { label: "Overview", value: "overview" },
            { label: "Promises", value: "promises" },
            { label: "Achievements", value: "achievements" },
            { label: "Contact", value: "contact" },
          ]}
        />

        {/* Tab Content */}
        <div className="m-4">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Bio */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Biography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {politician?.biography || "No biography available"}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex">
                      <p className="font-semibold text-gray-900 w-24 text-sm">
                        Experience:
                      </p>
                      <p className="text-gray-700 flex-1 text-sm">
                        {politician?.experienceYears
                          ? politician.experienceYears + " years"
                          : "No experience information"}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold text-gray-900 w-24 text-sm">
                        Education:
                      </p>
                      <p className="text-gray-700 flex-1 text-sm">
                        {politician?.education || "No education information"}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="font-semibold text-gray-900 w-24 text-sm">
                        Joined:
                      </p>
                      <p className="text-gray-700 flex-1 text-sm">
                        {politician?.createdAt
                          ? new Date(politician.createdAt).toLocaleDateString()
                          : "No join date"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "promises" && (
            <div className="space-y-3">
              {politician?.promises?.map((promise) => (
                <Card key={promise.id} className="shadow-sm border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-bold text-gray-900 flex-1 mr-3">
                        {promise.title}
                      </h3>
                      <div
                        className={`px-2 py-1 rounded-full ${getStatusColor(
                          promise.status,
                        )}`}
                      >
                        <p className="text-white text-xs font-bold uppercase">
                          {promise.status}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {promise.description}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-600 text-xs">
                        Due: {new Date(promise.dueDate).toLocaleDateString()}
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        {promise.progress}%
                      </p>
                    </div>

                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          promise.status === "fulfilled"
                            ? "bg-green-500"
                            : promise.status === "ongoing"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${promise.progress}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-3">
              {politician?.achievements?.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="shadow-sm border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getCategoryIcon(achievement.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center">
                          <Calendar className="text-gray-500" size={14} />
                          <p className="text-gray-500 text-xs ml-1">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "contact" && (
            <div>
              <Card className="shadow-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {politician?.contact?.phone && (
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Phone className="text-blue-600 mr-3" size={18} />
                        <p className="text-gray-900 text-sm">
                          {politician.contact.phone}
                        </p>
                      </Button>
                    )}

                    {politician?.contact?.email && (
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Mail className="text-green-600 mr-3" size={18} />
                        <p className="text-gray-900 text-sm">
                          {politician.contact.email}
                        </p>
                      </Button>
                    )}

                    {politician?.contact?.website && (
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Globe className="text-purple-600 mr-3" size={18} />
                        <p className="text-gray-900 text-sm">
                          {politician.contact.website}
                        </p>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="m-4">
          <div className="flex gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors">
              <div className="flex items-center justify-center">
                <Star className="text-white mr-2" size={16} />
                <span className="text-white font-semibold text-sm">Rate</span>
              </div>
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors">
              <div className="flex items-center justify-center">
                <MessageCircle className="text-white mr-2" size={16} />
                <span className="text-white font-semibold text-sm">
                  Message
                </span>
              </div>
            </Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg transition-colors">
              <div className="flex items-center justify-center">
                <Flag className="text-white mr-2" size={16} />
                <span className="text-white font-semibold text-sm">Report</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
