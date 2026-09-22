"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import {
  FREQUENCIES,
  LIST,
  OFFERS,
  PRICE,
  RESPONSES,
  calculate,
  fromPos,
  full,
  niceRound,
  pct,
  short,
  toPos,
  type Inputs,
} from "@/lib/calc";

const CURRENCIES = ["$", "£", "€"] as const;

type SliderProps = {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (v: number) => void;
};

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

function NumberInput({
  value,
  min,
  max,
  label,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (v: number) => void;
}) {
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
  const [inputs, setInputs] = useState<Inputs>({
    offer: "coaching",
    list: 2000,
    price: 1500,
    frequency: "monthly",
    response: "some",
  });
  const [sym, setSym] = useState<(typeof CURRENCIES)[number]>("$");
  const [unlocked, setUnlocked] = useState(false);

  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const { now, conservative, optimistic } = calculate(inputs);
  const gainCons = Math.max(0, conservative.revenue - now.revenue);
  const gainOpt = Math.max(0, optimistic.revenue - now.revenue);

  const onUnlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUnlocked(true);
  };

  const locked = unlocked ? "" : " locked";

  return (
    <>
      <div className="calc">
        <div className="calc-left">
          <div className="q">
            <h3 className="q-title">
              <span className="q-num">01</span> What do you sell?
            </h3>
            <div className="chips">
              {OFFERS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className="chip"
                  aria-pressed={inputs.offer === o.id}
                  onClick={() => set("offer", o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="q">
            <div className="q-head">
              <div>
                <h3 className="q-title">
                  <span className="q-num">02</span> How many people are on your email list?
                </h3>
                <p className="q-hint">Everyone, including the quiet ones</p>
              </div>
              <label className="field">
                <NumberInput
                  value={inputs.list}
                  min={LIST.min}
                  max={LIST.max}
                  label="Email list size"
                  onChange={(v) => set("list", v)}
                />
                <span className="field-unit">subs</span>
              </label>
            </div>
            <LogSlider value={inputs.list} min={LIST.min} max={LIST.max} label="Email list size" onChange={(v) => set("list", v)} />
            <div className="ticks">{LIST.ticks.map((t) => <span key={t}>{t}</span>)}</div>
          </div>

          <div className="q">
            <div className="q-head">
              <div>
                <h3 className="q-title">
                  <span className="q-num">03</span> What&apos;s the price of your main offer?
                </h3>
                <p className="q-hint">A round figure is fine</p>
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
                <NumberInput
                  value={inputs.price}
                  min={PRICE.min}
                  max={PRICE.max}
                  label="Offer price"
                  onChange={(v) => set("price", v)}
                />
              </div>
            </div>
            <LogSlider value={inputs.price} min={PRICE.min} max={PRICE.max} label="Offer price" onChange={(v) => set("price", v)} />
            <div className="ticks">{PRICE.ticks.map((t) => <span key={t}>{sym}{t}</span>)}</div>
          </div>

          <div className="q">
            <h3 className="q-title">
              <span className="q-num">04</span> How often do you email your list?
            </h3>
            <div className="chips">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="chip"
                  aria-pressed={inputs.frequency === f.id}
                  onClick={() => set("frequency", f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="q">
            <h3 className="q-title">
              <span className="q-num">05</span> When you email your list, how would you describe the response?
            </h3>
            <div className="opts">
              {RESPONSES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className="opt"
                  aria-pressed={inputs.response === r.id}
                  onClick={() => set("response", r.id)}
                >
                  <span className="opt-title">
                    <span aria-hidden>{r.emoji}</span> {r.title}
                  </span>
                  <span className="opt-sub">{r.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="calc-right" aria-live="polite">
          <p className="mono-label">Right now, email likely brings in</p>
          <p className="now-line">~{full(now.revenue, sym)} a year</p>
          <p className="calc-note">
            About {pct(now.rate)} of your list buying — roughly {now.clients.toLocaleString("en-US")} new{" "}
            {now.clients === 1 ? "client" : "clients"} a year.
          </p>

          <div className="rule" />

          <p className="mono-label">Left on the table each year</p>
          <p className="gain">
            +{short(gainCons, sym)}
            <span> / year</span>
          </p>
          <p className="calc-note">
            Conservatively, from the list you already have. No new offer, no ad spend. The optimistic case is bigger.
          </p>

          <div className="rule" />

          <table className="breakdown">
            <thead>
              <tr>
                <th />
                <th>Now</th>
                <th>Conservative</th>
                <th>Optimistic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Yearly conversion</td>
                <td>{pct(now.rate)}</td>
                <td className={`v${locked}`}>{pct(conservative.rate)}</td>
                <td className={`v${locked}`}>{pct(optimistic.rate)}</td>
              </tr>
              <tr>
                <td>New clients / yr</td>
                <td>{now.clients.toLocaleString("en-US")}</td>
                <td className={`v${locked}`}>{conservative.clients.toLocaleString("en-US")}</td>
                <td className={`v${locked}`}>{optimistic.clients.toLocaleString("en-US")}</td>
              </tr>
              <tr>
                <td>Email revenue / yr</td>
                <td className="strong">{short(now.revenue, sym)}</td>
                <td className={`v strong${locked}`}>{short(conservative.revenue, sym)}</td>
                <td className={`v strong${locked}`}>{short(optimistic.revenue, sym)}</td>
              </tr>
              <tr className="delta">
                <td>vs. today</td>
                <td>—</td>
                <td className={`v${locked}`}>+{short(gainCons, sym)}</td>
                <td className={`v${locked}`}>+{short(gainOpt, sym)}</td>
              </tr>
            </tbody>
          </table>

          {unlocked ? (
            <div className="unlocked">
              <h4>Your full breakdown</h4>
              <p>
                That&apos;s your current, conservative and optimistic year side by side. Bring these numbers to a free
                call and we&apos;ll work out which sequence to build first.
              </p>
            </div>
          ) : (
            <form className="unlock" onSubmit={onUnlock}>
              <h4>Unlock your full breakdown</h4>
              <p>Your current, conservative and optimistic year side by side — and what it would take to get there.</p>
              <div className="unlock-fields">
                <input name="name" placeholder="First name" autoComplete="given-name" required />
                <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
              </div>
              <button type="submit" className="btn btn-pink btn-block">
                Show my full breakdown
              </button>
              <small>I&apos;ll email you a copy too. Unsubscribe any time.</small>
            </form>
          )}
        </div>
      </div>

      <details className="method">
        <summary>How this is worked out</summary>
        <p>
          Today&apos;s revenue is your list size × a yearly buy rate for your response level (nudged for how often you
          send and what you sell) × your offer price. The conservative case assumes a welcome, nurture and sales
          sequence is running: it lifts today&apos;s rate by roughly 1.4–2.6×, depending on where you&apos;re starting.
          The optimistic case goes about 1.6× further. These are planning estimates from typical benchmarks, not
          guarantees.
        </p>
      </details>
    </>
  );
}
