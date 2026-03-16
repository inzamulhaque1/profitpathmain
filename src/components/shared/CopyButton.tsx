"use client";

import { useState } from "react";
import clsx from "clsx";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export default function CopyButton({
  text,
  className,
  label = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200",
        copied
          ? "bg-brand-100 text-brand-700"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        className
      )}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}
