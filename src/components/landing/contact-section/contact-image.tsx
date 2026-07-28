import Image from "next/image";

/** Responsive hero image — shows a different asset on mobile vs desktop */
export function ContactImage() {
  return (
    <>
      {/* Mobile only — priority load for LCP */}
      <Image
        src="/images/footer.png"
        alt="Street view"
        width={500}
        height={600}
        priority
        className="absolute h-4/5 w-full bg-[#7F9FFF] object-cover object-left md:hidden"
      />

      {/* Desktop only — lazy-loaded so mobile won't fetch it */}
      <Image
        src="/images/contact_img.svg"
        alt="Street view"
        width={500}
        height={500}
        loading="lazy"
        className="hidden h-full w-full bg-[#7F9FFF] object-left md:block"
      />
    </>
  );
}
