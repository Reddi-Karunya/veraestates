import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { getSafeRedirectPath } from "@/lib/security/safe-redirect";
export const metadata: Metadata = {
  title: "Admin Login | VeraEstates",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessages: Record<string, string> = {
    unauthorized: "You do not have permission to access the admin area.",
    "auth-callback-failed": "Sign in failed. Please try again.",
    "supabase-not-configured":
      "Supabase is not configured. Add environment variables from .env.local.example",
    invalid_credentials: "Invalid email or password.",
  };

  const errorMessage = params.error
    ? errorMessages[params.error] ?? "Something went wrong."
    : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 block text-center">
          <span className="font-display text-2xl text-cream">
            Vera<span className="text-gold">Estates</span>
          </span>
          <p className="mt-1 text-sm text-cream/50">Admin Portal</p>
        </Link>

        <div className="rounded-2xl border border-cream/10 bg-cream p-8 shadow-2xl">
          <h1 className="font-display text-2xl text-navy">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Access the property management dashboard
          </p>

          {errorMessage && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          <div className="mt-6">
            <LoginForm redirectTo={getSafeRedirectPath(params.redirect, "/admin")} />
          </div>
        </div>
      </div>
    </div>
  );
}
