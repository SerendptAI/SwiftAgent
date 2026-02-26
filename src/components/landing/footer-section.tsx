"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        // Large CTA text
        const ctaText = contentRef.current.querySelector(".footer-cta");
        gsap.from(ctaText, {
          scrollTrigger: {
            trigger: ctaText,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });

        // Footer links
        const links = contentRef.current.querySelectorAll(".footer-link");
        gsap.from(links, {
          scrollTrigger: {
            trigger: links[0],
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
        });

        // Bottom bar
        const bottomBar = contentRef.current.querySelector(".footer-bottom");
        gsap.from(bottomBar, {
          scrollTrigger: {
            trigger: bottomBar,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F25430] px-8 py-24 text-white md:px-12 lg:px-16"
    >
      <div ref={contentRef}>
        {/* CTA */}
        <div className="footer-cta mb-20">
          <h2 className="mb-8 text-4xl leading-tight font-black tracking-tight uppercase md:text-6xl lg:text-7xl">
            READY TO
            <br />
            TRANSFORM YOUR
            <br />
            <span className="text-gray-900">CUSTOMER EXPERIENCE?</span>
          </h2>
          <Link
            href="/en/login"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 text-sm font-bold tracking-[0.15em] text-gray-900 uppercase transition-all hover:bg-gray-900 hover:text-white"
          >
            <span>GET STARTED NOW</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] uppercase opacity-60">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] uppercase opacity-60">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] uppercase opacity-60">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] uppercase opacity-60">
              Social
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Twitter / X
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/SerendptAI/SwiftAgent"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="footer-link text-sm transition-opacity hover:opacity-70"
                >
                  LinkedIn
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row">
          <div className="text-sm opacity-60">
            © {new Date().getFullYear()} SwiftAgent by Serendpt AI. All rights
            reserved.
          </div>
          <div className="flex gap-6 text-sm opacity-60">
            <Link href="/" className="transition-opacity hover:opacity-100">
              Privacy Policy
            </Link>
            <Link href="/" className="transition-opacity hover:opacity-100">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
