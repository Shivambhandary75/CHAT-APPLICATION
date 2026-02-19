import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-crazy-yellow)] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Main Hero Container */}
        <div className="bg-[var(--color-crazy-pink)] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-black mb-3 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              YappHere
            </h1>
            <div className="h-1 bg-black w-24 mx-auto mb-4"></div>
            <p className="text-lg md:text-xl font-bold uppercase tracking-wide">
              PURE TEXT ENERGY. NO LIMITS.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="bg-[var(--color-crazy-blue)] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-base mb-1 uppercase">REAL-TIME CHAT</h3>
              <p className="font-bold text-sm">Connect instantly with friends and groups</p>
            </div>
            <div className="bg-[var(--color-crazy-green)] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-base mb-1 uppercase">RETRO VIBES</h3>
              <p className="font-bold text-sm">Old school aesthetics, modern tech</p>
            </div>
            <div className="bg-[var(--color-crazy-green)] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-base mb-1 uppercase">GROUP CHATS</h3>
              <p className="font-bold text-sm">Create chaos zones with your crew</p>
            </div>
            <div className="bg-[var(--color-crazy-blue)] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-base mb-1 uppercase">NO FILTERS</h3>
              <p className="font-bold text-sm">Pure text communication at its finest</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/signup")}
              className="bg-[var(--color-crazy-blue)] border-4 border-black font-black px-8 py-4 text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px] w-full sm:w-auto"
            >
              GET STARTED
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-[var(--color-crazy-green)] border-4 border-black font-black px-8 py-4 text-xl uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px] w-full sm:w-auto"
            >
              LOGIN
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="font-black text-lg uppercase tracking-wide">
            WELCOME TO THE CHAOS ZONE
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
