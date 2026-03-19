import { useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ITabSelector<TSetActiveTab> {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<TSetActiveTab>>;
  tabs: {
    label: string;
    value: string;
  }[];
}

export default function TabSelector<TSetActiveTab>({
  activeTab,
  setActiveTab,
  tabs,
}: ITabSelector<TSetActiveTab>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth;
    setNeedsScroll(hasOverflow);
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth,
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    checkScroll();

    // Check on resize
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);

    // Check on scroll
    const handleScroll = () => checkScroll();
    container.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [tabs]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="bg-white border-b border-gray-200 relative w-full">
      <div className="flex items-center w-full" style={{ minHeight: "48px" }}>
        {/* Left Chevron */}
        {needsScroll && canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-2xl flex items-center justify-center hover:shadow-2xl transition-shadow"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
        )}

        {/* Right Chevron */}
        {needsScroll && canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-2xl flex items-center justify-center hover:shadow-2xl transition-shadow"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        )}

        {/* Tab Container */}
        <div
          ref={scrollContainerRef}
          className={`px-4 py-2 flex-1 ${needsScroll ? "overflow-x-auto scrollbar-hide" : "overflow-hidden"}`}
        >
          <div
            className={`flex ${needsScroll ? "gap-1 min-w-max" : "gap-1 w-full h-full"}`}
          >
            {tabs.map((tab) => (
              <div
                key={tab.value}
                onClick={() => setActiveTab(tab.value as TSetActiveTab)}
                className={`bg-white px-4 py-3 flex items-center justify-center border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.value
                    ? "border-red-600"
                    : "border-transparent"
                } ${needsScroll ? "" : "flex-1"}`}
              >
                <p
                  className={`font-bold text-sm ${
                    activeTab === tab.value ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
