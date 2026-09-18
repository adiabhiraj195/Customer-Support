"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

function CodeBlock({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-border/80 bg-zinc-950 text-zinc-100 text-xs shadow-2xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400 font-mono">
        <span>{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-zinc-100 transition-colors py-0.5 px-1.5 rounded hover:bg-zinc-800"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed text-zinc-200">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  isUser = false,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`break-words text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-bold mt-3 mb-2 pb-1 border-b border-border">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mt-2.5 mb-1.5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold mt-2 mb-1">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 mb-2.5 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 mb-2.5 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={
                isUser
                  ? "border-l-2 border-white/60 pl-3 my-2 italic text-primary-foreground/90"
                  : "border-l-2 border-primary pl-3 my-2 italic text-muted-foreground bg-card-muted/80 py-1 rounded-r-xl"
              }
            >
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isUser
                  ? "underline font-medium text-white hover:text-white/80"
                  : "underline font-medium text-primary hover:text-primary-hover"
              }
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full divide-y divide-border text-xs text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-card-muted font-semibold text-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/60">{children}</tbody>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-2">{children}</td>,
          tr: ({ children }) => (
            <tr className="even:bg-card-muted/40">{children}</tr>
          ),
          hr: () => (
            <hr
              className={
                isUser ? "my-3 border-white/20" : "my-3 border-border"
              }
            />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className: codeClassName, children, ...props }) => {
            const hasMultipleLines = String(children).includes("\n");
            const hasLanguage = /language-(\w+)/.test(codeClassName || "");

            if (hasMultipleLines || hasLanguage) {
              return (
                <CodeBlock className={codeClassName} {...props}>
                  {children}
                </CodeBlock>
              );
            }

            return (
              <code
                className={
                  isUser
                    ? "bg-white/20 text-white font-mono text-[12px] px-1.5 py-0.5 rounded"
                    : "bg-card-muted text-primary font-mono text-[12px] px-1.5 py-0.5 rounded border border-border"
                }
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
