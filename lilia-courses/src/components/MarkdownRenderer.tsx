"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  className?: string;
};

/**
 * Shared Markdown renderer component for both student and admin views.
 * Styled for dark mode with minimal, readable styling.
 */
export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-10 mb-6 text-white leading-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-8 mb-4 text-white leading-tight">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3 text-white leading-tight">{children}</h3>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-base leading-7 mb-6 text-white/90">{children}</p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside mb-6 ml-6 space-y-2 text-white/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside mb-6 ml-6 space-y-2 text-white/90">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base leading-7 text-white/90 pl-2">{children}</li>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {children}
            </a>
          ),
          // Code blocks (inline comes from react-markdown internal types)
          code: ({ children, ...props }: { children?: React.ReactNode; inline?: boolean }) => {
            const inline = "inline" in props ? (props as { inline?: boolean }).inline : false;
            if (inline) {
              return (
                <code className="bg-black/30 text-green-400 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-black/30 text-green-400 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-4">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto mb-4">{children}</pre>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-white/20 pl-6 italic text-white/80 mb-6 py-2">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => <hr className="border-white/10 my-8" />,
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-white/90">{children}</em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

