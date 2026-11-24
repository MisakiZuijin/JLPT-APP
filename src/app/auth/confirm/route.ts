import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getOnboardingStatus } from "@/lib/onboarding-guard";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

const HOST_PATTERN = /^[a-zA-Z0-9.-]+(:\d+)?$/;

const VALID_OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "email",
  "magiclink",
  "recovery",
  "invite",
  "email_change",
]);

function getRequestOrigin(request: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    return request.nextUrl.origin;
  }

  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  if (forwardedHost && HOST_PATTERN.test(forwardedHost)) {
    const rawProto = request.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase();
    const proto = rawProto === "http" || rawProto === "https" ? rawProto : "https";
    return `${proto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function sanitizeNext(raw: string | null): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }
  return "/dashboard";
}

function redirectWithCookies(url: URL, cookiesToApply: CookieToSet[]) {
  const response = NextResponse.redirect(url);
  for (const { name, value, options } of cookiesToApply) {
    response.cookies.set(name, value, options);
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const origin = getRequestOrigin(request);

  if (!isSupabaseConfigured()) {
    return redirectWithCookies(new URL("/login?setup=1", origin), []);
  }

  const sp = request.nextUrl.searchParams;
  const tokenHash = sp.get("token_hash");
  const type = sp.get("type");
  const code = sp.get("code");
  const errorParam = sp.get("error");
  const errorCode = sp.get("error_code");
  const next = sanitizeNext(sp.get("next"));

  if (errorParam || errorCode) {
    const authError = errorCode === "otp_expired" ? "otp_expired" : "verify_failed";
    return redirectWithCookies(new URL(`/login?auth_error=${authError}`, origin), []);
  }

  const cookieMap = new Map<string, CookieToSet>();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            cookieMap.set(cookie.name, cookie);
            request.cookies.set(cookie.name, cookie.value);
          }
        },
      },
    }
  );

  if (tokenHash && type && VALID_OTP_TYPES.has(type as EmailOtpType)) {
    const { data, error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: tokenHash,
    });
    const cookiesToApply = [...cookieMap.values()];

    if (!error) {
      let targetPath = next;
      if (data.user?.app_metadata?.role === "admin") {
        targetPath = next === "/dashboard" ? "/admin" : next;
      } else if (data.user) {
        const { schemaReady, completed } = await getOnboardingStatus(supabase, data.user.id);
        if (schemaReady && !completed) {
          targetPath = "/onboarding";
        }
      }
      return redirectWithCookies(new URL(targetPath, origin), cookiesToApply);
    }

    const authError =
      error.code === "otp_expired" || /expired|invalid/i.test(error.message)
        ? "otp_expired"
        : "verify_failed";
    return redirectWithCookies(
      new URL(`/login?auth_error=${authError}`, origin),
      cookiesToApply
    );
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    const cookiesToApply = [...cookieMap.values()];

    if (!error) {
      let targetPath = next;
      if (data.user?.app_metadata?.role === "admin") {
        targetPath = next === "/dashboard" ? "/admin" : next;
      } else if (data.user) {
        const { schemaReady, completed } = await getOnboardingStatus(supabase, data.user.id);
        if (schemaReady && !completed) {
          targetPath = "/onboarding";
        }
      }
      return redirectWithCookies(new URL(targetPath, origin), cookiesToApply);
    }

    if (
      error.code === "pkce_code_verifier_not_found" ||
      /code verifier|pkce/i.test(error.message)
    ) {
      return redirectWithCookies(
        new URL("/login?verified=cross_device", origin),
        cookiesToApply
      );
    }

    const authError =
      error.code === "otp_expired" || /expired/i.test(error.message)
        ? "otp_expired"
        : "verify_failed";
    return redirectWithCookies(
      new URL(`/login?auth_error=${authError}`, origin),
      cookiesToApply
    );
  }

  return redirectWithCookies(
    new URL("/login?auth_error=verify_failed", origin),
    [...cookieMap.values()]
  );
}
