interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Error state component with retry button
 */
export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">Error: {error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}

