import { useState, useEffect } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation
    }, 2000); // Show for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-opacity duration-300 ${!isVisible ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center animate-zoom-in">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-white shadow-2xl flex items-center justify-center ring-8 ring-white/50">
          <img
            src="/logo.png"
            alt="Saasan"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-gray-800 font-light text-lg tracking-wide animate-fade-in">
          Citizen Engagement Platform
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
