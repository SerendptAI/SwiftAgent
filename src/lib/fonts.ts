import {
  DM_Mono,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["system-ui", "arial"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  fallback: ["system-ui", "arial"],
});

const fontInstrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  fallback: ["system-ui", "arial"],
});

const fontDmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  fallback: ["system-ui", "arial"],
});

export const fonts = [
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontDmMono.variable,
];
