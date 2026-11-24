import { headers } from "next/headers";

const HOST_PATTERN = /^[a-zA-Z0-9.-]+(:\d+)?$/;
const LOCAL_HOST_PATTERN = /^(localhost|127\.0\.0\.1)(:|\/|$)/i;

export function normalizeOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const protocol = LOCAL_HOST_PATTERN.test(trimmed) ? "http" : "https";
  return `${protocol}://${trimmed}`;
}

export async function getSiteUrl(): Promise<string> {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configuredSiteUrl) {
    return normalizeOrigin(configuredSiteUrl);
  }

  const headerList = await headers();
  const forwardedHost = headerList.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headerList.get("host")?.split(",")[0]?.trim();

  if (host && HOST_PATTERN.test(host)) {
    const rawProto = headerList
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase();
    const defaultProto = LOCAL_HOST_PATTERN.test(host) ? "http" : "https";
    const proto = rawProto === "http" || rawProto === "https" ? rawProto : defaultProto;
    return `${proto}://${host}`;
  }

  const envUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (envUrl) {
    return normalizeOrigin(envUrl);
  }

  return "http://localhost:3000";
}

export async function getEmailRedirectUrl(): Promise<string> {
  return `${await getSiteUrl()}/auth/confirm`;
}
