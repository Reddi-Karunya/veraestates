"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/admin/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/properties/new", label: "Add Property", icon: Plus },
];

type AdminSidebarProps = {
  userName?: string | null;
};

export function AdminSidebar({ userName }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <Link href="/admin" className="font-display text-xl text-navy">
          Vera<span className="text-gold">Estates</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-navy text-cream"
                  : "text-muted-foreground hover:bg-muted hover:text-navy"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        {userName && (
          <p className="mb-3 truncate px-3 text-xs text-muted-foreground">
            {userName}
          </p>
        )}
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut data-icon="inline-start" />
            Sign out
          </Button>
        </form>
        <Link
          href="/"
          className="mt-2 block px-3 text-xs text-muted-foreground hover:text-gold"
        >
          ← View public site
        </Link>
      </div>
    </aside>
  );
}
