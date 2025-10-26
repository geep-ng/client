"use client";

import Header from "@/shared/components/home/Header";
import Footer from "@/shared/components/home/Footer";
import Hero from "@/shared/components/home/Hero";
import Countdown from "@/shared/components/home/CountDown";
import Features from "@/shared/components/home/Features";
import Waitlist from "@/shared/components/home/Waitlist";

export default function LandingPage() {
  return (
    <>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <Countdown />
          <Features />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </>
  );
}