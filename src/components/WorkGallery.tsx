"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

// fit: "cover" fills the frame (full dashboards); "contain" shows a cropped chart whole.
const SHOTS = [
  { src: "/work/work-1.png", w: 1920, h: 1200, fit: "cover", chip: "↑ $36,372 gross revenue", title: "$36,372 gross revenue", meta: "Last 30 days · +292% on the month before", alt: "Client dashboard showing $36,372 gross revenue over the last 30 days, up 292%" },
  { src: "/work/work-2.png", w: 1920, h: 1200, fit: "cover", chip: "↑ 4 sales in 27 minutes", title: "4 sales in 27 minutes", meta: "A client's own chat, mid-send", alt: "A client's chat showing +3 sales and +1 sale within 27 minutes" },
  { src: "/work/funnel-211.png", w: 1244, h: 420, fit: "contain", chip: "↑ 53.6% opened", title: "53.6% opened", meta: "211 sent · 10.4% clicked", alt: "Engagement funnel: 211 received, 113 opened (53.6%), 22 clicked (10.4%)" },
  { src: "/work/work-4.png", w: 1920, h: 1200, fit: "cover", chip: "↑ 42.7% open rate", title: "42.7% open rate", meta: "Mini coaching sessions · 335 subscribers", alt: "Email analytics: 42.7% open rate" },
  { src: "/work/funnel-1750.png", w: 1244, h: 420, fit: "contain", chip: "↑ 52.2% opened", title: "52.2% opened", meta: "1,750 sent · 1.7% clicked", alt: "Engagement funnel: 1,750 received, 914 opened (52.2%), 30 clicked (1.7%)" },
  { src: "/work/funnel-3068.png", w: 1244, h: 420, fit: "contain", chip: "↑ 34.3% opened", title: "34.3% opened", meta: "3,068 sent · 1.4% clicked", alt: "Engagement funnel: 3,068 received, 1,051 opened (34.3%), 44 clicked (1.4%)" },
] as const;

export default function WorkGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ moved: false, x: 0, left: 0 });

  // lightbox open/close
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  // track whether the rail is at either end (drives the edge fades + arrow states)
  const measure = useCallback(() => {
    const r = railRef.current;
    if (!r) return;
    setEdge({ start: r.scrollLeft < 8, end: r.scrollLeft + r.clientWidth >= r.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

  const step = (dir: 1 | -1) => {
    const r = railRef.current;
    if (r) r.scrollBy({ left: dir * Math.min(r.clientWidth * 0.86, 520), behavior: smooth() });
  };

  // settle on the card nearest the middle after a mouse drag
  const settle = (r: HTMLDivElement) => {
    const mid = r.scrollLeft + r.clientWidth / 2;
    let best: HTMLElement | null = null;
    let bestDist = Infinity;
    r.querySelectorAll<HTMLElement>(".work-card").forEach((c) => {
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = c;
      }
    });
    const card = best as HTMLElement | null;
    if (card) r.scrollTo({ left: card.offsetLeft - (r.clientWidth - card.offsetWidth) / 2, behavior: smooth() });
  };

  // Touch and trackpads scroll natively. Mouse users get click-and-drag too.
  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = railRef.current;
    if (!r || e.button !== 0) return;
    drag.current = { moved: false, x: e.clientX, left: r.scrollLeft };
    const move = (ev: MouseEvent) => {
      const d = drag.current;
      const dx = ev.clientX - d.x;
      if (!d.moved && Math.abs(dx) > 5) {
        d.moved = true;
        r.classList.add("dragging");
      }
      if (d.moved) r.scrollLeft = d.left - dx;
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      r.classList.remove("dragging");
      if (drag.current.moved) settle(r);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // a drag must not count as a click on the card underneath
  const onClickCapture = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const shot = open !== null ? SHOTS[open] : null;

  return (
    <>
      <div className="rail-wrap">
        <div
          ref={railRef}
          className="rail"
          tabIndex={0}
          role="region"
          aria-label="Client results, scroll sideways"
          onScroll={measure}
          onMouseDown={onMouseDown}
          onClickCapture={onClickCapture}
        >
          {SHOTS.map((s, i) => (
            <button key={s.src} type="button" className="work-card" onClick={() => setOpen(i)} aria-label={`Open full size: ${s.title}`}>
              <span className="work-shot" data-fit={s.fit}>
                <Image src={s.src} alt={s.alt} width={s.w} height={s.h} sizes="(max-width: 720px) 82vw, 480px" draggable={false} />
                <em>{s.chip}</em>
              </span>
              <span className="work-foot">
                <b>{s.title}</b>
                <small>{s.meta}</small>
              </span>
            </button>
          ))}
        </div>
        <span className={`rail-fade l${edge.start ? " off" : ""}`} aria-hidden />
        <span className={`rail-fade r${edge.end ? " off" : ""}`} aria-hidden />
      </div>

      <div className="rail-nav">
        <span className="rail-hint">Drag, scroll or use the arrows</span>
        <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous result">
          ←
        </button>
        <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Next result">
          →
        </button>
      </div>

      <dialog ref={dialogRef} className="lightbox" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        {shot && (
          <figure>
            <Image src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} sizes="90vw" />
            <figcaption>
              <b>{shot.title}</b> <span>{shot.meta}</span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox-x" onClick={() => setOpen(null)} aria-label="Close">
          ×
        </button>
      </dialog>
    </>
  );
}
