export function PayoutSection() {
  return (
    <section className="w-full bg-white px-6 py-16 md:px-10 md:py-24 lg:px-20">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-8 rounded-lg border border-black bg-white p-8 shadow-[-6px_8px_0px_0px_#000000] md:flex-row md:gap-12 md:p-12">
        <div className="flex flex-1 flex-col gap-2">
          <p className="font-dm-mono text-sm tracking-[0.15em] text-[#7e7e7e] uppercase">
            Affiliate reward
          </p>
          <p className="font-greed-narrow text-6xl font-medium text-[#f2b035]">
            20%
          </p>
          <p className="font-dm-mono text-[18px] text-[#1f1f1f] uppercase">
            Of whichever plan they pay for
          </p>
        </div>

        <div className="h-px w-full shrink-0 bg-black/15 md:h-30 md:w-px" />

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="font-greed-narrow text-[28px] font-medium text-[#1f1f1f] uppercase">
            Submit multiple deals
          </h2>
          <p className="font-stolzl text-base leading-[1.6] text-[#7e7e7e]">
            You earn 20% of whichever plan the person you refer pays for. The
            more referrals, the more you earn — it&apos;s that simple.
          </p>
        </div>
      </div>
    </section>
  );
}
