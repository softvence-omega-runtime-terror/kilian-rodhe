"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import emailIcon from "../../../public/image/signinIcon/Icon (2).svg";
import lockIcon from "../../../public/image/signinIcon/Icon (4).svg";
import eyeIcon from "../../../public/image/signinIcon/Icon (8).svg";
import signinIcon from "../../../public/image/signinIcon/signinIcon.svg";

import { setCredentials } from "@/app/store/slices/authSlice";
import { useLoginMutation } from "@/app/store/slices/services/auth/authApi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const ACCENT_COLOR = "#8B6F47";

  const dispatch = useDispatch();
  const router = useRouter();

  const [loginApi, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isLoading) return;

  try {
    const result: any = await loginApi({ email, password }).unwrap();

    //  SUPPORT BOTH RESPONSE SHAPES
    const user = result.data?.user ?? result.user;
    const profile = result.data?.profile ?? result.profile;
    const tokens = result.data?.tokens ?? result.tokens;

    dispatch(
      setCredentials({
        user,
        profile,
        access: tokens?.access,
        refresh: tokens?.refresh,
      })
    );

    toast.success("Logged in successfully!");

    setTimeout(() => {
      router.push("/");
    }, 300);
  } catch (err: any) {
    console.error("Login error:", err);
    toast.error(err?.data?.message || "Login failed");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f7f5] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 my-5 w-full max-w-md border border-[#E8E3DC]">
        {/* Heading */}
        <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#1A1410] text-[36px] font-semibold text-center mt-6 mb-8">
          Sign in to your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Image
                src={emailIcon}
                alt="Email Icon"
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width={16}
                height={16}
              />
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none transition duration-150"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Image
                src={lockIcon}
                alt="Lock Icon"
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width={16}
                height={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none transition duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <FaEyeSlash size={16} />
                ) : (
                  <Image src={eyeIcon} alt="Eye Icon" width={16} height={16} />
                )}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center text-gray-600 font-['Jost']">
              <input
                type="checkbox"
                className={`mr-2 h-4 w-4 rounded border-gray-300 transition duration-150`}
                style={{ accentColor: ACCENT_COLOR }}
              />
              Remember me
            </label>
            <Link
              href="/pages/forgatepassword"
              className={`text-sm font-medium hover:text-[#7a5e3e] transition`}
              style={{ color: ACCENT_COLOR }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
                w-full text-white py-3 rounded-xl mt-8 mb-4 font-semibold transition-all duration-300 shadow-md shadow-[#8B6F47]/20
                ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#7a5e3e]"}
            `}
            style={{
              background: `linear-gradient(to right, ${ACCENT_COLOR}, #7A5F3A)`,
              fontFamily: "'Jost', sans-serif",
            }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <Image src={signinIcon} alt="User Icon" width={16} height={16} />
                  Login
                </>
              )}
            </span>
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm mt-4 text-gray-600 font-['Jost']">
          Don&apos;t have an account?{" "}
          <Link
            href="/pages/createaccount"
            className="font-semibold hover:text-[#7a5e3e] transition"
            style={{ color: ACCENT_COLOR }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
