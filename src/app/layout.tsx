import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { StarsCanvas } from "@/components/star-background";
import Footer from "@/components/footer"; // Update this path to use your new footer
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Nanda Kishore R | Developer Portfolio",
  description: "Full Stack Developer and ML Engineer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <StarsCanvas />
          {children}
          <Footer /> {/* Make sure the Footer is added here */}
        </ThemeProvider>
      </body>
    </html>
  );
}
