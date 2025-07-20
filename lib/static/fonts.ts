import { Instrument_Sans } from "next/font/google";
import ClashGroteskVariable from "next/font/local";

export const mainFont = Instrument_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const titleFont = ClashGroteskVariable({
  src: "../../public/fonts/ClashGrotesk-Variable.woff2",
});
