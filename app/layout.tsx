import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hourlyplace",
  description:
    "Hourlyplace is coming soon — a new platform in development by KSW Techzone, Nepal.",
  openGraph: {
    title: "Hourlyplace",
    description:
      "Hourlyplace is coming soon — a new platform in development by KSW Techzone, Nepal.",
    siteName: "Hourlyplace",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
