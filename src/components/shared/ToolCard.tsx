import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export default function ToolCard({
  title,
  description,
  href,
  icon,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-300 hover:shadow-md hover:shadow-brand-500/5 transition-all duration-200"
    >
      <span className="text-3xl block mb-3">{icon}</span>
      <h3 className="text-lg font-display font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>
      <span className="inline-flex items-center text-sm font-medium text-brand-600 mt-4">
        Try it free →
      </span>
    </Link>
  );
}
