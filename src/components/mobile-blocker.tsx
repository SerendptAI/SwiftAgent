import Image from "next/image";

export function MobileBlocker() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center bg-white md:hidden">
      {/* Top Logo Area */}
      <div className="mt-16 flex items-center gap-3">
        <div className="relative h-12 w-12">
          <Image
            src="/images/newlogo.svg"
            alt="Swift Agents Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center pb-24">
        <div className="relative mb-10 h-[136px] w-[136px]">
          <Image
            src="/images/public_internet.svg"
            alt="Not available on mobile"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="font-greed text-center text-[32px] leading-[1.1] font-bold tracking-tight text-black">
          Not available
          <br />
          on mobile devices
        </h1>

        <p className="mt-6 font-mono text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
          FOR NOW
        </p>
      </div>
    </div>
  );
}
