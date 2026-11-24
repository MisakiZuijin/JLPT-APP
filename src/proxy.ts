import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getOnboardingStatus } from "@/lib/onboarding-guard";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const PROTECTED = [
  "/admin",
  "/onboarding",
  "/roadmap",
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
  redirectRes.headers.set("Cache-Control", "private, no-store");
  return redirectRes;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const path = request.nextUrl.pathname;
  const sp = request.nextUrl.searchParams;

  // Tangkap fallback link verifikasi Supabase yang mengarah ke root "/"
  if (
    path === "/" &&
    (sp.has("code") ||
      (sp.has("token_hash") && sp.has("type")) ||
      sp.has("error") ||
      sp.has("error_code"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/confirm";
    const redirectRes = NextResponse.redirect(url);
    redirectRes.headers.set("Cache-Control", "private, no-store");
    return redirectRes;
  }

  if (path.startsWith("/auth/")) {
    response.headers.set("Cache-Control", "private, no-store");
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
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Gunakan getUser() agar status sesi di proxy identik 100% dengan requireShellContext()
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.app_metadata?.role === "admin";

  const isProtected = PROTECTED.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
  const isOnboardingPath = path === "/onboarding" || path.startsWith("/onboarding/");
  const isAdminPath = path === "/admin" || path.startsWith("/admin/");

  // 1. Belum login mengakses halaman terlindungi -> wajib ke /login
  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return redirectWithCookies(url, updatedCookies);
  }

  // 2. Sudah login sebagai Admin -> isolasi ke /admin dari /login; tidak dipaksa onboarding
  if (isLoggedIn && isAdmin) {
    if (path === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return redirectWithCookies(url, updatedCookies);
    }

    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  // 3. Sudah login sebagai Pelajar -> cek status onboarding untuk /login & rute terlindungi
  if (isLoggedIn && user && (path === "/login" || isProtected)) {
    const { schemaReady, completed } = await getOnboardingStatus(supabase, user.id);
    const needsOnboarding = schemaReady && !completed;

    // Pelajar belum selesai onboarding -> arahkan wajib ke /onboarding
    if (needsOnboarding) {
      if (!isOnboardingPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        url.search = "";
        return redirectWithCookies(url, updatedCookies);
      }

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    // Pelajar sudah selesai onboarding -> blokir /admin, /login, & /onboarding (kecuali ?retake=1)
    if (isAdminPath || path === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return redirectWithCookies(url, updatedCookies);
    }

    if (isOnboardingPath && sp.get("retake") !== "1") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return redirectWithCookies(url, updatedCookies);
    }
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)",
  ],
};
