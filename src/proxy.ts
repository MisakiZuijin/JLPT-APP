import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PROTECTED = [
  "/admin",
  "/dashboard",
  "/review",
  "/kana",
  "/reading",
  "/writing",
  "/pronunciation",
  "/kaiwa",
  "/culture",
  "/daily-test",
  "/exam",
  "/bunpou",
  "/mistakes",
  "/profile",
  "/settings",
];

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function redirectWithCookies(url: URL, cookiesToApply: CookieToSet[]) {
  const redirectRes = NextResponse.redirect(url);
  for (const { name, value, options } of cookiesToApply) {
    redirectRes.cookies.set(name, value, options);
  }
  return redirectRes;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  let updatedCookies: CookieToSet[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          updatedCookies = cookiesToSet;
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Gunakan getUser() agar status sesi di proxy identik 100% dengan requireShellContext()
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.app_metadata?.role === "admin";

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return redirectWithCookies(url, updatedCookies);
  }

  if (isLoggedIn && (path === "/admin" || path.startsWith("/admin/")) && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return redirectWithCookies(url, updatedCookies);
  }

  if (isLoggedIn && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? "/admin" : "/dashboard";
    url.search = "";
    return redirectWithCookies(url, updatedCookies);
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)"],
};
