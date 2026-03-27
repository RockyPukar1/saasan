import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
    </div>
  );
}

interface LoadingProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export default function Loading({ 
  message = "Loading...", 
  showSpinner = true,
  className = ""
}: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-8 ${className}`}>
      {showSpinner && <LoadingSpinner size="lg" />}
      <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
    </div>
  );
}
