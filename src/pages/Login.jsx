import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../context/NotificationContext";
import boundarylogo from "../assets/boundary.png";
import image1 from "../images/image1.png";
import { requestOTP, validateOTP, resendOTP } from "../api";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const { success, error, warn } = useNotify();
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    if (!email) {
      warn("Enter your email first!");
      return;
    }

    try {
      success("OTP will be sent to your email shortly!");
      await requestOTP(email);
      setIsOtpGenerated(true);
      success("OTP sent successfully!");
    } catch (err) {
      error("Failed to send OTP. Please try again.");
    }
  };

  const handleLogin = async () => {
    if (!otp) {
      warn("Enter OTP first!");
      return;
    }

    try {
      const response = await validateOTP(email, otp);
      if (response.success && response.state) {
        Cookies.set("state", response.state, { expires: 7 });
        window.location.href = "/dashboard";
        success("Login successful!");
      } else {
        error("Invalid OTP! Try again.");
      }
    } catch (err) {
      error("Invalid OTP! Please check and try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOTP(email);
      success("OTP resent successfully!");
    } catch (err) {
      error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 to-purple-100 w-[100vw]">
      <div className="bg-white shadow-lg w-96 p-6 text-center">
        <div className="flex justify-center items-center gap-4 mb-10">
          <img src={image1} alt="Image 1" className="w-7 h-9 mb-2" />
          <img
            src={boundarylogo}
            alt="Boundary Logo"
            className="w-22 h-9 mb-2"
          />
        </div>

        <h2 className="text-xl font-semibold text-black mb-16">
          Audit App | Sign In
        </h2>

        <div className="mt-6 text-left">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border-b border-[rgba(218,174,227,255)] p-2 focus:outline-none focus:border-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isOtpGenerated}
          />
        </div>

        {/* OTP Field: always rendered to preserve height */}
        <div className="mt-4 text-left mb-10 min-h-[60px]">
          <input
            type="text"
            placeholder="Enter OTP"
            className={`w-full border-b border-[rgba(218,174,227,255)] p-2 focus:outline-none focus:border-purple-300 transition-opacity duration-200 ${
              isOtpGenerated ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Buttons: aligned side by side if OTP is generated */}
        {isOtpGenerated ? (
          <>
            <div className="flex justify-center gap-3 mb-6">
              <button
                onClick={handleLogin}
                className="w-1/2 bg-white text-purple-500 border border-purple-500 py-2 hover:bg-gray-100 transition shadow-none"
              >
                Submit
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleGenerateOtp}
            className="mb-6 bg-white text-purple-500 border border-purple-500 py-2 hover:bg-gray-100 transition shadow-none"
          >
            Generate OTP
          </button>
        )}

        {isOtpGenerated && (
          <p
            onClick={handleResendOtp}
            className="w-auto text-gray-500 text-sm  transition shadow-none"
          >
            Didn't received OTP -{" "}
            <span className="underline cursor-pointer text-purple-500">
              Resend OTP
            </span>
          </p>
        )}
        <p className=" text-gray-500 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-gray-500 cursor-pointer underline"
            onClick={() =>
              (window.location.href = "https://boundary.agency/hubspot-audit/")
            }
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
