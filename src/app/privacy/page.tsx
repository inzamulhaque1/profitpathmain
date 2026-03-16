import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for ProfitPath — how we collect, use, and protect your data.",
  alternates: { canonical: "https://profitpath.online/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 16, 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
          <p>When you use ProfitPath, we may collect the following information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Account Information:</strong> Name, email address when you create an account or sign in with Google.</li>
            <li><strong>Usage Data:</strong> Pages visited, tools used, generation counts, and feature interactions.</li>
            <li><strong>Device Data:</strong> Browser type, operating system, and screen resolution for improving our services.</li>
            <li><strong>Cookies:</strong> Session cookies for authentication and localStorage for tracking anonymous usage limits.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and maintain our tools and services.</li>
            <li>To manage your account and saved generations.</li>
            <li>To track daily generation limits and task completions.</li>
            <li>To improve our tools and user experience.</li>
            <li>To display relevant recommendations and affiliate content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">3. Data Storage</h2>
          <p>Your data is stored securely on MongoDB Atlas cloud servers. Passwords are encrypted using bcrypt hashing. We do not store your generated content permanently unless you explicitly save it to your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google OAuth:</strong> For sign-in authentication. Subject to Google&apos;s Privacy Policy.</li>
            <li><strong>Google Gemini AI:</strong> For generating content. Your input prompts are sent to Google&apos;s API for processing.</li>
            <li><strong>MongoDB Atlas:</strong> For data storage.</li>
            <li><strong>Vercel:</strong> For hosting and deployment.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">5. Affiliate Links</h2>
          <p>ProfitPath may display affiliate links and promotional content. When you click these links, the third-party service may collect data according to their own privacy policy. We may earn a commission from these referrals at no extra cost to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">6. Cookies</h2>
          <p>We use essential cookies for authentication (NextAuth session) and localStorage for tracking anonymous generation limits. We do not use tracking cookies for advertising purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data stored in your account.</li>
            <li>Delete your saved generations at any time.</li>
            <li>Request deletion of your account by contacting us.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">8. Data Security</h2>
          <p>We implement industry-standard security measures including encrypted passwords, HTTPS encryption, and secure database connections. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900">10. Contact</h2>
          <p>If you have questions about this Privacy Policy, contact us at <strong>support@profitpath.online</strong>.</p>
        </section>
      </div>
    </div>
  );
}
