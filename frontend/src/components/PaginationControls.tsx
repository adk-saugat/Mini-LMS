interface PaginationControlsProps {
  currentPage: number;
  coursesCount: number;
  coursesPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Pagination controls component
 * Shows previous/next buttons and current page number
 */
export default function PaginationControls({
  currentPage,
  coursesCount,
  coursesPerPage,
  onPrevious,
  onNext,
}: PaginationControlsProps) {
  // If we received fewer courses than the page size, we're on the last page
  // If we received exactly the page size, there might be more pages
  const hasMorePages = coursesCount >= coursesPerPage;
  const isLastPage = coursesCount < coursesPerPage;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700">Page {currentPage}</span>
      <button
        onClick={onNext}
        disabled={isLastPage}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
