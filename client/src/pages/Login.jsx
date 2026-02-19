import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login:", formData);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-crazy-green)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Container */}
        <div className="bg-[var(--color-crazy-pink)] border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              YappHere
            </h1>
            <div className="h-1 bg-black w-20 mx-auto mb-3"></div>
            <h2 className="text-xl md:text-2xl font-black uppercase">
              LOGIN
            </h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block font-black text-base mb-1 uppercase">
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-4 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                placeholder="Enter your username..."
                required
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-black text-base mb-1 uppercase">
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-4 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-0.5 focus:-translate-x-0.5 transition-all"
                placeholder="Enter your password..."
                required
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[var(--color-crazy-blue)] border-4 border-black font-black px-6 py-3 text-lg uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              ENTER THE ZONE
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-1 h-1 bg-black"></div>
            <span className="px-3 font-black uppercase text-xs">OR</span>
            <div className="flex-1 h-1 bg-black"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="font-bold mb-2 uppercase text-xs">
              NEW TO THE CHAOS?
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-[var(--color-crazy-green)] border-4 border-black font-black px-6 py-2 text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-x-[2px] active:translate-y-[2px]"
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="font-bold uppercase text-xs hover:underline"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
