"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Do I need a big list for this to work?",
    a: "No. A few hundred engaged subscribers who hear from you regularly will usually beat a quiet list of thousands. The calculator above shows what your list size can realistically bring in.",
  },
  {
    q: "Which email platforms do you work with?",
    a: "Kit (ConvertKit), Flodesk, MailerLite, Mailchimp and Beehiiv. If you use something else, ask me on the call.",
  },
  {
    q: "Will the emails sound like me?",
    a: "That's the whole point. I start with your content, calls and past emails, and you approve every email before it goes out.",
  },
  {
    q: "How soon will I see results?",
    a: "A welcome sequence starts working as soon as it's live. Nurture and sales sequences usually show a clear trend within 60–90 days, depending on how many new subscribers you get.",
  },
  {
    q: "What does it cost?",
    a: "It depends on the scope. I'll give you a fixed price after our call, so you know the full cost before we start.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="faq-item" data-open={isOpen}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {item.q}
                <span className="faq-icon" aria-hidden>
                  +
                </span>
              </button>
            </h3>
            <div id={`faq-${i}`} className="faq-body" role="region">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
