import React from "react";
import MainPage from "./_sections/MainPage";
import AiGeneration from "./_sections/AiGeneration";
import TeacherControl from "./_sections/TeacherControl";
import HowItWorks from "./_sections/HowItWorks";
import Feature from "./_sections/Features";
import Roles from "./_sections/Roles";
import Analytics from "./_sections/Analytics";
import LandingAccordion from "./_sections/Accordion";
import CallToAction from "./_sections/CallToAction";
import Footer from "./_components/Footer";

export default function Page() {
  return (
    <>
      <MainPage />
      <AiGeneration />
      <TeacherControl />
      <Feature />
      <Roles />
      <HowItWorks />
      <Analytics />
      <LandingAccordion />
      <CallToAction />
      <Footer />
    </>
  );
}
