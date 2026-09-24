import type { Metadata } from "next";

// The calculator page, also reachable at /calculator so it can live at makezeronoise.com/calculator.
export { default } from "../page";

export const metadata: Metadata = {
  alternates: { canonical: "https://makezeronoise.com/calculator" },
};
