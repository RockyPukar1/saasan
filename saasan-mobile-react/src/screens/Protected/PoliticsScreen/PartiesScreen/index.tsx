import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building, Users, X, ArrowLeft } from "lucide-react";
import { useParties } from "@/hooks/useParties";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IParty } from "@/types/politics";
import { useNavigate } from "react-router-dom";

export default function PartiesScreen() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const { parties, loading, error, refresh } = useParties();

  const filteredParties =
    parties?.filter(
      (party: IParty) =>
        party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        party.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} refresh={refresh} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Political Parties</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search parties..."
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

      {/* Parties List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredParties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Building className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-center">
              {searchQuery
                ? "No parties found matching your search."
                : "No parties available."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredParties.map((party: IParty) => (
              <Card
                key={party.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/politics/party/${party.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Party Color Circle with Abbreviation */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: party.color }}
                    >
                      {party.abbreviation}
                    </div>

                    {/* Party Information */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {party.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {party.abbreviation}
                      </p>
                      {party.ideology && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ideology: {party.ideology}
                        </p>
                      )}
                    </div>

                    {/* Politician Count */}
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users size={16} />
                      <span className="text-sm">{party.count || 0}</span>
                    </div>
                  </div>

                  {/* Founded Year */}
                  <div className="mt-2 text-xs text-gray-400">
                    Founded: {new Date(party.foundedIn).getFullYear()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
