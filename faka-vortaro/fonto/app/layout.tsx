import React from "react";
import { Metadata } from "next";

import { Providers } from "./_providers";
import { InitTheme } from "./_providers/Theme/InitTheme";
import { mergeOpenGraph } from "./_utilities/mergeOpenGraph";

import "./_css/app.scss";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || "https://payloadcms.com"),
  twitter: {
    card: "summary_large_image",
    creator: "@payloadcms",
  },
  openGraph: mergeOpenGraph(),
};
