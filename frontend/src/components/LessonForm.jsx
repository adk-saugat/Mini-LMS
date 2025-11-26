import ReactMarkdown from "react-markdown";

function LessonForm({
  formData,
  error,
  loading,
  onChange,
  onSubmit,
  onCancel,
  isEditMode = false,
}) {
  return (
    <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {isEditMode ? "Edit Lesson" : "Create New Lesson"}
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
          <div className="grid grid-cols-2 gap-4 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            {/* Markdown Editor */}
            <div className="border-r border-gray-300">
              <textarea
                value={formData.content}
                onChange={(e) => onChange("content", e.target.value)}
                className="w-full h-full px-6 py-6 focus:outline-none resize-none font-mono text-gray-800 leading-relaxed bg-gray-50"
                placeholder="Start typing your lesson content here...

You can use markdown formatting:
- **Bold text** with **
- *Italic text* with *
- # Headers with #
- - Lists with -
- > Blockquotes with >

The content will be rendered beautifully when students view it."
                disabled={loading}
                required
                style={{
                  minHeight: "400px",
                  lineHeight: "1.6",
                  fontSize: "14px",
                }}
              />
            </div>
            {/* Markdown Preview */}
            <div className="px-6 py-6 overflow-y-auto bg-white">
              {formData.content ? (
                <div className="prose prose-lg prose-gray max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-3xl font-bold mt-8 mb-4 text-gray-900"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-2xl font-semibold mt-6 mb-3 text-gray-900"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-xl font-semibold mt-4 mb-2 text-gray-900"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="ml-4" {...props} />
                      ),
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code
                            className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                          />
                        ) : (
                          <code
                            className="block bg-gray-100 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4"
                            {...props}
                          />
                        ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-300 pl-4 italic my-4"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-8 border-gray-300" {...props} />
                      ),
                    }}
                  >
                    {formData.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-400 text-sm italic">
                  Preview will appear here as you type...
                </div>
              )}
            </div>
          </div>
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
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Lesson"
              : "Create Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LessonForm;
