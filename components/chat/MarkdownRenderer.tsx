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
    <div className="my-3 rounded-xl overflow-hidden border border-border bg-card text-foreground text-xs shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-muted/80 border-b border-border text-[11px] text-muted-foreground font-mono">
        <span>{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-foreground transition-colors py-0.5 px-1.5 rounded hover:bg-muted"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-[10px] text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed text-foreground">
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
            <h1 className="text-base font-bold mt-3 mb-2 pb-1 border-b border-border text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mt-2.5 mb-1.5 text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold mt-2 mb-1 text-foreground">{children}</h3>
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
                  ? "border-l-2 border-primary-foreground/60 pl-3 my-2 italic text-primary-foreground/90"
                  : "border-l-2 border-primary pl-3 my-2 italic text-muted-foreground bg-muted/40 py-1 rounded-r-lg"
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
                  ? "underline font-medium text-primary-foreground/90 hover:text-primary-foreground"
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
            <thead className="bg-muted/80 font-semibold text-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/60">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="px-3 py-2">{children}</td>,
          tr: ({ children }) => (
            <tr className="even:bg-muted/30">
              {children}
            </tr>
          ),
          hr: () => (
            <hr
              className={
                isUser
                  ? "my-3 border-primary-foreground/20"
                  : "my-3 border-border"
              }
            />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className: codeClassName, children, ...props }) => {
            const hasMultipleLines = String(children).includes("\n");
            const hasLanguage = /language-(\w+)/.test(codeClassName || "");

            // If multiline or explicitly tagged with language, render as a formatted CodeBlock
            if (hasMultipleLines || hasLanguage) {
              return (
                <CodeBlock className={codeClassName} {...props}>
                  {children}
                </CodeBlock>
              );
            }

            // Inline code snippet
            return (
              <code
                className={
                  isUser
                    ? "bg-primary-hover text-primary-foreground font-mono text-[12px] px-1.5 py-0.5 rounded"
                    : "bg-muted text-destructive font-mono text-[12px] px-1.5 py-0.5 rounded border border-border"
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
