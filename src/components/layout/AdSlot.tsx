"use client";

import clsx from "clsx";

interface AdSlotProps {
  variant: "leaderboard" | "sidebar" | "inline";
  className?: string;
}

const sizeMap = {
  leaderboard: "h-[90px] w-full max-w-full sm:max-w-[728px]",
  sidebar: "h-[250px] w-full max-w-[300px]",
  inline: "h-[90px] w-full max-w-full sm:max-w-[728px]",
};

export default function AdSlot({ variant, className }: AdSlotProps) {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    return (
      <div
        className={clsx(
          "border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-400 mx-auto",
          sizeMap[variant],
          className
        )}
      >
        Ad — {variant}
      </div>
    );
  }

  return (
    <div className={clsx("mx-auto", sizeMap[variant], className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
