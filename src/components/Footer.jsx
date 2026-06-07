import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-ec-border bg-ec-surface">
      <div className="py-6 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-ec-accent flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">C</span>
            </div>
            <span className="text-[13px] font-semibold text-ec-highlight">
              Connect<span className="text-ec-accent">Karo</span>
            </span>
          </div>
          <p className="text-[13px] text-ec-text-sub">
            © 2026 Connect-Karo. Built for professional networking.
          </p>
          <div className="flex gap-5 text-[13px] text-ec-text-sub">
            <Link to="/privacy" className="hover:text-ec-text transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-ec-text transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-ec-text transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
