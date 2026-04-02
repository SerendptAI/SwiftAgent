/** Top text area with subtitle, headline, and description */
export function ContactHeader() {
  return (
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
        <p className="font-stolze text-xl leading-relaxed font-medium text-[#2C3E5D]">
          For business inquiries, check our links below.
        </p>
      </div>
    </div>
  );
}
