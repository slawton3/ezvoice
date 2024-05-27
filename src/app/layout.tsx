import { env } from "@/env.js";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";

import { siteConfig } from "@/config/site";

import { ThemeProvider } from "@/components/providers";

import { Toaster } from "@/components/ui/sonner";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import { absoluteUrl, cn } from "@/lib/utils";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "nextjs",
    "react",
    "react server components",
    "nextjs boilerplate",
    "nextjs starter",
    "nextjs template",
  ],
  authors: [
    {
      name: "Sean Lawton",
      url: "https://www.ezvoice.io",
    },
  ],
  creator: "Sean Lawton",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@snlwtn",
  },
  icons: {
    icon: "/icon.png",
  },
  manifest: absoluteUrl("/site.webmanifest"),
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
              fontMono.variable,
              fontHeading.variable,
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
            <Scripts />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}

function Scripts() {
  return (
    <div>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-11223491668"
      ></Script>
      <Script id="gtag">
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'AW-11223491668');`}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2693740565974658"
        crossOrigin="anonymous"
      ></Script>
    </div>
  );
}
