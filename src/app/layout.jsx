import { Lora, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import AppShell from "@/components/AppShell";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Fable — Discover & Read Original Ebooks",
  description: "A digital platform connecting ebook lovers with talented writers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}