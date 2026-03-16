import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return false;
  await connectDB();
  const user = await User.findById(userId);
  return user?.role === "admin";
}
