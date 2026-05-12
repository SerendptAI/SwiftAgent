"use client";

import Image from "next/image";
import { useState } from "react";

import { DevelopmentResourcesDrawer } from "./development-resources-drawer";

export function ResourcesCard() {
  const [showResources, setShowResources] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowResources(true)}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <div className="relative mb-8 flex h-[160px] w-full items-end justify-center overflow-hidden">
          <div
            className="absolute bottom-4 left-1/2 w-[95%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-6 group-hover:rotate-[-2deg]"
            style={{ zIndex: 1 }}
          >
            <Image
              src="/images/resources/r4.svg"
              alt="Resource folder"
              width={236}
              height={129}
              className="h-auto w-full"
            />
          </div>

          <div
            className="absolute -bottom-5 left-1/2 w-[95%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:rotate-[-1deg]"
            style={{ zIndex: 2 }}
          >
            <Image
              src="/images/resources/r3.svg"
              alt="Resource folder"
              width={236}
              height={129}
              className="h-auto w-full"
            />
          </div>

          <div
            className="absolute -bottom-14 left-1/2 w-[95%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[0.5deg]"
            style={{ zIndex: 3 }}
          >
            <Image
              src="/images/resources/r2.svg"
              alt="Resource folder"
              width={236}
              height={129}
              className="h-auto w-full"
            />
          </div>

          <div
            className="absolute -bottom-22 left-1/2 w-[95%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:translate-y-1 group-hover:rotate-[1deg]"
            style={{ zIndex: 4 }}
          >
            <Image
              src="/images/resources/r1.svg"
              alt="Resource folder"
              width={236}
              height={129}
              className="h-auto w-full"
            />
          </div>

          <div className="absolute -bottom-6 left-1/2 z-10 h-12 w-24 -translate-x-1/2 rounded-t-full bg-white transition-transform duration-500 ease-out group-hover:translate-y-2" />
        </div>

        <span className="font-dm-mono mt-2 text-sm leading-none text-[#3B82F6] transition-all duration-300 group-hover:text-[#2563EB]">
          Development Resources
        </span>
      </button>

      <DevelopmentResourcesDrawer
        open={showResources}
        onClose={() => setShowResources(false)}
      />
    </>
  );
}
