"use client";
import { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { Navbar } from "./shared/Navbar";
import Footer from "./shared/Footer";

export default function AppShell({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Navbar />
      {children}
      <Footer />
    </>
  );
}