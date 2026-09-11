import {
  DM_Mono,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Press_Start_2P,
} from "next/font/google";
import localFont from "next/font/local";

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

const fontJetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  fallback: ["system-ui", "arial"],
});

const fontPressStart2P = Press_Start_2P({
  subsets: ["latin"],
  variable: "--font-press-start",
  weight: "400",
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

const fontGreedStandard = localFont({
  src: "../../public/fonts/GreedStandard-Medium.otf",
  variable: "--font-greed",
  fallback: ["system-ui", "arial"],
});

export const fonts = [
  fontSans.variable,
  fontMono.variable,
  fontPressStart2P.variable,
  fontInstrument.variable,
  fontJetBrains.variable,
  fontDmMono.variable,
  fontGreedStandard.variable,
];
