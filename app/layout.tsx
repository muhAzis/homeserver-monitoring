import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ProvidersWrapper from "@/components/core/Providers";
import { Toaster } from "@/components/ui/sonner";

const manropeHeading = Manrope({subsets:['latin'],variable:'--font-heading'});


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const manropeSans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - KyouMe Server",
    default: "KyouMe Server",
  },
  description: "Self-hosted server monitoring for KyouMe",
  icons: {
    icon: "/favicon.ico?v=3",
    apple: "/favicon.ico?v=3"
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", manropeSans.variable, jetbrainsMono.variable, manropeHeading.variable)}
    >
      <body className="h-full flex flex-col overflow-hidden">
        <ProvidersWrapper>
          {children}
          <Toaster richColors position="top-right" />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
