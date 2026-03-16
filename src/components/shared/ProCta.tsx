interface ProCtaProps {
  text: string;
}

export default function ProCta({ text }: ProCtaProps) {
  return (
    <div className="rounded-xl border border-accent-400/30 bg-gradient-to-r from-accent-400/5 to-brand-500/5 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-accent-500 bg-accent-400/15 px-2 py-0.5 rounded-full uppercase tracking-wide">
              Pro
            </span>
            <span className="text-xs text-gray-400">Coming Soon</span>
          </div>
          <p className="text-sm text-gray-600">{text}</p>
        </div>
        <button className="text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-5 py-2 rounded-lg transition-colors whitespace-nowrap">
          Notify Me
        </button>
      </div>
    </div>
  );
}
