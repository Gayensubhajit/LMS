import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { ThemeProviderWrapper } from "@/components/theme/ThemeProviderWrapper";
import ClerkProviderWrapper from "@/components/auth/ClerkProviderWrapper";
import AssistantWidget from "@/components/lms/AssistantWidget";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edunova-lms.vercel.app"),
  title: {
    default: "EduNova — AI-Powered 2026 Learning Platform",
    template: "%s | EduNova",
  },
  description:
    "Step into the future of learning. Master UI/UX Design, Development & more with AI-guided roadmaps, real-world projects, and industry mentors.",
  keywords: [
    "LMS",
    "AI Learning",
    "UI/UX Course",
    "Next.js 15",
    "Web Development",
    "2026 Skills",
    "EduNova",
  ],
  authors: [{ name: "Subhajit Gayen" }],
  creator: "EduNova",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://edunova-lms.vercel.app",
    siteName: "EduNova",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EduNova Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduNova — AI-Powered Learning",
    description: "Master high-income skills with AI-guided roadmaps.",
    images: ["/og-image.png?v=1"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderWrapper>
          <ClerkProviderWrapper>
            <ErrorReporter />
            <Script
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
              strategy="afterInteractive"
              data-target-origin="*"
              data-message-type="ROUTE_CHANGE"
              data-include-search-params="true"
              data-only-in-iframe="true"
              data-debug="true"
              data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
            />
            {children}
            <AssistantWidget />
            <VisualEditsMessenger />
            <Analytics />
          </ClerkProviderWrapper>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
