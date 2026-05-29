import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getSafeRedirectPath } from "@/lib/security/safe-redirect";
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/login?error=supabase-not-configured", request.url)
      );
    }
    return NextResponse.next();
  }

  const { supabaseResponse, user, supabase } = await updateSession(request);

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "staff"].includes(profile.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile && ["admin", "staff"].includes(profile.role)) {
      const redirectTo = getSafeRedirectPath(
        request.nextUrl.searchParams.get("redirect"),
        "/admin"
      );
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/login",
    "/auth/callback",
  ],
};
