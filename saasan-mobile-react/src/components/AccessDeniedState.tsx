import React from "react";

interface AccessDeniedStateProps {
  title?: string;
  message?: string;
}

export const AccessDeniedState: React.FC<AccessDeniedStateProps> = ({
  title = "Access Denied",
  message = "You do not have permission to access this page.",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
        <p className="text-gray-600 mb-4">{message}</p>
      </div>
    </div>
  );
};
