"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOKING_URL } from "@/lib/site";

const LINKS = [
  ["Calculator", "#calculator"],
  ["Services", "#services"],
  ["Work", "#work"],
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The menu only exists on narrower screens: close it on Escape, on a tap outside, and when the
  // screen grows past the breakpoint (e.g. a tablet rotating to landscape).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) close();
    };
    const mq = window.matchMedia("(min-width: 961px)");
    const onMq = () => mq.matches && close();
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <header ref={headerRef} className={`nav${scrolled || open ? " nav-scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Zero Noise — Ishikaa and Dikshika">
          <span>
            <b>Zero Noise</b>
            <small>Ishikaa · Dikshika</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {/* on phones this shrinks to a round calendar icon; the full button lives at the end of the menu */}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark btn-sm nav-cta"
            aria-label="Book a call"
          >
            <span className="btn-label">Book a call</span>
            <span aria-hidden className="btn-arrow">→</span>
            <svg aria-hidden className="btn-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
              <path d="M3.5 10h17M8 3v4M16 3v4M9.2 15.2l2 2 3.8-4" />
            </svg>
          </a>
          <button
            ref={buttonRef}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className="nav-toggle-bars" />
          </button>
        </div>
      </div>

      <nav id="nav-menu" className="nav-menu" aria-label="Menu" hidden={!open}>
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} onClick={() => close()}>
            {label}
          </a>
        ))}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark menu-cta"
          onClick={() => close()}
        >
          Book a call <span aria-hidden>→</span>
        </a>
      </nav>
    </header>
  );
}
