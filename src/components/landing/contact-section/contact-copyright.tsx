import { COPYRIGHT_TEXT } from "./constants";

/** Copyright footer centered at the bottom of the contact image */
export function ContactCopyright() {
  return (
    <div className="absolute bottom-34 left-0 z-20 w-full text-center md:bottom-16">
      <span className="font-mono text-[10px] tracking-widest text-white uppercase sm:text-xs">
        {COPYRIGHT_TEXT}
      </span>
    </div>
  );
}
