import Image from "next/image";

const LOGOS = [
  {
    src: "/images/logos/serendpt.png",
    alt: "Serendpt",
    width: 198,
    height: 32,
  },
  { src: "/images/logos/pxxlapp.png", alt: "Pxxl App", width: 77, height: 77 },
  { src: "/images/logos/black.png", alt: "Black", width: 54, height: 54 },
  {
    src: "/images/logos/seren.guru.png",
    alt: "Seren Guru",
    width: 54,
    height: 54,
  },
  { src: "/images/logos/f10.png", alt: "F10", width: 124, height: 40 },
];

const MARQUEE_LOGOS = [...LOGOS, ...LOGOS];

export function TrustedBySection() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <p className="font-dm-mono mb-10 text-center text-lg leading-[1.2] font-medium tracking-[10%] text-black uppercase md:mb-14">
        Trusted by startups, SaaS companies, fintechs, and e-commerce brands.
      </p>

      <div
        className="mx-auto max-w-[900px] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/*
          pr- on every item (not flex gap) ensures the last item in each set
          also carries trailing space, making both halves identical in width
          so translateX(-50%) lands exactly at the start of the duplicate set.
        */}
        <div className="animate-marquee flex w-max items-center">
          {MARQUEE_LOGOS.map((logo, i) => (
            <div key={`${logo.alt}-${i}`} className="shrink-0 pr-10 md:pr-20">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                style={{ width: logo.width, height: logo.height }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
