import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

interface MessageMarkdownProps {
  text: string;
  /** Tighter vertical spacing — used inside small/compact bubbles. */
  compact?: boolean;
}

export function MessageMarkdown({
  text,
  compact = false,
}: MessageMarkdownProps) {
  const pMargin = compact ? "mb-1" : "mb-2";
  const listMargin = compact ? "mb-1" : "mb-2";
  const liMargin = compact ? "mb-0.5" : "mb-1";

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className={cn(pMargin, "last:mb-0")}>{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ol: ({ children }) => (
          <ol className={cn(listMargin, "list-decimal pl-4 last:mb-0")}>
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className={cn(listMargin, "list-disc pl-4 last:mb-0")}>
            {children}
          </ul>
        ),
        li: ({ children }) => <li className={liMargin}>{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.9em]">
            {children}
          </code>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
