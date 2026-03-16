import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SavedGenerationsList from "@/components/tools/SavedGenerationsList";

export const metadata = {
  title: "Saved Generations",
  description: "View and manage your saved AI-generated video plans, scripts, and content.",
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/saved");

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Saved Generations</h1>
      <SavedGenerationsList />
    </div>
  );
}
