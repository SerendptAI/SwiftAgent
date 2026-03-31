"use client";

import Image from "next/image";
import Link from "next/link";

export function ContactSection() {
  return (
    <section
      className="relative w-full bg-[#7CA2FE] md:p-12 lg:p-20"
      id="contact"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Top Text Area */}
        <div className="flex flex-col justify-between gap-8 max-md:p-8 md:mb-20 md:flex-row md:items-end">
          <div className="space-y-6">
            <span className="inline-block font-mono text-xl font-semibold tracking-widest text-[#D3E1FF] uppercase md:pb-8">
              WANT TO REACH US?
            </span>
            <h2 className="font-greed-narrow text-4xl leading-none font-black tracking-tighter text-white md:text-8xl">
              CONTACT US
            </h2>
          </div>

          <div className="max-w-md pb-4">
            <p className="font-greed-narrow text-xl leading-relaxed font-medium text-[#2C3E5D]">
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
        <div className="relative mx-auto w-full max-md:h-[600px] max-md:pl-8 md:p-[2rem]">
          <Image
            src="/images/contact_img.svg"
            alt="Street view"
            width={500}
            height={500}
            className="h-full w-full bg-[#7CA2FE] object-left max-md:absolute max-md:h-4/5 max-md:object-cover"
          />

          {/* Bottom Links Overlaid on Image */}
          <div className="absolute bottom-16 left-12 z-20 flex flex-col gap-6 max-md:bottom-40">
            <Link
              href="https://x.com/swftagents"
              className="font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300"
            >
              TWITTER
            </Link>
            <Link
              href="/"
              className="font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300"
            >
              INSTAGRAM
            </Link>
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
            <Link
              href="mailto:thelma@swiftagents.org"
              className="font-mono text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:text-gray-300"
            >
              EMAIL
            </Link>
          </div>

          {/* Copyright Footer Centered in Image */}
          <div className="absolute bottom-16 left-0 z-20 w-full text-center">
            <span className="font-mono text-[10px] tracking-widest text-white/60 uppercase sm:text-xs">
              ©COPYRIGHT @SWIFTAGENTS.ORG
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
