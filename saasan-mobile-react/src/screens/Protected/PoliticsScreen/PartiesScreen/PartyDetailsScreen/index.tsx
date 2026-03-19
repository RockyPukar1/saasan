import { useState, useEffect } from "react";
import { useParams, useNavigate, } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Globe,
  DollarSign,
  X,
} from "lucide-react";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import TabSelector from "@/components/common/TabSelector";
import type { IParty } from "@/types/politics";
import type { IPolitician } from "@/types/politics";
import { useParties } from "@/hooks/useParties";
import { usePoliticians } from "@/hooks/usePoliticians";

const partyTabs = [
  { label: "Overview", value: "overview" },
  { label: "Politicians", value: "politicians" },
  { label: "Budget", value: "budget" },
  { label: "History", value: "history" },
];

export default function PartyDetailsScreen() {
  const { partyId } = useParams<{ partyId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(partyTabs[0].value);

  const { parties, loading, error, refresh } = useParties();
  const { fetchPoliticiansByParty } = usePoliticians();
  const [partyPoliticians, setPartyPoliticians] = useState<IPolitician[]>([]);
  const [politiciansLoading, setPoliticiansLoading] = useState(true);
  const [politiciansError, setPoliticiansError] = useState<string | null>(null);
  const party = parties?.find((p: IParty) => p.id === partyId);

  useEffect(() => {
    const loadPoliticians = async () => {
      if (partyId) {
        try {
          setPoliticiansLoading(true);
          setPoliticiansError(null);
          const politicians = await fetchPoliticiansByParty(partyId);
          setPartyPoliticians(politicians);
        } catch (err) {
          setPoliticiansError("Failed to fetch politicians");
        } finally {
          setPoliticiansLoading(false);
        }
      }
    };

    loadPoliticians();
  }, [partyId, fetchPoliticiansByParty]);

  const handlePoliticianPress = (politician: IPolitician) => {
    navigate(`/politics/politician/${politician.id}?tab=${activeTab}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} refresh={refresh} />;
  }

  if (!party) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <X className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Party Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The party you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/politicians")}
              className="bg-blue-600"
            >
              <p className="text-white font-bold">Back to Parties</p>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            {/* Party Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {/* Party Color Circle with Name */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.abbreviation}
                  </div>

                  {/* Party Information */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {party.name}
                    </h1>
                    <p className="text-lg text-gray-600 mb-1">
                      {party.abbreviation}
                    </p>
                    {party.ideology && (
                      <p className="text-sm text-gray-500">
                        Ideology: {party.ideology}
                      </p>
                    )}
                  </div>
                </div>

                {/* Party Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Party Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Founded:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {new Date(party.foundedIn).getFullYear()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Members:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          {party.count || 0}
                        </span>
                      </div>
                      {party.ideology && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Ideology:</span>
                          <span className="font-medium text-gray-900 ml-1">
                            {party.ideology}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Contact & Resources
                    </h3>
                    <div className="space-y-2">
                      {party.logoUrl && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Website:</span>
                          <a
                            href={party.logoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 ml-1 hover:underline"
                          >
                            View Party Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Headquarters:</span>
                        <span className="font-medium text-gray-900 ml-1">
                          Kathmandu, Nepal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "politicians":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Party Members ({partyPoliticians.length})
            </h2>
            {politiciansLoading ? (
              <div className="flex justify-center py-8">
                <Loading />
              </div>
            ) : politiciansError ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-red-500">
                    <X className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Error Loading Politicians
                    </p>
                    <p className="text-sm">{politiciansError}</p>
                  </div>
                </CardContent>
              </Card>
            ) : partyPoliticians.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No Party Members</p>
                    <p className="text-sm">
                      There are no politicians currently associated with{" "}
                      {party.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {partyPoliticians.map((politician: IPolitician) => (
                  <Card
                    key={politician.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handlePoliticianPress(politician)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Politician Avatar/Initial */}
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-500" />
                        </div>

                        {/* Politician Information */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {politician.fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {politician.sourceCategories.positions[0] ||
                              "Position not specified"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {politician.sourceCategories.levels[0] ||
                                "Level not specified"}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              Rating: {politician.rating || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Reports Count */}
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">
                              {politician.verifiedReports || 0}
                            </span>
                            <span className="text-xs text-gray-400">
                              {" "}
                              reports
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case "budget":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Party Budget
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <DollarSign className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Budget Information</p>
                  <p className="text-sm">
                    Budget allocation and spending for {party.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "history":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Party History
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Historical Events</p>
                  <p className="text-sm">
                    Key milestones and events for {party.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft size={20} className="mr-2" />
            <p className="text-white font-bold">Back</p>
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Party Details</h1>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabSelector
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={partyTabs}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </div>
  );
}
