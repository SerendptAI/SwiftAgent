"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Link } from "@/i18n/navigation";
import { videoUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

function AutoPlayVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={className}
    />
  );
}

function StoreButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-dm-mono inline-flex items-center gap-3 rounded-[13px] bg-[#006BE5] px-6 py-3.5 text-base font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#0059c1] sm:text-lg",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function ProductsSection() {
  const t = useTranslations("products");

  return (
    <section
      id="products"
      className="w-full bg-white px-6 pt-36 pb-16 md:px-10 md:pt-44 md:pb-20 lg:px-16 lg:pt-52 lg:pb-26"
    >
      <div className="mx-auto flex max-w-296 flex-col gap-24 md:gap-32 lg:gap-40">
        <div>
          <p className="font-dm-mono mb-8 text-base leading-[1.2] tracking-[10%] text-black/60 uppercase md:text-lg">
            {t("eyebrow")}
          </p>
          <h2 className="font-greed-narrow mb-8 text-4xl leading-[1.34] font-medium tracking-[-2%] uppercase md:mb-14 md:text-5xl lg:text-[66px]">
            {t("app.heading")}
          </h2>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-16">
            <AutoPlayVideo
              src={videoUrl("products/swift-agents-app")}
              className="aspect-571/701 w-full object-cover lg:w-[45%]"
            />

            <div className="font-dm-mono flex flex-col gap-6 text-base leading-[1.66] tracking-[10%] text-black/80 uppercase md:text-lg lg:w-[55%] lg:text-xl xl:text-2xl">
              <p>{t("app.body1")}</p>
              <p>{t("app.body2")}</p>

              <div className="mt-2 flex flex-col gap-4">
                <StoreButton href="#" className="w-fit">
                  <PlayStoreIcon />
                  {t("app.playStore")}
                </StoreButton>
                <StoreButton href="#" className="w-fit">
                  <AppleIcon />
                  {t("app.appleStore")}
                </StoreButton>
              </div>
            </div>
          </div>
        </div>

        <div id="sdks">
          <h2 className="font-greed-narrow mb-8 text-4xl leading-[1.34] font-medium tracking-[-2%] uppercase md:mb-14 md:text-5xl lg:text-right lg:text-[66px]">
            {t("sdk.heading")}
          </h2>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <AutoPlayVideo
              src={videoUrl("products/swift-agents-sdk")}
              className="aspect-571/701 w-full object-cover lg:order-last lg:w-[55%]"
            />

            <div className="font-dm-mono flex flex-col gap-6 text-base leading-[1.66] tracking-[10%] text-black/80 uppercase md:text-lg lg:w-[45%] lg:text-xl xl:text-2xl">
              <p>{t("sdk.body1")}</p>
              <p>{t("sdk.body2")}</p>

              <div className="mt-2">
                <StoreButton
                  href="/signup"
                  className="flex w-fit max-w-81.5 items-center justify-center text-center sm:w-full"
                >
                  {t("sdk.cta")}
                </StoreButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 29 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.541309 1.32732C0.198431 1.67727 0 2.22212 0 2.92772V28.096C0 28.8016 0.198431 29.3465 0.541309 29.6964L0.625935 29.7732L15.091 15.6755V15.3426L0.625935 1.24481L0.541309 1.32732Z"
        fill="white"
      />
      <path
        d="M21.6581 20.377L16.8418 15.6754V15.3425L21.664 10.6409L21.7719 10.702L27.4827 13.8701C29.1125 14.7692 29.1125 16.2487 27.4827 17.1534L21.7719 20.3158L21.6581 20.377Z"
        fill="white"
      />
      <path
        d="M20.8965 21.1913L15.9663 16.3844L1.41663 30.5718C1.95794 31.1266 2.84066 31.1935 3.8445 30.6387L20.8965 21.1913Z"
        fill="white"
      />
      <path
        d="M20.8965 9.8267L3.8445 0.379342C2.84066 -0.169774 1.95794 -0.102916 1.41663 0.451892L15.9663 14.6336L20.8965 9.8267Z"
        fill="white"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 29 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.9794 18.2968C23.9393 13.9502 27.6297 11.8356 27.7985 11.7371C25.7084 8.76608 22.469 8.36014 21.3306 8.32778C18.6098 8.04861 15.9707 9.91511 14.5847 9.91511C13.171 9.91511 11.0367 8.35475 8.73647 8.4006C5.77641 8.44511 3.00723 10.1161 1.48846 12.7108C-1.64589 18.0015 0.691737 25.7763 3.69468 30.0528C5.19685 32.1472 6.95214 34.4858 9.24964 34.4035C11.4974 34.3131 12.337 33.0063 15.0494 33.0063C17.737 33.0063 18.5254 34.4035 20.8686 34.3509C23.2809 34.3131 24.7997 32.247 26.2493 30.1337C27.9852 27.7332 28.6823 25.369 28.71 25.2477C28.6533 25.2288 24.0251 23.5066 23.9794 18.2968Z"
        fill="white"
      />
      <path
        d="M19.5532 5.51454C20.7621 4.04049 21.5892 2.03508 21.3596 0C19.6099 0.0755231 17.4216 1.18005 16.1615 2.62173C15.0467 3.89214 14.0508 5.97442 14.308 7.93263C16.2736 8.07558 18.2917 6.96566 19.5532 5.51454Z"
        fill="white"
      />
    </svg>
  );
}
