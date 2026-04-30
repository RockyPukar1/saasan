import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate, type To } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  text?: string;
  to?: To;
}

export function BackButton({
  className = "",
  variant = "ghost",
  size = "md",
  showText = false,
  text = "Back",
  to,
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  const sizeClasses = {
    sm: "p-1",
    md: "p-2", 
    lg: "p-3"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      className={`${sizeClasses[size]} ${className} -ml-2 hover:bg-gray-100 rounded-lg transition-colors`}
    >
      <ArrowLeft 
        className="text-gray-600" 
        size={iconSizes[size]} 
      />
      {showText && (
        <span className="ml-2 font-medium">{text}</span>
      )}
    </Button>
  );
}
