"use client";

import clsx from "clsx";

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  text?: string;
  loadingText?: string;
}

export default function GenerateButton({
  onClick,
  loading = false,
  text = "Generate",
  loadingText = "Generating...",
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={clsx(
        "w-full sm:w-auto rounded-lg font-semibold px-8 py-3 text-white transition-all duration-200",
        loading
          ? "bg-brand-400 cursor-not-allowed"
          : "bg-brand-500 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 active:scale-[0.98]"
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {loading ? loadingText : text}
      </span>
    </button>
  );
}
