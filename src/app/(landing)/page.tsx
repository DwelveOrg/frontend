import React from "react";
import MainPage from "./_sections/MainPage";
import HowItWorks from "./_sections/HowItWorks";
import Features from "./_sections/Features";
import LandingAccordion from "./_sections/Accordion";
import CallToAction from "./_sections/CallToAction";
import Footer from "./_components/Footer";

export default function Page() {
  return (
    <>
      <MainPage />
      <Features />
      <HowItWorks />
      <LandingAccordion />
      <CallToAction />
      <Footer />
    </>
  );
}
