export const OFFERS = ["Coaching", "Consulting", "Course", "Service", "Other"] as const;
export type Offer = (typeof OFFERS)[number];

export const LIST = { min: 50, max: 200_000, ticks: ["50", "1k", "10k", "200k"] };
export const PRICE = { min: 10, max: 50_000, ticks: ["10", "250", "5k", "50k"] };

// Buyer rate = the share of the whole list that buys the main offer in a year.
export const LEVELS = [
  {
    id: "bare",
    name: "Bare Minimum",
    emoji: "",
    rate: 0.01,
    tagline: "Your email fundamentals are in place.",
    desc: "You've got an engaged audience, your essential flows are working, and you're staying in touch. That's the baseline we're using here.",
  },
  {
    id: "consistent",
    name: "Consistent",
    emoji: "📈",
    rate: 0.02,
    tagline: "Email is functioning as a real revenue channel.",
    desc: "You're emailing regularly, creating reasons to buy, and using launches or campaigns to drive more revenue from your list and newsletter.",
  },
  {
    id: "dialled",
    name: "All Dialled In",
    emoji: "🚀",
    rate: 0.03,
    tagline: "Email is deeply integrated into your sales system.",
    desc: "Your flows, campaigns, segmentation, offers, launches and customer journey are all pulling their weight.",
  },
] as const;

export type Level = (typeof LEVELS)[number];
// The headline number is the FLOOR: what the list makes at the bare minimum.
export const BENCHMARK: Level = LEVELS[0];

export type Snapshot = { offer: Offer; list: number; price: number; sym: string };

// subscribers × buyer rate × offer price
export const yearly = (list: number, price: number, rate: number) => Math.round(list * rate * price);
export const monthly = (list: number, price: number, rate: number) => Math.round((list * rate * price) / 12);

export const money = (n: number, sym = "$") => `${sym}${Math.round(n).toLocaleString("en-US")}`;
export const count = (n: number) => n.toLocaleString("en-US");
export const pct = (rate: number) => `${Math.round(rate * 100)}%`;

// Sliders are logarithmic: 0–1 position <-> value.
export const toPos = (v: number, min: number, max: number) =>
  Math.min(1, Math.max(0, Math.log(v / min) / Math.log(max / min)));
export const fromPos = (p: number, min: number, max: number) => min * Math.pow(max / min, p);

export function niceRound(v: number) {
  if (v < 100) return Math.round(v);
  const step = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / step) * step;
}
