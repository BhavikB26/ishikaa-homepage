"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/site";

const LINKS = [
  ["Calculator", "#calculator"],
  ["Services", "#services"],
  ["Work", "#work"],
  ["FAQ", "#faq"],
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " nav-scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Zero Noise — Ishikaa and Dikshika">
          <i aria-hidden />
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
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm">
          Book a call <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
