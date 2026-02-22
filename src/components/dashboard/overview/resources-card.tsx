"use client";

import Link from "next/link";

export function ResourcesCard() {
  return (
    <div className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-sm">
      {/* Stacked Folders Graphic */}
      <div className="relative mb-6 flex h-[160px] w-full items-end justify-center overflow-hidden">
        {/* Blue folder (back) */}
        <div
          className="absolute bottom-[60px] left-1/2 w-[85%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-6 group-hover:rotate-[-2deg]"
          style={{ zIndex: 1 }}
        >
          <svg
            viewBox="0 0 240 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            {/* Folder tab */}
            <path
              d="M0 12C0 5.373 5.373 0 12 0H60C63.18 0 66.12 1.58 67.8 4.2L72 10H228C234.627 10 240 15.373 240 22V58C240 64.627 234.627 70 228 70H12C5.373 70 0 64.627 0 58V12Z"
              fill="#93B4FF"
            />
            {/* File icons on folder */}
            <rect
              x="20"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="24" y="28" width="10" height="2" rx="1" fill="#93B4FF" />
            <rect x="24" y="33" width="8" height="2" rx="1" fill="#93B4FF" />
            <rect
              x="48"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="52" y="28" width="10" height="2" rx="1" fill="#93B4FF" />
            <rect x="52" y="33" width="8" height="2" rx="1" fill="#93B4FF" />
            <rect
              x="170"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="174" y="28" width="10" height="2" rx="1" fill="#93B4FF" />
            <rect x="174" y="33" width="8" height="2" rx="1" fill="#93B4FF" />
            <rect
              x="200"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="204" y="28" width="10" height="2" rx="1" fill="#93B4FF" />
            <rect x="204" y="33" width="8" height="2" rx="1" fill="#93B4FF" />
          </svg>
        </div>

        {/* Yellow/Orange folder */}
        <div
          className="absolute bottom-[42px] left-1/2 w-[88%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:rotate-[-1deg]"
          style={{ zIndex: 2 }}
        >
          <svg
            viewBox="0 0 240 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 12C0 5.373 5.373 0 12 0H55C58.18 0 61.12 1.58 62.8 4.2L67 10H228C234.627 10 240 15.373 240 22V58C240 64.627 234.627 70 228 70H12C5.373 70 0 64.627 0 58V12Z"
              fill="#F2B031"
            />
            <rect
              x="20"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="24" y="28" width="10" height="2" rx="1" fill="#F2B031" />
            <rect x="24" y="33" width="8" height="2" rx="1" fill="#F2B031" />
            <rect
              x="48"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="52" y="28" width="10" height="2" rx="1" fill="#F2B031" />
            <rect x="52" y="33" width="8" height="2" rx="1" fill="#F2B031" />
            <rect
              x="170"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="174" y="28" width="10" height="2" rx="1" fill="#F2B031" />
            <rect x="174" y="33" width="8" height="2" rx="1" fill="#F2B031" />
            <rect
              x="200"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="204" y="28" width="10" height="2" rx="1" fill="#F2B031" />
            <rect x="204" y="33" width="8" height="2" rx="1" fill="#F2B031" />
          </svg>
        </div>

        {/* Purple folder */}
        <div
          className="absolute bottom-[24px] left-1/2 w-[91%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[0.5deg]"
          style={{ zIndex: 3 }}
        >
          <svg
            viewBox="0 0 240 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 12C0 5.373 5.373 0 12 0H50C53.18 0 56.12 1.58 57.8 4.2L62 10H228C234.627 10 240 15.373 240 22V58C240 64.627 234.627 70 228 70H12C5.373 70 0 64.627 0 58V12Z"
              fill="#7B3DC7"
            />
            <rect
              x="20"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="24" y="28" width="10" height="2" rx="1" fill="#7B3DC7" />
            <rect x="24" y="33" width="8" height="2" rx="1" fill="#7B3DC7" />
            <rect
              x="48"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="52" y="28" width="10" height="2" rx="1" fill="#7B3DC7" />
            <rect x="52" y="33" width="8" height="2" rx="1" fill="#7B3DC7" />
            <rect
              x="170"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="174" y="28" width="10" height="2" rx="1" fill="#7B3DC7" />
            <rect x="174" y="33" width="8" height="2" rx="1" fill="#7B3DC7" />
            <rect
              x="200"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="204" y="28" width="10" height="2" rx="1" fill="#7B3DC7" />
            <rect x="204" y="33" width="8" height="2" rx="1" fill="#7B3DC7" />
          </svg>
        </div>

        {/* Red/Orange folder (front) with bottom notch */}
        <div
          className="absolute bottom-0 left-1/2 w-[94%] -translate-x-1/2 transition-all duration-500 ease-out group-hover:translate-y-1 group-hover:rotate-[1deg]"
          style={{ zIndex: 4 }}
        >
          <svg
            viewBox="0 0 240 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            {/* Folder tab */}
            <path
              d="M0 12C0 5.373 5.373 0 12 0H45C48.18 0 51.12 1.58 52.8 4.2L57 10H228C234.627 10 240 15.373 240 22V60C240 66.627 234.627 72 228 72H155C155 72 150 72 146 68C140 62 136 55 120 55C104 55 100 62 94 68C90 72 85 72 85 72H12C5.373 72 0 66.627 0 60V12Z"
              fill="#F25430"
            />
            {/* File icons */}
            <rect
              x="20"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="24" y="28" width="10" height="2" rx="1" fill="#F25430" />
            <rect x="24" y="33" width="8" height="2" rx="1" fill="#F25430" />
            <rect
              x="48"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="52" y="28" width="10" height="2" rx="1" fill="#F25430" />
            <rect x="52" y="33" width="8" height="2" rx="1" fill="#F25430" />
            <rect
              x="170"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="174" y="28" width="10" height="2" rx="1" fill="#F25430" />
            <rect x="174" y="33" width="8" height="2" rx="1" fill="#F25430" />
            <rect
              x="200"
              y="24"
              width="18"
              height="22"
              rx="2"
              fill="white"
              opacity="0.7"
            />
            <rect x="204" y="28" width="10" height="2" rx="1" fill="#F25430" />
            <rect x="204" y="33" width="8" height="2" rx="1" fill="#F25430" />
            {/* Semi-circle in the notch */}
            <circle cx="120" cy="72" r="22" fill="#F25430" />
            <circle cx="120" cy="72" r="18" fill="#FF6B4A" opacity="0.6" />
          </svg>
        </div>
      </div>

      <Link
        href="#"
        className="mt-2 font-semibold text-[#3B82F6] transition-colors duration-300 hover:underline"
      >
        Resources
      </Link>
    </div>
  );
}
