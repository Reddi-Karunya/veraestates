import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/get-profile";
import type { Profile } from "@/types/database";

export async function requireAdmin(): Promise<{
  userId: string;
  profile: Profile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const profile = await getProfile(user.id);

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    redirect("/login?error=unauthorized");
  }

  return { userId: user.id, profile };
}

export async function requireAdminOnly(): Promise<{
  userId: string;
  profile: Profile;
}> {
  const result = await requireAdmin();
  if (result.profile.role !== "admin") {
    redirect("/admin?error=admin-only");
  }
  return result;
}
