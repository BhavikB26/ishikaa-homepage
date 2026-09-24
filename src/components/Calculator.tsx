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
  pct,
  toPos,
  yearly,
  type Offer,
  type Snapshot,
} from "@/lib/calc";
import { BLUEPRINT_OFFER, BOOKING_URL, CALL_MINUTES, EMAIL } from "@/lib/site";

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

  // Step 2 — the first result (locked to the answers at the moment "Calculate" was pressed)
  const [snap, setSnap] = useState<Snapshot | null>(null);
  // Step 3 — unlocked with a name + email; stays unlocked so answers can be re-run
  const [lead, setLead] = useState<{ name: string; email: string } | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  const dirty = !!snap && (snap.offer !== offer || snap.list !== list || snap.price !== price || snap.sym !== sym);

  const calculate = () => {
    setSnap({ offer, list, price, sym });
    // On stacked (mobile) layouts the result sits below the questions, so bring it into view.
    if (window.matchMedia("(max-width: 960px)").matches) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const unlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLead({ name: String(fd.get("name") || "").trim(), email: String(fd.get("email") || "").trim() });
    setTimeout(() => rangeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const showRange = () => rangeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const s = snap?.sym ?? sym;
  const benchmarkYear = snap ? yearly(snap.list, snap.price, BENCHMARK.rate) : 0;
  const benchmarkMonth = snap ? monthly(snap.list, snap.price, BENCHMARK.rate) : 0;

  const mailto = (() => {
    if (!snap || !lead) return `mailto:${EMAIL}`;
    const line = (l: (typeof LEVELS)[number]) =>
      `${l.name} (${pct(l.rate)}): ${money(yearly(snap.list, snap.price, l.rate), s)} a year, ${money(monthly(snap.list, snap.price, l.rate), s)} a month`;
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
      "Can we talk about which level is realistic for me this year?",
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
                <p className="q2-hint">Everyone on it, quiet ones included</p>
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
                  <span className="q2-num">03</span> What&apos;s the price of your main offer?
                </h3>
                <p className="q2-hint">A round figure is fine</p>
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
            {dirty && <p className="dirty">Answers changed — calculate again to update the numbers.</p>}
          </div>
        </div>

        {/* ---------- right: the first result ---------- */}
        <div className="result" ref={resultRef} aria-live="polite">
          <p className="mono-label rose">Your email revenue benchmark</p>

          {snap ? (
            <>
              <p className="result-num">
                {money(benchmarkYear, s)} <span>a year</span>
              </p>
              <p className="result-copy">
                If it&apos;s set up right, your email system should be generating this much from the list and offer you
                already have.
              </p>
              <p className="formula">
                {count(snap.list)} subscribers × <b>{pct(BENCHMARK.rate)} buyer rate</b> × {money(snap.price, s)} offer
              </p>
              <p className="result-month">
                That&apos;s about <b>{money(benchmarkMonth, s)} a month</b>, from the list you already have.
              </p>

              {lead ? (
                <div className="gate gate-open">
                  <p>
                    Unlocked{lead.name ? `, ${lead.name}` : ""}. Change an answer here and reopen it to see the new
                    range.
                  </p>
                  <button type="button" className="btn btn-pink btn-sm" onClick={showRange}>
                    Show my full potential again <span aria-hidden>→</span>
                  </button>
                </div>
              ) : (
                <form className="gate" onSubmit={unlock}>
                  <h4>Curious what the full range looks like?</h4>
                  <p>See what your list could generate with a basic, solid, or highly optimized email system.</p>
                  <div className="gate-fields">
                    <input name="name" placeholder="First name" autoComplete="given-name" required />
                    <input name="email" type="email" placeholder="Email" autoComplete="email" required />
                  </div>
                  <button type="submit" className="btn btn-pink btn-block">
                    Show me my full potential <span aria-hidden>→</span>
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <p className="result-num result-empty">
                $<span>—</span>
              </p>
              <p className="result-copy">
                Answer the three questions, then calculate. Your benchmark shows up here — no email needed.
              </p>
              <p className="formula formula-empty">subscribers × buyer rate × offer price</p>
            </>
          )}
        </div>
      </div>

      {/* ---------- the full range, once unlocked ---------- */}
      {snap && lead && (
        <div className="range" id="range" ref={rangeRef}>
          <h3 className="range-title">Here&apos;s what your list could generate.</h3>
          <p className="range-sub">Yearly and monthly · from the answers you gave</p>

          <div className="levels">
            {LEVELS.map((l) => (
              <article key={l.id} className={`level${l.id === BENCHMARK.id ? " level-solid" : ""}`}>
                <div className="level-head">
                  <p className="level-label">
                    {l.n} — {l.name}
                  </p>
                  {l.id === BENCHMARK.id && <em className="level-badge">Your benchmark</em>}
                </div>
                <p className="level-rate">{pct(l.rate)}</p>
                <p className="level-year">{money(yearly(snap.list, snap.price, l.rate), s)} a year</p>
                <p className="level-month">{money(monthly(snap.list, snap.price, l.rate), s)} a month</p>
                <h4>{l.tagline}</h4>
                <ul>
                  {l.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <p className="level-note">{l.note}</p>
              </article>
            ))}
          </div>

          <div className="writing">
            <p>
              Want these numbers in writing? I&apos;ll send them over, then we can talk about which level is realistic
              for you this year.
            </p>
            <div className="writing-actions">
              <a href={mailto} className="btn btn-line btn-sm">
                Email me these numbers
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
              <p className="offer-eyebrow">Or start smaller</p>
              <h4>
                Your Email Growth Blueprint — {money(BLUEPRINT_OFFER.price)}{" "}
                <s>instead of {money(BLUEPRINT_OFFER.was)}</s>
              </h4>
              <p>
                There&apos;s always a villain and a hero in the story. The villain in your email success story could be
                your deliverability or your emails; the hero is always the strategy and blueprint. We can pinpoint
                exactly what you should do to get that revenue.
              </p>
              <p className="offer-window">For just {BLUEPRINT_OFFER.window}</p>
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-pink btn-lg">
              Book a call <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
