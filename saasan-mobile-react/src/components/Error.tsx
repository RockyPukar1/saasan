import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  error: string;
  refresh: () => void;
}

export default function Error({ error, refresh }: Props) {
  return (
    <div className="flex-1 justify-center items-center bg-gray-50 px-4">
      <AlertTriangle className="text-red-500 mb-4" size={48} />
      <p className="text-red-600 text-lg font-bold mb-2">
        Error Loading Data
      </p>
      <p className="text-gray-600 text-center mb-4">{error}</p>
      <Button onClick={refresh} className="bg-red-600">
        <p className="text-white font-bold">Retry</p>
      </Button>
    </div>
  );
}
