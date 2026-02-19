import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import signupImage from "../assets/images/signup_image.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlertState({
        isOpen: true,
        message: "PASSWORDS DO NOT MATCH!",
      });
      return;
    }

    console.log("Signup:", formData);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-[var(--color-crazy-blue)] grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
      {/* Left Side - Signup Form */}
      <div className="flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-md w-full my-auto">
          <div className="bg-[var(--color-crazy-yellow)] border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-5">

          {/* Header */}
          <div className="text-center mb-4">
            <h1
              className="text-4xl font-black tracking-tight"
              style={{ fontFamily: "'Betania Patmos In', cursive" }}
            >
              YappHere
            </h1>
            <div className="h-1 bg-black w-20 mx-auto my-2"></div>
            <h2 className="text-xl font-black uppercase">Register</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Username */}
            <div>
              <label className="block font-black text-sm mb-1 uppercase">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose username..."
                className="w-full border-3 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-black text-sm mb-1 uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email..."
                className="w-full border-3 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-black text-sm mb-1 uppercase">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create password..."
                className="w-full border-3 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-black text-sm mb-1 uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password..."
                className="w-full border-3 border-black px-3 py-2 text-base font-bold bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ fontFamily: "var(--font-display)" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[var(--color-crazy-green)] border-3 border-black font-black px-5 py-2.5 text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="my-3 flex items-center">
            <div className="flex-1 h-1 bg-black"></div>
            <span className="px-2 font-black uppercase text-xs">OR</span>
            <div className="flex-1 h-1 bg-black"></div>
          </div>

          {/* Login */}
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[var(--color-crazy-pink)] border-3 border-black font-black px-5 py-2.5 text-base uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            Login
          </button>

          {/* Back */}
          <div className="mt-3 text-center">
            <button
              onClick={() => navigate("/")}
              className="font-bold uppercase text-sm hover:underline"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img
          src={signupImage}
          alt="Signup Visual"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'linear-gradient(135deg, #A3CCDA 0%, #BDE3C3 30%, #A3CCDA 100%)'
          }}
        ></div>
      </div>

      <CustomAlert
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ isOpen: false, message: "" })}
        message={alertState.message}
        type="alert"
      />
    </div>
  );
};

export default Signup;
