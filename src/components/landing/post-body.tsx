import type { PortableTextBlock } from "next-sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";

/* eslint-disable @next/next/no-img-element -- Sanity serves its own CDN
   transforms; next/image would need every asset host allowlisted for no gain
   inside prose. */

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-[1.8] tracking-[2%] text-black/80 md:text-lg">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-greed mt-14 mb-5 text-2xl leading-[1.2] font-medium tracking-[-1%] text-black uppercase md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 text-base font-medium tracking-[10%] text-black uppercase md:text-lg">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-black py-2 pl-6 text-lg leading-[1.7] text-black italic md:text-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-base leading-[1.8] text-black/80 md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-base leading-[1.8] text-black/80 md:text-lg">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-black">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="rounded bg-[#F3F4F6] px-1.5 py-0.5 text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="underline underline-offset-4 transition-colors hover:text-black"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) =>
      value?.asset?.url ? (
        <figure className="my-10">
          <img
            src={value.asset.url}
            alt={value.alt ?? ""}
            className="w-full rounded-[10px] border border-black/20"
          />
        </figure>
      ) : null,
  },
};

export function PostBody({ body }: { body: PortableTextBlock[] }) {
  return <PortableText value={body} components={components} />;
}
