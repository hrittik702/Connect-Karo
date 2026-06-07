import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import AnimatedBackground from "./AnimatedBackground";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-ec-root text-ec-text">
      {/* Network Particle Background */}
      <AnimatedBackground />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Page Content Container */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
