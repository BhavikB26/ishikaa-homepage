export type Option<T extends string = string> = { id: T; label: string };

export const OFFERS = [
  { id: "coaching", label: "Coaching", mult: 1 },
  { id: "course", label: "Course / program", mult: 1.1 },
  { id: "consulting", label: "Consulting", mult: 0.9 },
  { id: "dfy", label: "Done-for-you service", mult: 0.85 },
  { id: "membership", label: "Membership / community", mult: 1.15 },
] as const;

export const FREQUENCIES = [
  { id: "launch", label: "Rarely / only when launching", mult: 0.8 },
  { id: "monthly", label: "1–2× a month", mult: 1 },
  { id: "weekly", label: "1× a week", mult: 1.1 },
  { id: "twothree", label: "2–3× a week", mult: 1.15 },
  { id: "daily", label: "4+× a week", mult: 1.1 },
] as const;

// rate = share of the list that buys per year; uplift = how much a well-run
// welcome + nurture + sales setup lifts that rate in the conservative case.
export const RESPONSES = [
  { id: "crickets", emoji: "🥱", title: "Mostly crickets", sub: "Barely any opens or clicks", rate: 0.0035, uplift: 2.6 },
  { id: "some", emoji: "🙂", title: "Some people respond", sub: "A few clicks and replies", rate: 0.0075, uplift: 1.85 },
  { id: "strong", emoji: "🔥", title: "People reply, click, buy", sub: "They act on what you send", rate: 0.014, uplift: 1.4 },
  { id: "unknown", emoji: "🤷", title: "I honestly don't know", sub: "That's fine — we'll assume below average", rate: 0.0055, uplift: 2 },
] as const;

export const OPTIMISTIC_FACTOR = 1.6;

export const LIST = { min: 50, max: 200_000, ticks: ["50", "1k", "10k", "200k"] };
export const PRICE = { min: 10, max: 50_000, ticks: ["10", "250", "5k", "50k"] };

export type Inputs = {
  offer: (typeof OFFERS)[number]["id"];
  list: number;
  price: number;
  frequency: (typeof FREQUENCIES)[number]["id"];
  response: (typeof RESPONSES)[number]["id"];
};

export type Scenario = { rate: number; clients: number; revenue: number };
export type Result = { now: Scenario; conservative: Scenario; optimistic: Scenario };

const scenario = (list: number, price: number, rate: number): Scenario => {
  const clients = list * rate;
  return { rate, clients: Math.round(clients), revenue: Math.round((clients * price) / 100) * 100 };
};

export function calculate({ offer, list, price, frequency, response }: Inputs): Result {
  const o = OFFERS.find((x) => x.id === offer)!;
  const f = FREQUENCIES.find((x) => x.id === frequency)!;
  const r = RESPONSES.find((x) => x.id === response)!;
  const now = r.rate * o.mult * f.mult;
  return {
    now: scenario(list, price, now),
    conservative: scenario(list, price, now * r.uplift),
    optimistic: scenario(list, price, now * r.uplift * OPTIMISTIC_FACTOR),
  };
}

// Sliders are logarithmic: 0–1 position <-> value.
export const toPos = (v: number, min: number, max: number) =>
  Math.min(1, Math.max(0, Math.log(v / min) / Math.log(max / min)));
export const fromPos = (p: number, min: number, max: number) => min * Math.pow(max / min, p);

export function niceRound(v: number) {
  if (v < 100) return Math.round(v);
  const step = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / step) * step;
}

export function short(n: number, sym = "$") {
  const a = Math.abs(n);
  if (a < 1000) return `${sym}${Math.round(a)}`;
  if (a < 10_000) return `${sym}${(a / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  if (a < 1_000_000) return `${sym}${Math.round(a / 1000)}k`;
  return `${sym}${(a / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export const full = (n: number, sym = "$") =>
  `${sym}${(Math.round(n / 100) * 100).toLocaleString("en-US")}`;

export const pct = (rate: number) => `${(rate * 100).toFixed(2)}%`;
