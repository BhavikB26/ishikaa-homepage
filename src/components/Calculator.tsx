"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import BookCard from "@/components/BookCard";
import {
  BENCHMARK,
  LEVELS,
  LIST,
  OFFERS,
  PRICE,
  count,
  fromPos,
  money,
  monthly,
  niceRound,

  toPos,
  yearly,
  type Offer,
} from "@/lib/calc";
import { BLUEPRINT_OFFER, BLUEPRINT_URL, BOOKING_URL, CALL_MINUTES, EMAIL } from "@/lib/site";

const CURRENCIES = ["$", "£", "€"] as const;

type SliderProps = { value: number; min: number; max: number; label: string; onChange: (v: number) => void };

function LogSlider({ value, min, max, label, onChange }: SliderProps) {
  const pos = toPos(value, min, max);
  return (
    <input
      type="range"
      className="slider"
      min={0}
      max={1000}
      value={Math.round(pos * 1000)}
      aria-label={label}
      style={{ "--pct": `${pos * 100}%` } as CSSProperties}
      onChange={(e) => onChange(niceRound(fromPos(Number(e.target.value) / 1000, min, max)))}
    />
  );
}

function NumberInput({ value, min, max, label, onChange }: SliderProps) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      className="num-input"
      inputMode="numeric"
      aria-label={label}
      value={draft ?? String(value)}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 7);
        setDraft(digits);
        const n = Number(digits);
        if (digits && n >= min && n <= max) onChange(n);
      }}
      onBlur={() => {
        const n = Number(draft);
        if (draft !== null && draft !== "") onChange(Math.min(max, Math.max(min, n)));
        setDraft(null);
      }}
    />
  );
}

export default function Calculator() {
  // Step 1 — the three answers
  const [offer, setOffer] = useState<Offer>("Coaching");
  const [list, setList] = useState(2500);
  const [price, setPrice] = useState(1500);
  const [sym, setSym] = useState<(typeof CURRENCIES)[number]>("$");

  // Step 2 — pressing Calculate reveals the number; from then on it follows the answers live
  const [calculated, setCalculated] = useState(false);
  // Step 3 — unlocked with a name + email
  const [lead, setLead] = useState<{ name: string; email: string } | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  const snap = calculated ? { offer, list, price, sym } : null;

  const calculate = () => {
    setCalculated(true);
    // On stacked (mobile) layouts the result sits below the questions, so bring it into view.
    if (window.matchMedia("(max-width: 960px)").matches) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const unlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    setLead({ name, email });
    setTimeout(() => rangeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

    // Save the lead to the sheet. The visitor never waits on this or sees an error from it.
    const params = new URLSearchParams(window.location.search);
    const source = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => (params.get(k) ? `${k.slice(4)}=${params.get(k)}` : ""))
      .filter(Boolean)
      .join(" ");
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name,
        email,
        company: String(fd.get("company") || ""), // hidden spam-trap: real people leave it empty
        offer,
        list,
        price,
        currency: sym,
        floorYearly: yearly(list, price, BENCHMARK.rate),
        floorMonthly: monthly(list, price, BENCHMARK.rate),
        page: window.location.pathname,
        source: source || document.referrer.slice(0, 160),
        consent: true,
      }),
    }).catch(() => {});
  };

  const showRange = () => rangeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const s = snap?.sym ?? sym;
  const benchmarkYear = snap ? yearly(snap.list, snap.price, BENCHMARK.rate) : 0;
  const benchmarkMonth = snap ? monthly(snap.list, snap.price, BENCHMARK.rate) : 0;

  const mailto = (() => {
    if (!snap || !lead) return `mailto:${EMAIL}`;
    const line = (l: (typeof LEVELS)[number]) =>
      `${l.name}: ${money(yearly(snap.list, snap.price, l.rate), s)} a year, ${money(monthly(snap.list, snap.price, l.rate), s)} a month`;
    const body = [
      "Hi,",
      "",
      "I ran your email revenue calculator and would like these numbers in writing.",
      "",
      `What I sell: ${snap.offer}`,
      `Subscribers: ${count(snap.list)}`,
      `Main offer price: ${money(snap.price, s)}`,
      "",
      ...LEVELS.map(line),
      "",
      "Can we talk about how to get from the bare minimum to the top level?",
      "",
      lead.name,
      lead.email,
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent("My email revenue numbers")}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <>
      <div className="calc2">
        {/* ---------- left: the three questions ---------- */}
        <div className="calc2-left">
          <div className="q2" id="q1">
            <h3 className="q2-title">
              <span className="q2-num">01</span> What do you sell?
            </h3>
            <div className="chips">
              {OFFERS.map((o) => (
                <button key={o} type="button" className="chip" aria-pressed={offer === o} onClick={() => setOffer(o)}>
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div className="q2">
            <div className="q2-head">
              <div>
                <h3 className="q2-title">
                  <span className="q2-num">02</span> How many people are on your email list?
                </h3>
              </div>
              <label className="field">
                <NumberInput value={list} min={LIST.min} max={LIST.max} label="Email list size" onChange={setList} />
                <span className="field-unit">subs</span>
              </label>
            </div>
            <LogSlider value={list} min={LIST.min} max={LIST.max} label="Email list size" onChange={setList} />
            <div className="ticks">{LIST.ticks.map((t) => <span key={t}>{t}</span>)}</div>
          </div>

          <div className="q2">
            <div className="q2-head">
              <div>
                <h3 className="q2-title">
                  <span className="q2-num">03</span> What&apos;s your main offer worth?
                </h3>
              </div>
              <div className="field">
                <select
                  className="field-select"
                  aria-label="Currency"
                  value={sym}
                  onChange={(e) => setSym(e.target.value as (typeof CURRENCIES)[number])}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <NumberInput value={price} min={PRICE.min} max={PRICE.max} label="Offer price" onChange={setPrice} />
              </div>
            </div>
            <LogSlider value={price} min={PRICE.min} max={PRICE.max} label="Offer price" onChange={setPrice} />
            <div className="ticks">{PRICE.ticks.map((t) => <span key={t}>{sym}{t}</span>)}</div>
          </div>

          <div className="calc2-action">
            <button type="button" className="btn btn-pink btn-lg" onClick={calculate}>
              Calculate my email revenue <span aria-hidden>→</span>
            </button>
          </div>
        </div>

        {/* ---------- right: the bare-minimum number ---------- */}
        <div className="result" ref={resultRef} aria-live="polite">
          <p className="mono-label rose">
            Your <u>bare-minimum</u> email revenue
          </p>

          {snap ? (
            <>
              <p className="result-num">
                {money(benchmarkYear, s)} <span>a year</span>
              </p>
              <p className="result-copy">With the basics in place, your list could generate this much over a year.</p>
              <p className="result-month">
                That&apos;s about <b>{money(benchmarkMonth, s)} a month</b>, from the list you already have.
              </p>
              <p className="result-floor">But this is the floor. Want to see the ceiling?</p>

              {lead ? (
                <div className="gate gate-open">
                  <p>
                    Unlocked{lead.name ? `, ${lead.name}` : ""}. The full range below follows your answers, so keep
                    moving the sliders.
                  </p>
                  <button type="button" className="btn btn-pink btn-sm" onClick={showRange}>
                    See my full range <span aria-hidden>↓</span>
                  </button>
                </div>
              ) : (
                <form className="gate" onSubmit={unlock}>
                  <h4>Want to see the full potential of your list?</h4>
                  <p>See how much you can realistically make if you do emails right!</p>
                  <div className="gate-fields">
                    <input name="name" placeholder="First name" autoComplete="given-name" required />
                    <input name="email" type="email" placeholder="Email" autoComplete="email" required />
                  </div>
                  <div className="hp" aria-hidden>
                    <label>
                      Company <input name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-pink btn-block">
                    Show me my full potential <span aria-hidden>→</span>
                  </button>
                  <small className="gate-consent">
                    By continuing, you agree to get emails from Zero Noise. Unsubscribe any time.
                  </small>
                </form>
              )}
            </>
          ) : (
            <>
              <p className="result-num result-empty">
                $<span>—</span>
              </p>
              <p className="result-copy">
                Here&apos;s how much your emails should be making you <b>AT LEAST!</b>
              </p>
            </>
          )}
        </div>
      </div>

      {/* ---------- the full range, once unlocked ---------- */}
      {snap && lead && (
        <div className="range" id="range" ref={rangeRef}>
          <h3 className="range-title">Your list could be worth more than you think.</h3>
          <p className="range-sub">See what changes as your email system gets stronger.</p>

          <div className="levels">
            {LEVELS.map((l) => (
              <article key={l.id} className={`level${l.id === BENCHMARK.id ? " level-hi" : ""}`}>
                <h4 className="level-name">
                  {l.name}
                  {l.emoji && (
                    <span className="level-emoji" aria-hidden>
                      {" "}
                      {l.emoji}
                    </span>
                  )}
                </h4>
                <p className="level-year">{money(yearly(snap.list, snap.price, l.rate), s)} a year</p>
                <p className="level-month">{money(monthly(snap.list, snap.price, l.rate), s)} a month</p>
                <p className="level-tagline">{l.tagline}</p>
                <p className="level-desc">{l.desc}</p>
              </article>
            ))}
          </div>

          <div className="writing">
            <div className="writing-copy">
              <b>Want to reach your email&apos;s full potential?</b>
              <p>Tell us a little more about your business, and we&apos;ll show you what to prioritize to get there.</p>
            </div>
            <div className="writing-actions">
              <a href={mailto} className="btn btn-line btn-sm">
                Just email me these numbers
              </a>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-pink btn-sm">
                Book a free {CALL_MINUTES}-min call <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* the CTA the brief asks for once they've seen the range */}
          <div className="proof">
            <figure className="proof-video">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/work/beccy-testimonial-poster.jpg"
                aria-label="Beccy, a client, talks about working with us"
              >
                <source src="/work/beccy-testimonial.mp4" type="video/mp4" />
                Your browser can&apos;t play this video.
              </video>
            </figure>
            <div className="proof-copy">
              <h4>We&apos;ve worked with lists as small as 50 and as big as thousands.</h4>
              <p>Listen to what Beccy, one of our clients, has to say.</p>
              <BookCard />
            </div>
          </div>

          <div className="offer">
            <div>
              <p className="offer-eyebrow">Want to get serious about email?</p>
              <h4>
                Your Email Growth Blueprint — {money(BLUEPRINT_OFFER.price)} <s>{money(BLUEPRINT_OFFER.was)}</s>
              </h4>
              <p>
                Get a detailed audit and a clear 90-day plan for what to build, fix and send, based on your business,
                offers and audience.
              </p>
              <p className="offer-window">For just {BLUEPRINT_OFFER.window}</p>
            </div>
            <a href={BLUEPRINT_URL} target="_blank" rel="noopener noreferrer" className="btn btn-pink btn-lg">
              Get my 90-day plan <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
