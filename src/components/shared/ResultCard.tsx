import CopyButton from "./CopyButton";

interface ResultCardProps {
  title?: string;
  content: string;
  showCopy?: boolean;
  children?: React.ReactNode;
}

export default function ResultCard({
  title,
  content,
  showCopy = true,
  children,
}: ResultCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-semibold text-surface-900 mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{content}</p>
        </div>
        {showCopy && <CopyButton text={content} />}
      </div>
      {children}
    </div>
  );
}
