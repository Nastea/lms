"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
  /** "dark" = text alb (pentru fundal închis), "light" = text închis (pentru fundal deschis, ex. lectia-0) */
  theme?: "dark" | "light";
};

const lightClasses = {
  prose: "",
  h1: "text-3xl font-bold mt-10 mb-6 leading-tight text-[#1F2933]",
  h2: "text-2xl font-bold mt-8 mb-4 leading-tight text-[#1F2933]",
  h3: "text-xl font-semibold mt-6 mb-3 leading-tight text-[#1F2933]",
  p: "text-base leading-7 mb-6 text-[#6B7280]",
  ul: "list-disc list-outside mb-6 ml-6 space-y-2 text-[#6B7280]",
  ol: "list-decimal list-outside mb-6 ml-6 space-y-2 text-[#6B7280]",
  li: "text-base leading-7 text-[#6B7280] pl-2",
  a: "text-[#E56B6F] hover:text-[#D84A4E] underline",
  code: "bg-black/10 text-[#1F2933] px-1.5 py-0.5 rounded text-sm font-mono",
  codeBlock: "block bg-black/10 text-[#1F2933] p-3 rounded-lg text-sm font-mono overflow-x-auto mb-4",
  pre: "bg-black/10 p-3 rounded-lg overflow-x-auto mb-4",
  blockquote: "border-l-4 border-[#E56B6F]/50 pl-6 italic text-[#6B7280] mb-6 py-2",
  hr: "border-black/10 my-8",
  strong: "font-semibold text-[#1F2933]",
  em: "italic text-[#6B7280]",
};

const darkClasses = {
  prose: "prose-invert",
  h1: "text-3xl font-bold mt-10 mb-6 text-white leading-tight",
  h2: "text-2xl font-bold mt-8 mb-4 text-white leading-tight",
  h3: "text-xl font-semibold mt-6 mb-3 text-white leading-tight",
  p: "text-base leading-7 mb-6 text-white/90",
  ul: "list-disc list-outside mb-6 ml-6 space-y-2 text-white/90",
  ol: "list-decimal list-outside mb-6 ml-6 space-y-2 text-white/90",
  li: "text-base leading-7 text-white/90 pl-2",
  a: "text-blue-400 hover:text-blue-300 underline",
  code: "bg-black/30 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono",
  codeBlock: "block bg-black/30 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-4",
  pre: "bg-black/30 p-3 rounded-lg overflow-x-auto mb-4",
  blockquote: "border-l-4 border-white/20 pl-6 italic text-white/80 mb-6 py-2",
  hr: "border-white/10 my-8",
  strong: "font-semibold text-white",
  em: "italic text-white/90",
};

/**
 * Shared Markdown renderer. theme="dark" for app (fundal închis), theme="light" for lectia-0 (fundal deschis).
 */
export default function MarkdownRenderer({ content, className = "", theme = "dark" }: Props) {
  const c = theme === "light" ? lightClasses : darkClasses;
  return (
    <div className={`prose max-w-none ${c.prose} ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className={c.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={c.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={c.h3}>{children}</h3>,
          p: ({ children }) => <p className={c.p}>{children}</p>,
          ul: ({ children }) => <ul className={c.ul}>{children}</ul>,
          ol: ({ children }) => <ol className={c.ol}>{children}</ol>,
          li: ({ children }) => <li className={c.li}>{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className={c.a}>
              {children}
            </a>
          ),
          code: ({ children, ...props }: { children?: React.ReactNode; inline?: boolean }) => {
            const isInline = "inline" in props ? (props as { inline?: boolean }).inline : false;
            return isInline ? (
              <code className={c.code}>{children}</code>
            ) : (
              <code className={c.codeBlock}>{children}</code>
            );
          },
          pre: ({ children }) => <pre className={c.pre}>{children}</pre>,
          blockquote: ({ children }) => <blockquote className={c.blockquote}>{children}</blockquote>,
          hr: () => <hr className={c.hr} />,
          strong: ({ children }) => <strong className={c.strong}>{children}</strong>,
          em: ({ children }) => <em className={c.em}>{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

