"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Link } from "@/i18n/navigation";

gsap.registerPlugin(ScrollTrigger);

export function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.from(textRef.current.children, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
          x: 120,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      if (btnRef.current) {
        gsap.from(btnRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.5)",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#7B8CDE" }}
    >
      <div className="relative mx-auto flex max-w-[1400px] flex-col lg:flex-row lg:items-end">
        {/* ── Left: Text + Button ── */}
        <div className="flex w-full flex-col justify-end px-8 pt-16 pb-12 lg:w-[55%] lg:px-14 lg:pt-24 lg:pb-20">
          <div ref={textRef}>
            <h2
              className="font-greed-narrow leading-[1.2] font-normal text-white uppercase"
              style={{
                fontSize: "clamp(2.5rem, 4vw, 4.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              WITH SWIFT AGENTS YOUR CUSTOMERS CAN NEVER GET LOST ON YOUR
              DASHBOARD
            </h2>
          </div>

          <Link
            ref={btnRef}
            href="/signup"
            className="font-dm-mono mt-10 inline-flex cursor-pointer items-center justify-center rounded-md bg-white px-10 py-2 text-sm font-bold tracking-[0.2em] text-black uppercase shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-black hover:text-white md:w-3/5"
          >
            GET STARTED
          </Link>
        </div>

        {/* ── Right: Pixel art characters ── */}
        <div
          ref={imageRef}
          className="relative flex w-full items-end justify-center lg:w-[45%]"
        >
          <Image
            src="/images/talkingIndividual.svg"
            alt="Pixel art characters"
            width={588}
            height={575}
            className="h-auto w-full max-w-[500px] object-contain"
            style={{ marginBottom: "-4px" }}
          />
        </div>
      </div>
    </section>
  );
}
