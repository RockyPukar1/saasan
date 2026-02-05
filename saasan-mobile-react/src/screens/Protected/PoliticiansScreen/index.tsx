import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Star,
  Users,
  X,
  Filter,
} from "lucide-react";
import { usePoliticians } from "@/hooks/usePoliticians";
import Loading from "@/components/Loading";
import Error from "@/components/Error";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import type { IPolitician } from "@/types/politician";

export interface PoliticianFilter {
  level: string[];
  position: string[];
  party: string[];
}

const initialFilter: PoliticianFilter = {
  level: [],
  position: [],
  party: [],
};

export default function PoliticiansScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<PoliticianFilter>(initialFilter);
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);

  const {
    politicians,
    governmentLevels,
    parties,
    positions,
    loading,
    error,
    refresh,
  } = usePoliticians();

  const filterNames = [
    {
      name: "level",
      text: "Level",
      data: governmentLevels,
    },
    {
      name: "position",
      text: "Position",
      data: positions,
    },
    {
      name: "party",
      text: "Party",
      data: parties,
    },
  ] as Array<{ name: keyof typeof initialFilter; text: string; data: any[] }>;

  useEffect(() => {
    refresh(toApplyFilter);
  }, [toApplyFilter]);

  // Extract unique parties and positions
  const [currentFilterDropdown, setCurrentFilterDropdown] = useState("");
  const [filterHeight, setFilterHeight] = useState(80); // Initial height percentage
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(70);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartHeight.current = filterHeight;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartY.current - currentY;
    const newHeight = dragStartHeight.current + (deltaY / window.innerHeight) * 100;
    
    // Constrain between 30% and 80%
    const constrainedHeight = Math.max(30, Math.min(80, newHeight));
    setFilterHeight(constrainedHeight);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const openFilter = () => {
    setFilterHeight(70); // Reset to full height
    setCurrentFilterDropdown("OPEN");
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const deltaY = dragStartY.current - e.clientY;
      const newHeight = dragStartHeight.current + (deltaY / window.innerHeight) * 100;
      const constrainedHeight = Math.max(30, Math.min(80, newHeight));
      setFilterHeight(constrainedHeight);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const deltaY = dragStartY.current - e.touches[0].clientY;
      const newHeight = dragStartHeight.current + (deltaY / window.innerHeight) * 100;
      const constrainedHeight = Math.max(30, Math.min(80, newHeight));
      setFilterHeight(constrainedHeight);
    };

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false });
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.style.overflow = '';
    };
  }, [isDragging]);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-stretch gap-3">
          <div className="flex-1 flex items-center bg-white rounded-lg px-4 shadow-sm">
            <Search className="text-gray-500 w-5 h-5" />
            <Input
              placeholder="Search politicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-gray-800 border-none outline-none focus-visible:ring-0"
            />
          </div>
          <Button
            onClick={() =>
              currentFilterDropdown ? setCurrentFilterDropdown("") : openFilter()
            }
            className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm"
          >
            <Filter className="text-gray-700 w-5 h-5" />
          </Button>
        </div>
      </div>

      {currentFilterDropdown === "OPEN" && (
        <div
          className="fixed inset-0 flex items-end justify-center z-60"
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-50" onClick={() => setCurrentFilterDropdown("")}></div>
          <div 
            className="bg-white rounded-t-2xl border-t border-gray-200 shadow-2xl w-full z-70 mb-8"
            style={{ height: `${filterHeight}vh`, maxHeight: '70vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div 
              className="flex justify-center py-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <div className="w-12 h-1 bg-gray-400 rounded-full" />
            </div>
            
            <div className="flex items-center justify-between px-4 pt-0 py-3 border-b border-gray-200">
              <Button
                onClick={() => setCurrentFilterDropdown("")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                variant="ghost"
              >
                <X className="w-5 h-5 text-gray-700" />
              </Button>

              <Button
                onClick={() => {
                  setFilter(initialFilter);
                  setToApplyFilter(initialFilter);
                }}
                disabled={Object.values(filter).flat(1).length === 0}
                className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                variant="ghost"
              >
                <p className="text-xs font-semibold text-red-600">Clear</p>
              </Button>
            </div>

            {/* Filter content */}
            <div className="px-4 py-3 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100% - 100px)' }}>
              {filterNames.map(({ name, text, data }) => (
                <div key={name} className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {text}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {data.map((d) => {
                      const isSelected = filter[name].includes(d.id);

                      return (
                        <Button
                          key={d.id}
                          onClick={() => {
                            setFilter((prev) => ({
                              ...prev,
                              [name]: isSelected
                                ? prev[name].filter((l) => l !== d.id)
                                : [...prev[name], d.id],
                            }));
                          }}
                          className={`px-3 py-2 rounded-full border ${
                            isSelected
                              ? "bg-red-50 border-red-500"
                              : "bg-gray-100 border-gray-200"
                          }`}
                        >
                          <p
                            className={`text-xs font-medium ${
                              isSelected ? "text-red-600" : "text-gray-700"
                            }`}
                          >
                            {d.name}
                          </p>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-200 bg-white">
              <Button
                onClick={() => {
                  setToApplyFilter(filter);
                  setCurrentFilterDropdown("");
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <Error error={error} refresh={() => refresh(filter)} />
      ) : (
        <div className="px-4 py-4 overflow-auto">
          {politicians.length > 0 ? (
            politicians.map((politician) => (
              <PoliticianCard key={politician.id} politician={politician} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="text-gray-400 w-16 h-16" />
              <p className="text-gray-600 text-lg font-medium mt-4">
                {loading ? "Loading politicians..." : "No politicians found"}
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                {loading
                  ? "Please wait while we fetch the data..."
                  : "Try adjusting your search or filter"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PoliticianCard = ({ politician }: { politician: IPolitician }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-3">
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          {/* Compact Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-2">
              <p
                className="text-base font-bold text-gray-800 mb-1"
              >
                {politician.fullName}
              </p>

              {politician.constituencyNumber && (
                <div className="flex items-center">
                  <MapPin className="text-gray-500 w-2.5 h-2.5" />
                  <p
                    className="text-gray-500 text-xs ml-1"
                  >
                    {politician.constituencyNumber}
                  </p>
                </div>
              )}

              {/* Compact Rating and Stats */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Star className="text-yellow-500 w-3.5 h-3.5" fill="#EAB308" />
                  <p className="text-gray-800 font-bold ml-1 text-sm">
                    {typeof politician.rating === "number"
                      ? politician.rating.toFixed(1)
                      : "0.0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 items-end ml-2">
              {politician.sourceCategories?.levels?.length > 0 &&
                politician.sourceCategories.levels.map((l, index) => (
                  <div
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-red-100 border border-red-300"
                  >
                    <p
                      className="text-red-700 text-xs font-bold"
                    >
                      {l}
                    </p>
                  </div>
                ))}
              {politician.sourceCategories?.positions?.length > 0 &&
                politician.sourceCategories.positions.map((p, index) => (
                  <div
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-blue-100 border border-blue-300"
                  >
                    <p
                      className="text-blue-700 text-xs font-bold"
                    >
                      {p}
                    </p>
                  </div>
                ))}
              {politician.sourceCategories?.party && (
                <div className="px-1.5 py-0.5 rounded bg-green-100 border border-green-300">
                  <p
                    className="text-green-700 text-xs font-bold"
                  >
                    {politician.sourceCategories.party}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-blue-600 py-2 rounded"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Rate politician:", politician.id);
              }}
            >
              <p className="text-white font-medium text-center text-xs">
                Rate
              </p>
            </Button>
            <Button
              className="flex-1 bg-gray-200 py-2 rounded"
              onClick={() => navigate(`/politician/${politician.id}`)}
            >
              <p className="text-gray-700 font-medium text-center text-xs">
                View Details
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
