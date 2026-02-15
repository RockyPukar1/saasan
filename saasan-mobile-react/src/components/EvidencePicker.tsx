import { cn } from "@/lib/utils";
import { useState } from "react";

interface IEvidencePicker {
  onFileSelect: (files: File[]) => void;
  background: string;
  text: string;
  Icon: any;
  accept?: string;
  multiple?: boolean;
}

export default function EvidencePicker({
  onFileSelect,
  background,
  text,
  Icon,
  accept = "image/*,application/pdf,.doc,.docx",
  multiple = true,
}: IEvidencePicker) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event?.target.files || []);
    onFileSelect(files);
    event.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const getBackgroundClasses = () => {
    switch (background) {
      case "blue":
        return "bg-blue-600 hover:bg-blue-700";
      case "green":
        return "bg-green-600 hover:bg-green-700";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        id={`file-picker-${text.replace(/\s+/g, "-").toLowerCase()}`}
        className="hidden"
      />
      <label
        htmlFor={`file-picker-${text.replace(/\s+/g, "-").toLowerCase()}`}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-4 py-2 cursor-pointer transition-all duration-200 text-sm font-medium shadow-sm",
          getBackgroundClasses(),
          isDragOver && "ring-2 ring-offset-2 ring-blue-500 scale-105",
          "hover:shadow-md active:scale-95",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center">
          <Icon className="text-white mr-2" size={16} color="white" />
          <p className="text-white font-medium">{text}</p>
        </div>
      </label>
    </div>
  );
}
