import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar userName={profile.full_name ?? profile.email} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
