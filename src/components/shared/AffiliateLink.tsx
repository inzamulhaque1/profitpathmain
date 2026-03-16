import { AffiliateItem } from "@/types";

interface AffiliateLinkProps {
  item: AffiliateItem;
}

export default function AffiliateLink({ item }: AffiliateLinkProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 hover:border-brand-300 hover:shadow-sm transition-all group"
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
          {item.name}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
      </div>
      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg whitespace-nowrap">
        Try it →
      </span>
    </a>
  );
}
