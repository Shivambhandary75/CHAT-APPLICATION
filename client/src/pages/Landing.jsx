import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-crazy-yellow)] relative overflow-hidden">

      {/* Background Accent Layer */}
      <div className="absolute inset-0 bg-[var(--color-crazy-yellow)]"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between px-6 md:px-16 py-10">

        {/* Header Section */}
        <div className="text-center mt-8">
          <h1
            className="text-6xl md:text-8xl font-black tracking-tight"
            style={{ fontFamily: "'Betania Patmos In', cursive" }}
          >
            YappHere
          </h1>

          <div className="h-1 bg-black w-32 mx-auto my-6"></div>

          <p className="text-xl md:text-2xl font-black uppercase tracking-wide">
            Just Yapp It out!!!
          </p>
        </div>

        {/* Feature Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16 max-w-6xl mx-auto w-full">

         {[
  {
    title: "ADD FRIENDS",
    desc: "Find, connect, and grow your circle instantly.",
    color: "bg-[var(--color-crazy-blue)]",
  },
  {
    title: "CREATE GROUPS",
    desc: "Start group chats and bring your crew together.",
    color: "bg-[var(--color-crazy-green)]",
  },
  {
    title: "REAL-TIME CHAT",
    desc: "Send and receive messages instantly with zero delay.",
    color: "bg-[var(--color-crazy-green)]",
  },
  {
    title: "SHARE MULTIMEDIA",
    desc: "Send images, videos, and files seamlessly.",
    color: "bg-[var(--color-crazy-blue)]",
  },


          ].map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all`}
            >
              <h3 className="font-black text-lg mb-2 uppercase">
                {feature.title}
              </h3>
              <p className="font-bold text-base">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-10">

          <button
            onClick={() => navigate("/signup")}
            className="bg-[var(--color-crazy-blue)] border-4 border-black font-black px-12 py-5 text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            GET STARTED
          </button>

          <button
            onClick={() => navigate("/login")}
            className="bg-[var(--color-crazy-green)] border-4 border-black font-black px-12 py-5 text-2xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            LOGIN
          </button>

        </div>

        {/* Footer */}
        <div className="text-center mb-4">
          <p className="font-black text-xl uppercase tracking-wide">
            WELCOME TO YAPPHERE
          </p>
        </div>

      </div>
    </div>
  );
};

export default Landing;
    