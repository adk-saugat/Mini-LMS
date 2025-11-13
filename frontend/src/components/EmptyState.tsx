interface EmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

/**
 * Empty state component when no courses are found
 */
export default function EmptyState({
  searchQuery,
  onClearSearch,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <p className="text-gray-600 mb-4">
        {searchQuery
          ? `No courses found matching "${searchQuery}"`
          : "No courses available at the moment."}
      </p>
      {searchQuery && onClearSearch && (
        <button
          onClick={onClearSearch}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear search
        </button>
      )}
    </div>
  );
}

