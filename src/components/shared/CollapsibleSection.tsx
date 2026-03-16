"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  copyText?: string;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  icon,
  children,
  copyText,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-semibold text-surface-900">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {copyText && (
            <span onClick={(e) => e.stopPropagation()}>
              <CopyButton text={copyText} />
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
