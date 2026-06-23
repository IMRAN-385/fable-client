import {
  Fraunces,
  Source_Serif_4,
  JetBrains_Mono,
} from "next/font/google";

import { AuthProvider } from "../../src/context/AuthContext";
import AppShell from "../components/AppSpell";
import "./globals.css";
import { ToastProvider } from "../context/toastcontext";
;

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "900"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}