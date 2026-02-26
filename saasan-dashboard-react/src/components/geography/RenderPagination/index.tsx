import { Button } from "@/components/ui/button";

interface IRenderPagination {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  itemName: string;
}

export default function RenderPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemName,
}: IRenderPagination) {
  return (
    <div className="flex justify-center items-center space-x-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>

      <span className="text-sm text-gray-500 ml-4">
        Showing {currentPage} to {totalPages} of {totalItems} {itemName}
      </span>
    </div>
  );
}
