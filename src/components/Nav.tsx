"use client";

import { useEffect, useState } from "react";

const LINKS = [
  ["Services", "#services"],
  ["Calculator", "#calculator"],
  ["How it works", "#how"],
  ["About", "#about"],
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
        <a href="#top" className="logo">
          ishikaa<span>.</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn btn-dark btn-sm">
          Book a call
        </a>
      </div>
    </header>
  );
}
