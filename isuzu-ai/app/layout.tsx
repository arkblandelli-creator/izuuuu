import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Izusu ai - Premium AI Assistant",
  description: "A luxurious AI assistant platform powered by ChatGPT, Claude, and Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
