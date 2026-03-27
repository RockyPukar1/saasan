import { LoadingSpinner } from "./ui/loading-spinner";

interface LoadingProps {
  message?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
}

export default function Loading({
  message = "Loading...",
  variant = "spinner",
  className = "",
}: LoadingProps) {
  if (variant === "spinner") {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-8 ${className}`}
      >
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-8 ${className}`}
    >
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
      </div>
    </div>
  );
}
