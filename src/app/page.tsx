import type { CSSProperties } from "react";
import Image from "next/image";
import { CalculatorArt, CalendarArt, EnvelopeArt } from "@/components/CardArt";
import Calculator from "@/components/Calculator";
import Faq from "@/components/Faq";
import Nav from "@/components/Nav";

// TODO: swap for the real booking link (Calendly, Cal.com, etc.)
const BOOKING_URL = "#";
const EMAIL = "hello.ishikaa@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/ishikaa-jain/";

const SEQUENCE = [
  { day: "Day 0", subject: "You're in — here's what happens next", tag: "welcome", note: "Sent the second they sign up" },
  { day: "Day 2", subject: "The one question I ask every new client", tag: "nurture", note: "Builds trust with a story" },
  { day: "Day 4", subject: "What changed for Priya in 6 weeks", tag: "nurture", note: "Proof, without the hard sell", hi: true },
  { day: "Day 7", subject: "3 spots left for October — want one?", tag: "sales", note: "A clear, timely invitation" },
];

const AUDIENCES = ["Coaches", "Consultants", "Course creators", "Membership owners", "Service providers"];

const STATS = [
  {
    value: "41",
    unit: "%",
    text: "of email revenue comes from automated emails, even though they're only about 5% of what gets sent.",
    source: "Klaviyo benchmarks",
  },
  {
    value: "13",
    unit: "×",
    text: "Automated emails convert about 13 times better than one-off newsletters: 2.11% vs 0.16%.",
    source: "Klaviyo benchmarks",
  },
  {
    value: "5.8",
    unit: "%",
    text: "of members cancel every month on average. Good onboarding and check-in emails help keep them longer.",
    source: "RetentionCheck, membership communities",
  },
];

const SERVICES = [
  {
    eyebrow: "Start here",
    title: "Email audit & strategy",
    blurb: "A clear look at what you're sending now, and the plan to fix it.",
    points: ["List health and engagement review", "Gaps in your sequences, ranked by revenue", "A 90-day email plan"],
    for: "For: anyone with a list who isn't sure what's working",
  },
  {
    eyebrow: "Most requested",
    title: "Sequences that sell",
    blurb: "Automated emails that welcome, warm up and convert new subscribers on their own.",
    points: ["Welcome + nurture sequence", "Sales or launch sequence for your offer", "Set up and tested in your email platform"],
    for: "For: coaches and consultants selling calls or programmes",
    featured: true,
  },
  {
    eyebrow: "Ongoing",
    title: "Newsletter management",
    blurb: "A steady weekly email in your voice, planned, written and sent for you.",
    points: ["Monthly content calendar", "Weekly emails written and scheduled", "Monthly results report"],
    for: "For: membership owners and busy service providers",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Free call",
    text: "We go through your offer, your list and your numbers from the calculator. If email isn't your bottleneck, I'll tell you.",
    when: "30 min",
  },
  {
    n: "02",
    title: "Audit & plan",
    text: "I review what you send today and map the sequences worth building first, in order of the revenue they can bring in.",
    when: "Week 1",
  },
  {
    n: "03",
    title: "Write & build",
    text: "I write every email in your voice and set it up in your platform, including triggers, tags and tests. You approve before anything goes live.",
    when: "Weeks 2–4",
  },
  {
    n: "04",
    title: "Launch & improve",
    text: "We go live, watch opens, clicks and bookings, then improve subject lines and offers based on real numbers.",
    when: "Ongoing",
  },
];

const SLOTS = [
  {
    eyebrow: "Case study slot",
    title: "[Client name · type of business]",
    text: "Before → after: e.g. open rate, booked calls or sales from one sequence. Use real numbers only.",
  },
  {
    eyebrow: "Testimonial slot",
    title: "[Short quote from a real client]",
    text: "One or two sentences, with their name, role and photo.",
  },
  {
    eyebrow: "Sample work slot",
    title: "[Link or screenshot of an email you wrote]",
    text: "A welcome or sales email that shows your voice. It can be a practice piece if it's labelled as one.",
  },
];

const CONTACT_CARDS = [
  {
    tone: "pink",
    tag: "Free · 30 min",
    title: "Book a free call",
    status: "Now booking",
    cta: "Book now",
    href: BOOKING_URL,
    Art: CalendarArt,
  },
  {
    tone: "yellow",
    tag: "About 60 seconds",
    title: "Try the calculator",
    status: "No email needed",
    cta: "Try it",
    href: "#calculator",
    Art: CalculatorArt,
  },
  {
    tone: "ink",
    tag: "Questions first?",
    title: "Say hello",
    status: "Send me an email",
    cta: "Email me",
    href: `mailto:${EMAIL}`,
    Art: EnvelopeArt,
  },
] as const;

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <p className="badge">
                <i aria-hidden /> Now booking founding clients
              </p>
              <h1>
                Emails that turn <br className="br-d" />
                your list into <br className="br-d" />
                <em>booked calls.</em>
              </h1>
              <p className="lede">
                I&apos;m Ishikaa, an email marketer for coaches, consultants and membership owners. I write and automate
                the welcome, nurture and sales emails that keep selling while you&apos;re busy with clients.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-dark btn-lg">
                  <i className="dot" aria-hidden /> Book a free 30-min call
                </a>
                <a href="#calculator" className="link-underline">
                  See what your list could earn <span aria-hidden>↓</span>
                </a>
              </div>
            </div>

            <aside className="inbox" aria-label="Sample email sequence">
              <div className="inbox-head">
                <span>Inbox · your new subscriber</span>
                <b>sample sequence</b>
              </div>
              {SEQUENCE.map((m) => (
                <div key={m.day} className={`mail${m.hi ? " mail-hi" : ""}`}>
                  <span className="mail-day">{m.day}</span>
                  <div>
                    <p className="mail-subject">{m.subject}</p>
                    <p className="mail-meta">
                      <b className={`tag tag-${m.tag}`}>{m.tag}</b> {m.note}
                    </p>
                  </div>
                </div>
              ))}
              <div className="inbox-foot">Written once · runs for every new subscriber</div>
            </aside>
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

        {/* Why email */}
        <section className="section why">
          <div className="wrap">
            <p className="eyebrow">Why email</p>
            <h2>
              Your list is the one <br className="br-d" />
              audience you <em>own.</em>
            </h2>
            <p className="section-lede">
              Social reach comes and goes with the algorithm. Your subscribers already raised their hand, and most
              businesses email them far less well than they could.
            </p>
            <div className="stats">
              {STATS.map((s) => (
                <div key={s.text} className="stat">
                  <p className="stat-num">
                    {s.value}
                    <span>{s.unit}</span>
                  </p>
                  <p className="stat-text">{s.text}</p>
                  <p className="stat-src">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="section tint">
          <div className="wrap">
            <p className="eyebrow">Services</p>
            <h2>
              Three ways to make your <br className="br-d" />
              emails bring in clients.
            </h2>
            <div className="services">
              {SERVICES.map((s) => (
                <article key={s.title} className={`service${s.featured ? " service-dark" : ""}`}>
                  <p className="service-eyebrow">{s.eyebrow}</p>
                  <h3>{s.title}</h3>
                  <p className="service-blurb">{s.blurb}</p>
                  <ul>
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <p className="service-for">{s.for}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="section">
          <div className="wrap">
            <p className="eyebrow">Free calculator · about 60 seconds</p>
            <h2 className="h2-sm">
              How much should your email list <em>really</em> be making you?
            </h2>
            <p className="section-lede">
              Answer five quick questions and your result updates as you go. You don&apos;t need to give your email to
              see it.
            </p>
            <Calculator />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="section how">
          <div className="wrap">
            <p className="eyebrow">How it works</p>
            <h2>
              From first call to emails <br className="br-d" />
              that send themselves.
            </h2>
            <ol className="steps">
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className="step-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="step-when">{s.when}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* About */}
        <section id="about" className="section tint">
          <div className="wrap about">
            <div className="portrait">
              <Image src="/ishikaa-cutout.png" alt="Ishikaa" width={900} height={948} priority={false} />
            </div>
            <div>
              <p className="eyebrow">About</p>
              <h2 className="h2-md">
                Hi, I&apos;m Ishikaa. I write emails <br className="br-d" />
                people actually want to open.
              </h2>
              <p className="about-p">
                [Placeholder: add 2–3 lines about Ishikaa&apos;s background: where she&apos;s worked, what she&apos;s
                written, and why she chose email for coaches and service businesses.]
              </p>
              <p className="about-p">
                My approach is simple: fewer, better emails, sent consistently, each with one clear next step. No spam
                tactics or fake urgency, just emails that sound like you and bring in bookings.
              </p>
              <ul className="pills">
                <li>Your voice, not a template</li>
                <li>One clear ask per email</li>
                <li>Measured by bookings, not opens</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="section results">
          <div className="wrap">
            <p className="eyebrow">Results</p>
            <h2>Client stories are on the way.</h2>
            <p className="section-lede">
              I&apos;m taking on my first clients now. Their results will go here, with their permission.
            </p>
            <div className="slots">
              {SLOTS.map((s) => (
                <article key={s.eyebrow} className="slot">
                  <p className="service-eyebrow">{s.eyebrow}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section faq-section">
          <div className="wrap">
            <p className="eyebrow">FAQ</p>
            <h2>Good questions, answered.</h2>
            <Faq />
          </div>
        </section>

        {/* Closing CTA */}
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
                  Book a free 30-minute call. Bring your calculator numbers, and you&apos;ll leave with the first
                  sequence worth building, even if you don&apos;t hire me.
                </p>
                <a href={BOOKING_URL} className="btn btn-dark btn-lg">
                  <i className="dot" aria-hidden /> Book a free 30-min call
                </a>
              </div>
              <div className="stack" role="group" aria-label="Ways to get in touch">
                {CONTACT_CARDS.map(({ tone, tag, title, status, cta, href, Art }, i) => (
                  <a
                    key={tone}
                    href={href}
                    className={`scard scard-${tone}`}
                    style={{ "--i": i } as CSSProperties}
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
          <a href="#top" className="logo">
            ishikaa<span>.</span>
          </a>
          <nav aria-label="Footer">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="#calculator">Calculator</a>
          </nav>
          <p>© 2026 Ishikaa Jain</p>
        </div>
      </footer>
    </>
  );
}
