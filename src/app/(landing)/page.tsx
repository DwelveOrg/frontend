import React from "react";
import MainPage from "./_sections/MainPage";
import HowItWorks from "./_sections/HowItWorks";
import Feature from "./_sections/Features";
import LandingAccordion from "./_sections/Accordion";
import CallToAction from "./_sections/CallToAction";
import Footer from "./_components/Footer";

export default function Page() {
  return (
    <>
      <MainPage />
      <Feature />
      <HowItWorks />
      <LandingAccordion />
      <CallToAction />
      <Footer />
    </>
  );
}
