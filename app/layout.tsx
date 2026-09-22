import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider, themeConfig, colorPresets } from "@/lib/theme";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "RAG Pipeline & Customer Support AI",
  description: "Minimal, modular frontend for persistent conversational AI and RAG knowledge base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activePreset = colorPresets[themeConfig.activePreset] || colorPresets.blue;
  const isCustomPreset = themeConfig.activePreset !== "blue";

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('rag-support-theme') || 'system';
                  var isDark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.setAttribute('data-theme', 'dark');
                  } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {isCustomPreset && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root, .light, [data-theme="light"] {
                  --primary: ${activePreset.light.primary};
                  --primary-hover: ${activePreset.light.primaryHover};
                  --primary-foreground: ${activePreset.light.primaryForeground};
                  --primary-subtle: ${activePreset.light.primarySubtle};
                  --primary-subtle-foreground: ${activePreset.light.primarySubtleForeground};
                  --primary-border: ${activePreset.light.primaryBorder};
                }
                .dark, [data-theme="dark"] {
                  --primary: ${activePreset.dark.primary};
                  --primary-hover: ${activePreset.dark.primaryHover};
                  --primary-foreground: ${activePreset.dark.primaryForeground};
                  --primary-subtle: ${activePreset.dark.primarySubtle};
                  --primary-subtle-foreground: ${activePreset.dark.primarySubtleForeground};
                  --primary-border: ${activePreset.dark.primaryBorder};
                }
              `,
            }}
          />
        )}
      </head>
      <body className="h-full flex flex-col bg-background text-foreground font-sans transition-colors duration-150 overflow-hidden">
        <ThemeProvider>
          <QueryProvider>
            <Header />
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
