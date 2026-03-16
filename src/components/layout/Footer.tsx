import Link from "next/link";
import { TOOLS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 sm:mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <span className="text-xl font-display font-bold text-brand-600">
              Profit<span className="text-surface-900">Path</span>
            </span>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              Free online tools for side hustlers, freelancers, and content
              creators. Make smarter money decisions.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">
              Tools
            </h3>
            <ul className="space-y-2">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-sm text-gray-500 hover:text-brand-600 transition-colors"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ProfitPath. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            This site may contain affiliate links. We earn a commission at no
            extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
