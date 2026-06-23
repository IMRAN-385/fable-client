"use client";
import { useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { Navbar } from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

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