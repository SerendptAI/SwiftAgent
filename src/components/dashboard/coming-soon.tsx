import Image from "next/image";

export function ComingSoon({
  description,
  illustration,
}: {
  description: string;
  illustration: string;
}) {
  return (
    <div className="flex h-full min-h-[480px] w-full flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center">
      <Image
        src={illustration}
        alt=""
        width={160}
        height={160}
        className="h-auto w-full max-w-[140px]"
      />
      <h2 className="font-stolzl mt-8 text-2xl font-medium text-black">
        Coming Soon...
      </h2>
      <p className="mt-2 max-w-sm text-sm text-black/60">{description}</p>
    </div>
  );
}
