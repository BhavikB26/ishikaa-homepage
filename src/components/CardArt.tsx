// Flat, hand-drawn-style props that pop out of the closing cards.
const INK = "#171717";
const ROSE = "#d9416f";
const PINK = "#ff6e99";
const BLUSH = "#faeded";

const base = {
  viewBox: "0 0 160 160",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
} as const;

export function CalendarArt() {
  const cols = [34, 62, 90, 118];
  return (
    <svg {...base}>
      <g transform="rotate(-6 80 84)" strokeLinejoin="round" strokeLinecap="round">
        <rect x="18" y="30" width="124" height="108" rx="14" fill="#fff" stroke={INK} strokeWidth="3" />
        <path d="M18 44a14 14 0 0 1 14-14h96a14 14 0 0 1 14 14v22H18z" fill={ROSE} stroke={INK} strokeWidth="3" />
        <rect x="44" y="17" width="10" height="26" rx="5" fill={INK} />
        <rect x="106" y="17" width="10" height="26" rx="5" fill={INK} />
        {[80, 104].flatMap((y) =>
          cols.map((x) => {
            const hit = x === 90 && y === 104;
            return (
              <rect key={`${x}-${y}`} x={x - 8} y={y} width="17" height="17" rx="5" fill={hit ? PINK : BLUSH} stroke={INK} strokeWidth={hit ? 2.5 : 0} />
            );
          }),
        )}
        <path d="M86 113l4 4 8-9" stroke={INK} strokeWidth="2.6" />
      </g>
    </svg>
  );
}

export function CalculatorArt() {
  const rows = [70, 93, 116];
  const cols = [42, 68, 94];
  return (
    <svg {...base}>
      <g transform="rotate(5 80 84)" strokeLinejoin="round" strokeLinecap="round">
        <rect x="30" y="12" width="100" height="140" rx="16" fill={INK} />
        <rect x="42" y="25" width="76" height="34" rx="8" fill={BLUSH} />
        <text
          x="110"
          y="49"
          textAnchor="end"
          fontSize="21"
          fontWeight="600"
          fill={ROSE}
          style={{ fontFamily: "var(--display)", letterSpacing: "-0.03em" }}
        >
          $19k
        </text>
        {rows.flatMap((y) =>
          cols.map((x) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="24" height="17" rx="6" fill={x === 94 ? PINK : "#fff"} />
          )),
        )}
      </g>
    </svg>
  );
}

export function EnvelopeArt() {
  return (
    <svg {...base}>
      <g transform="rotate(-5 80 88)" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M80 50c-18-12-24-27-13-33 6-3 13 0 13 7 0-7 7-10 13-7 11 6 5 21-13 33z"
          fill={PINK}
          stroke={INK}
          strokeWidth="3"
          transform="translate(0 2)"
        />
        <rect x="16" y="52" width="128" height="92" rx="12" fill={BLUSH} stroke={INK} strokeWidth="3" />
        <path d="M18 60l62 44 62-44" stroke={INK} strokeWidth="3" />
        <path d="M18 138l46-38M142 138l-46-38" stroke={INK} strokeWidth="2.4" />
      </g>
    </svg>
  );
}
