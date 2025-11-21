function LessonForm({
  formData,
  error,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Create New Lesson
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Lesson Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            placeholder="Enter lesson title"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Lesson Overview
          </label>
          <textarea
            value={formData.overview}
            onChange={(e) => onChange("overview", e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            placeholder="Provide a short overview or summary"
            rows={4}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Lesson Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => onChange("content", e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            placeholder="Enter lesson content"
            rows={6}
            disabled={loading}
            required
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LessonForm;

