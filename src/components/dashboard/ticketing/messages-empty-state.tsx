import Image from "next/image";
import type { ReactNode } from "react";

export function MessagesEmptyState({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-8 text-center">
        <Image
          src="/images/email-mailbox-open.svg"
          alt=""
          width={66}
          height={66}
          className="aspect-[66/66] w-full max-w-[66px]"
        />
        <p className="font-dm-mono text-center text-sm leading-[1.39] font-normal tracking-[0.1em] text-black/60 uppercase">
          {children}
        </p>
      </div>
    </div>
  );
}
