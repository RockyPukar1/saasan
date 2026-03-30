import { useState, useEffect } from "react";
import { BackButton } from "./back-button";

interface ScrollableHeaderProps {
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  className?: string;
}

export function ScrollableHeader({
  showBackButton = false,
  rightAction,
  className = "",
}: ScrollableHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollThreshold] = useState(50); // Show when pulling up 50px

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up";

      // Hide when scrolling down, show when scrolling up past threshold
      if (scrollDirection === "down" && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDirection === "up" && currentScrollY < scrollThreshold) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollThreshold]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"} ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && <BackButton />}
        </div>
        <div className="flex items-center space-x-2">{rightAction}</div>
      </div>
    </div>
  );
}
