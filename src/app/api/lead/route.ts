// Receives a calculator sign-up and saves it to Kit (the email list) and/or a Google Sheet.
//
// The sheet side is a small Apps Script web app (see google-apps-script/). Its URL and a shared
// secret live in Vercel environment variables, never in the page code:
//   KIT_API_KEY           Kit (ConvertKit) v4 API key: adds the person as a subscriber
//   KIT_TAG_ID            optional: numeric id of a Kit tag to apply
//   SHEET_WEBHOOK_URL     the Apps Script "web app" URL
//   SHEET_WEBHOOK_SECRET  any long random string, the same one that is set inside the script
//
// The page never waits on this: the visitor gets their results either way.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set(["ishikaa-jain.vercel.app", "makezeronoise.com", "www.makezeronoise.com", "localhost"]);
const OFFERS = new Set(["Coaching", "Consulting", "Course", "Service", "Other"]);
const CURRENCIES = new Set(["$", "£", "€"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

// A spreadsheet treats a cell starting with = + - @ as a formula. Neutralise that for anything a
// visitor typed, so a malicious "name" can't run something in your sheet.
const safeCell = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : null);

export async function POST(req: Request) {
  // only accept sign-ups sent from our own pages
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (!ALLOWED_HOSTS.has(new URL(origin).hostname)) return json({ ok: false }, 403);
    } catch {
      return json({ ok: false }, 403);
    }
  }

  const raw = await req.text();
  if (raw.length > 4000) return json({ ok: false }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false }, 400);
  }

  // hidden "company" field: people never fill it, bots usually do. Pretend it worked, store nothing.
  if (text(body.company, 100)) return json({ ok: true });

  const name = text(body.name, 80);
  const email = text(body.email, 200).toLowerCase();
  if (!name || !EMAIL_RE.test(email)) return json({ ok: false, error: "invalid" }, 400);

  const offer = OFFERS.has(body.offer as string) ? (body.offer as string) : "";
  const currency = CURRENCIES.has(body.currency as string) ? (body.currency as string) : "$";

  const sheetUrl = process.env.SHEET_WEBHOOK_URL;
  const sheetSecret = process.env.SHEET_WEBHOOK_SECRET;
  const kitKey = process.env.KIT_API_KEY;
  const useSheet = Boolean(sheetUrl && sheetSecret);
  if (!useSheet && !kitKey) {
    console.error("[lead] neither Kit nor the sheet is configured — lead NOT saved:", email);
    return json({ ok: false, error: "not-configured" }, 503);
  }

  const row = {
    secret: sheetSecret,
    name: safeCell(name),
    email: safeCell(email),
    offer,
    list: num(body.list),
    price: num(body.price),
    currency,
    floorYearly: num(body.floorYearly),
    floorMonthly: num(body.floorMonthly),
    page: safeCell(text(body.page, 120)),
    source: safeCell(text(body.source, 160)),
    consent: body.consent === true ? "yes" : "no",
  };

  // Save to every place that is configured. Either one working is enough for the visitor.
  const saves: Promise<boolean>[] = [];
  if (useSheet) saves.push(saveToSheet(sheetUrl!, row, email));
  if (kitKey) saves.push(saveToKit(kitKey, name, email));
  const results = await Promise.all(saves);
  return results.some(Boolean) ? json({ ok: true }) : json({ ok: false, error: "save" }, 502);
}

async function saveToSheet(url: string, row: Record<string, unknown>, email: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // Apps Script reads the body as text
      body: JSON.stringify(row),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !reply?.ok) {
      console.error("[lead] sheet rejected the row:", res.status, reply?.error ?? "no reply", "for", email);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[lead] could not reach the sheet:", (err as Error).message, "for", email);
    return false;
  }
}

// Adds the person to the Kit (ConvertKit) list, optionally tagging them so a sequence can start.
// KIT_API_KEY is the v4 API key; KIT_TAG_ID (optional) is the numeric id of the tag to apply.
async function saveToKit(key: string, name: string, email: string): Promise<boolean> {
  const kit = (path: string, payload: Record<string, unknown>) =>
    fetch(`https://api.kit.com/v4${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": key },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  try {
    const sub = await kit("/subscribers", { email_address: email, first_name: name });
    if (!sub.ok) {
      console.error("[lead] Kit rejected the subscriber:", sub.status, "for", email);
      return false;
    }
    const tag = process.env.KIT_TAG_ID;
    if (tag && /^d+$/.test(tag)) {
      const res = await kit(`/tags/${tag}/subscribers`, { email_address: email });
      if (!res.ok) console.error("[lead] Kit saved the subscriber but tagging failed:", res.status, "for", email);
    }
    return true;
  } catch (err) {
    console.error("[lead] could not reach Kit:", (err as Error).message, "for", email);
    return false;
  }
}
