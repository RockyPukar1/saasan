import { Button } from "@/components/ui/button";

interface IRenderPagination {
  currentPage: number;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  totalItems: number;
  pageSize: number;
  currentItemCount: number;
  itemName: string;
}

export default function RenderPagination({
  currentPage,
  hasNext,
  totalItems,
  onPrevious,
  onNext,
  itemName,
  pageSize,
  currentItemCount,
}: IRenderPagination) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem =
    currentItemCount === 0 ? 0 : Math.min(startItem + currentItemCount - 1, totalItems);

  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600">Page {currentPage}</span>

      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={!hasNext}
      >
        Next
      </Button>

      <span className="text-sm text-gray-500 ml-4">
        Showing {startItem} to {endItem} of {totalItems} {itemName}
      </span>
    </div>
  );
}
