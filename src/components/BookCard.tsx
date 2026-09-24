import { BOOKING_URL, CALL_MINUTES } from "@/lib/site";

// Booking card in the style of the "Video meeting · mins / title / FREE →" reference.
export default function BookCard({ className = "" }: { className?: string }) {
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={`bookcard ${className}`}>
      <span className="bookcard-body">
        <span className="bookcard-meta">Video meeting · {CALL_MINUTES} mins</span>
        <strong>Start making money from your list</strong>
        <span className="bookcard-text">Book a free {CALL_MINUTES}-min call with us</span>
      </span>
      <span className="bookcard-foot">
        <b>FREE</b>
        <span className="bookcard-go" aria-hidden>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </span>
    </a>
  );
}
