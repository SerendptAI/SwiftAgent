"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal<T extends HTMLElement>({
  self = false,
}: { self?: boolean } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = self ? [el] : Array.from(el.children);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { y: 48, opacity: 0 });
      gsap.to(targets, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, [self]);

  return ref;
}
