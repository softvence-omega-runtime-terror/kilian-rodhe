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

import { setCredentials } from "@/app/store/slices/authSlice";
import { useLoginMutation } from "@/app/store/slices/services/auth/authApi";


interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    phone_number: string;
    image: string;
  };
  role: string; // 🔹 Role included
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ACCENT_COLOR = "#8B6F47";

  const dispatch = useDispatch();
  const router = useRouter();

  const [loginApi, { isLoading }] = useLoginMutation();

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      const result: LoginResponse = await loginApi({ email, password }).unwrap();

      console.log(result, "login info")

      // 🔹 DISPATCH TO REDUX
      dispatch(
        setCredentials({
          user: result.user,
          profile: result.profile,
          access: result.access,
          refresh: result.refresh,
          role: result.role, // store role
        })
      );

      toast.success("Logged in successfully");

      // 🔹 NAVIGATE BASED ON ROLE
      if (result.role === "superuser") {
        router.push("/admin"); // superuser/admin dashboard
      } else {
        router.push("/"); // regular user home
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || "Invalid email or password";
      toast.error(errorMsg);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f7f5] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 my-5 w-full max-w-md border border-[#E8E3DC]">
        {/* Heading */}
        <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#1A1410] text-[36px] font-semibold text-center mt-6 mb-8">
          Sign in to your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <FaEyeSlash size={16} />
                ) : (
                  <Image src={eyeIcon} alt="Eye" width={16} height={16} />
                )}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4"
                style={{ accentColor: ACCENT_COLOR }}
              />
              Remember me
            </label>
            <Link
              href="/pages/forgatepassword"
              style={{ color: ACCENT_COLOR }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-xl mt-6 font-semibold transition ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#7a5e3e]"
              }`}
            style={{
              background: `linear-gradient(to right, ${ACCENT_COLOR}, #7A5F3A)`,
            }}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* Signup */}
        <div className="text-center text-sm mt-4 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/pages/createaccount"
            style={{ color: ACCENT_COLOR }}
            className="font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

