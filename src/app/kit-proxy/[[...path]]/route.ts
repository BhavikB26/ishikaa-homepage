import { request } from "node:https";
import type { NextRequest } from "next/server";

// Forwards makezeronoise.com's non-calculator pages to Kit.
//
// Kit only serves this domain's pages (e.g. /subjectlines) to requests that arrive at its own
// servers claiming the makezeronoise.com hostname, so we connect to Kit's IPs directly while
// sending that hostname (TLS is still verified against makezeronoise.com). If Kit ever changes
// these IPs, set KIT_ORIGIN_IPS (comma-separated) in Vercel — no code change needed.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORIGIN_HOST = "makezeronoise.com";
const ORIGIN_IPS = (process.env.KIT_ORIGIN_IPS ?? "3.130.60.26,3.13.222.255,3.13.246.91")
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

const SKIP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "content-length",
  "set-cookie", // Set-Cookie would stop the CDN caching these pages; static viewing doesn't need them
]);

type Origin = { status: number; headers: Record<string, string | string[] | undefined>; body: Buffer };

function fetchFrom(ip: string, path: string, method: "GET" | "HEAD"): Promise<Origin> {
  return new Promise((resolve, reject) => {
    const req = request(
      {
        host: ip,
        servername: ORIGIN_HOST,
        port: 443,
        method,
        path,
        timeout: 8000,
        headers: {
          Host: ORIGIN_HOST,
          "User-Agent": "Mozilla/5.0 (compatible; ZeroNoiseProxy/1.0)",
          Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
          "Accept-Encoding": "identity",
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode ?? 502, headers: res.headers, body: Buffer.concat(chunks) }));
        res.on("error", reject);
      },
    );
    req.on("timeout", () => req.destroy(new Error(`timeout from ${ip}`)));
    req.on("error", reject);
    req.end();
  });
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }, method: "GET" | "HEAD") {
  const { path = [] } = await ctx.params;
  const target = "/" + path.map(encodeURIComponent).join("/") + req.nextUrl.search;

  let origin: Origin | null = null;
  for (const ip of ORIGIN_IPS) {
    try {
      const r = await fetchFrom(ip, target, method);
      if (r.status < 500) {
        origin = r;
        break;
      }
    } catch {
      // try the next IP
    }
  }
  if (!origin) {
    return new Response("This page is temporarily unavailable. Please try again in a moment.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const headers = new Headers();
  for (const [k, v] of Object.entries(origin.headers)) {
    if (v === undefined || SKIP_RESPONSE_HEADERS.has(k.toLowerCase())) continue;
    headers.set(k, Array.isArray(v) ? v.join(", ") : v);
  }
  // Cache at the edge so a Kit hiccup doesn't take the pages down: serve stale for a day.
  headers.set(
    "Cache-Control",
    origin.status === 200
      ? "public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=86400"
      : origin.status === 404
        ? "public, s-maxage=60"
        : "no-store",
  );
  // Keep the vercel.app copy of these pages out of search results.
  if (!/(^|\.)makezeronoise\.com$/i.test(req.headers.get("host")?.split(":")[0] ?? "")) {
    headers.set("X-Robots-Tag", "noindex");
  }
  return new Response(method === "HEAD" ? null : new Uint8Array(origin.body), { status: origin.status, headers });
}

export function GET(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx, "GET");
}

export function HEAD(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx, "HEAD");
}
