"use client";

import Image from "next/image";
import Link from "next/link";

export function ContactSection() {
  return (
    <section
      className="relative w-full bg-[#7CA2FE] p-8 md:p-12 lg:p-20"
      id="contact"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Top Text Area */}
        <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-6">
            <span className="inline-block pb-8 font-mono text-[11px] font-semibold tracking-widest text-[#D3E1FF] uppercase">
              WANT TO REACH US?
            </span>
            <h2 className="text-6xl leading-none font-black tracking-tighter text-white md:text-[8rem]">
              CONTACT US
            </h2>
          </div>

          <div className="max-w-md pb-4">
            <p className="text-xl leading-relaxed font-medium text-[#2C3E5D]">
              For partnership or business inquiries, contact
              <br />
              Thelma at{" "}
              <a
                href="mailto:Thelma@swiftagents.org"
                className="text-gray-900 hover:underline"
              >
                Thelma@swiftagents.org
              </a>
            </p>
          </div>
        </div>

        {/* Image Grid Area */}
        <div
          className="relative mx-auto mt-12 w-full lg:w-[90%]"
          style={{ aspectRatio: "21/9" }}
        >
          {/* Main Image Container */}
          <div className="relative ml-8 h-full w-full overflow-hidden border-12 border-[#0A0D14] bg-black object-cover">
            <Image
              src="/images/contact_img.svg"
              alt="Street view"
              fill
              className="object-cover object-center opacity-90 mix-blend-lighten grayscale"
            />

            {/* Bottom Links Overlaid on Image */}
            <div className="absolute bottom-16 left-12 z-20 flex flex-col gap-6">
              <Link
                href="/"
                className="font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300"
              >
                CAREERS
              </Link>
              <Link
                href="/"
                className="font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300"
              >
                BLOG
              </Link>
            </div>

            {/* Copyright Footer Centered in Image */}
            <div className="absolute bottom-8 left-0 z-20 w-full text-center">
              <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase sm:text-xs">
                ©COPYRIGHT @SWIFTAGENTS.ORG
              </span>
            </div>
          </div>

          {/* Decorative Square Grid Elements - Left Side */}
          <div className="absolute top-0 left-0 z-20 -mt-16 -ml-8 flex flex-col">
            <div className="h-24 w-24 bg-[#0A0D14]" />
            <div className="h-24 w-24 border-r-12 border-b-12 border-[#0A0D14] bg-[#7CA2FE]" />
            <div className="h-24 w-24 border-r-12 border-[#0A0D14] bg-transparent" />
          </div>

          <div className="absolute top-24 left-32 z-20 -ml-8 flex flex-col">
            <div className="h-16 w-16 border-r-12 border-[#0A0D14] bg-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
