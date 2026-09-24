import type { CSSProperties } from "react";
import BookCard from "@/components/BookCard";
import Calculator from "@/components/Calculator";
import { CalculatorArt, CalendarArt, EnvelopeArt } from "@/components/CardArt";
import Nav from "@/components/Nav";
import WorkGallery from "@/components/WorkGallery";
import { BOOKING_URL, CALL_MINUTES, DESIGNER, LINKEDIN_URL, SUBJECT_LINES_URL } from "@/lib/site";

const AUDIENCES = ["Coaches", "Consultants", "Course creators", "Membership owners", "Service providers"];

const SERVICES = [
  {
    n: "1",
    kicker: "We plan, you build it",
    title: "Email Growth Blueprint",
    body: "We work out what your email system needs. You build it.",
    yours: { label: "High", pct: 80 },
    mine: "Strategy + direction",
    points: ["A strategy built around your business", "Flow outlines for every sequence", "A 90-day roadmap to start on"],
  },
  {
    n: "2",
    kicker: "We build it together",
    title: "Email Growth Intensive",
    body: "You keep your hands on the emails; I keep you on the shortest path to a list that sells.",
    yours: { label: "Shared", pct: 50 },
    mine: "Strategy + feedback",
    points: ["10 days, 4 calls", "Audit, plan, review, keep growing", "Feedback on every email"],
    badge: "Most picked",
  },
  {
    n: "3",
    kicker: "I build it for you",
    title: "Done For You",
    body: "Off your plate: I write it, build it, send it and report on it.",
    yours: { label: "Approvals", pct: 15 },
    mine: "End-to-end",
    points: ["Welcome, nurture, sales and launch emails", "Monthly emails written and scheduled", "Reporting on every send"],
  },
] as const;

const CONTACT_CARDS = [
  {
    tone: "pink",
    tag: `Free · ${CALL_MINUTES} min`,
    title: "Book a free call",
    status: "Now booking",
    cta: "Book now",
    href: BOOKING_URL,
    external: true,
    Art: CalendarArt,
  },
  {
    tone: "yellow",
    tag: "About 60 seconds",
    title: "Try the calculator",
    status: "No email needed",
    cta: "Try it",
    href: "#calculator",
    external: false,
    Art: CalculatorArt,
  },
  {
    tone: "ink",
    tag: "Free resource",
    title: "Free subject lines",
    status: "makezeronoise.com",
    cta: "Download",
    href: SUBJECT_LINES_URL,
    external: true,
    Art: EnvelopeArt,
  },
] as const;

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* Hero — the calculator is the point of the page */}
        <section className="hero2">
          <div className="wrap hero2-inner">
            <p className="badge">
              <i aria-hidden /> Free · 60 seconds · no email needed
            </p>
            <h1>
              <span>How much should your email</span>
              <span>
                list <em>really</em> be making you?
              </span>
            </h1>
          </div>
        </section>

        {/* Built for */}
        <section className="built" aria-label="Who it's for">
          <div className="wrap built-inner">
            <span className="eyebrow">Built for</span>
            <ul>
              {AUDIENCES.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Calculator → full range (email gate) → book a call */}
        <section id="calculator" className="section calc-section">
          <div className="wrap">
            <Calculator />
          </div>
        </section>

        {/* Client stories */}
        <section id="work" className="section work">
          <div className="wrap">
            <p className="eyebrow">Results</p>
            <h2>Straight from their dashboards.</h2>
            <p className="section-lede">
              Screenshots straight from clients&apos; own accounts and inboxes — no redraws, no rounding up. Tap any one
              to see it full size.
            </p>
            <WorkGallery />
            <div className="work-cta">
              <BookCard />
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section">
          <div className="wrap">
            <p className="eyebrow">Services</p>
            <h2>Three ways to close that gap.</h2>
            <p className="section-lede">Three ways in, depending on how much of it you want to do yourself.</p>
            <div className="svcs">
              {SERVICES.map((s) => (
                <article key={s.title} className="svc">
                  <header className="svc-top">
                    <span className="svc-n">{s.n}</span>
                    <span className="svc-kicker">{s.kicker}</span>
                    {"badge" in s && <em className="svc-badge">{s.badge}</em>}
                  </header>
                  <h3>{s.title}</h3>
                  <p className="svc-body">{s.body}</p>

                  <div className="involve">
                    <p>
                      <span>Your involvement</span>
                      <b>{s.yours.label}</b>
                    </p>
                    <div className="meter" style={{ "--fill": `${s.yours.pct}%` } as CSSProperties}>
                      <i />
                    </div>
                    <p>
                      <span>My involvement</span>
                      <b>{s.mine}</b>
                    </p>
                  </div>

                  <ul className="svc-points">
                    {s.points.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm svc-btn">
                    Book a call <span aria-hidden>→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Closing */}
        <section id="contact" className="finale">
          <div className="wrap">
            <div className="finale-top">
              <div className="finale-copy">
                <p className="eyebrow">Let&apos;s talk</p>
                <h2>
                  Your list is already <br className="br-d" />
                  there. Let&apos;s get it <br className="br-d" />
                  bringing in clients.
                </h2>
                <p className="finale-p">
                  Book a free {CALL_MINUTES}-minute call. Bring your calculator numbers and you&apos;ll leave with three
                  strategies worth building and implementing, even if you don&apos;t hire us.
                </p>
              </div>
              <div className="stack" role="group" aria-label="Ways to get in touch">
                {CONTACT_CARDS.map(({ tone, tag, title, status, cta, href, external, Art }, i) => (
                  <a
                    key={tone}
                    href={href}
                    className={`scard scard-${tone}`}
                    style={{ "--i": i } as CSSProperties}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="scard-panel">
                      <span className="scard-tag">{tag}</span>
                      <span className="scard-go" aria-hidden>
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 15L15 5M7 5h8v8" />
                        </svg>
                      </span>
                      <span className="scard-art">
                        <Art />
                      </span>
                    </span>
                    <span className="scard-foot">
                      <span className="scard-name">
                        <strong>{title}</strong>
                        <small>
                          <i aria-hidden /> {status}
                        </small>
                      </span>
                      <span className="scard-btn">{cta}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a href="#top" className="brand brand-sm" aria-label="Zero Noise — back to top">
            <i aria-hidden />
            <span>
              <b>Zero Noise</b>
              <small>Ishikaa · Dikshika</small>
            </span>
          </a>
          <nav aria-label="Footer">
            <a href="#calculator">Calculator</a>
            <a href="#services">Services</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </nav>
          <p>
            © 2026 Zero Noise · Designed by{" "}
            <a href={DESIGNER.url} target="_blank" rel="noopener noreferrer">
              {DESIGNER.name}
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
