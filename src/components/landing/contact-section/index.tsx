"use client";

import { ContactCopyright } from "./contact-copyright";
import { ContactHeader } from "./contact-header";
import { ContactImage } from "./contact-image";
import { ContactLinks } from "./contact-links";

export function ContactSection() {
  return (
    <section
      className="relative w-full bg-[#7F9FFF] md:p-12 lg:p-20"
      id="contact"
    >
      <div className="mx-auto max-w-[1400px]">
        <ContactHeader />

        <div className="relative mx-auto w-full max-md:h-[600px] max-md:pl-8 md:p-8">
          <ContactImage />
          <ContactLinks />
          <ContactCopyright />
        </div>
      </div>
    </section>
  );
}
