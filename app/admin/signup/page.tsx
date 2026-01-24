"use client";

import React, { useState } from "react";
import {
  Shield,
  Sparkles,
  CheckCircle,
  Mail,
  Lock,
  Eye,
  Globe,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

import { setCredentials } from "@/app/store/slices/authSlice";
import { useLoginMutation } from "@/app/store/slices/services/auth/authApi";

// ---------- Small Reusable Components ----------
type FeatureCardProps = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const FeatureCard = ({ title, icon: Icon }: FeatureCardProps) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center mb-2 sm:mb-4 cursor-pointer">
    <div className="p-2 sm:p-3 mr-3 sm:mr-4 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
    </div>
    <span className="text-[15px] font-normal text-[#1A1410]">{title}</span>
  </div>
);

type StatItemProps = {
  number: string;
  label: string;
};

const StatItem = ({ number, label }: StatItemProps) => (
  <div className="text-left p-2 sm:p-4">
    <div className="text-[16px] font-normal text-[#1A1410]">{number}</div>
    <div className="text-[12px] text-[#6B6560] mt-0.5 sm:mt-1">{label}</div>
  </div>
);

// ---------- Login Response Type ----------
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
  role: string;
}

// ---------- Sign In Form ----------
const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loginApi] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const result: LoginResponse = await loginApi({ email, password }).unwrap();

      // Store in Redux
      dispatch(
        setCredentials({
          user: result.user,
          profile: result.profile,
          access: result.access,
          refresh: result.refresh,
          role: result.role,
        })
      );

      toast.success("Logged in successfully");
      setSuccess(true);

      setTimeout(() => {
        // Navigate based on role
        if (result.role === "superuser") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 800);
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white p-6 sm:p-10 rounded-[14px] border border-gray-200 shadow-lg w-full max-w-sm">
      {success && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-green-600 text-sm font-medium animate-fade-in">
          ✓ Login Successful
        </div>
      )}

      <h3 className="text-[20px] font-normal mb-2 text-[#1A1410]">Sign In</h3>
      <p className="text-[#6B6560] text-[16px] font-normal mb-6 sm:text-sm sm:mb-8">
        Enter your credentials to access the admin dashboard
      </p>

      <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@thundra.com"
              className="w-full pl-9 pr-3 py-2 bg-gray-100 border-2 border-[#E8E3DC] rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-9 pr-9 py-2 bg-gray-100 border-2 border-[#E8E3DC] rounded-lg text-sm"
            />
            <Eye
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-700">Remember me</span>
          </div>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Forgot password?
          </a>
        </div>

        {/* Language Selector */}
        <div className="flex justify-end w-full">
          <div className="relative inline-flex items-center rounded-lg border border-[#8e8e93] bg-white">
            <Globe className="w-4 h-4 text-gray-500 absolute left-3" />
            <select className="px-10 py-1.5 text-sm bg-transparent rounded-lg appearance-none">
              <option>English</option>
              <option>Spanish</option>
              <option>Bangla</option>
              <option>Japanese</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3" />
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-gradient-to-b from-[#8B6F47] to-[#7A5F3A] text-white font-semibold rounded-lg shadow-md flex items-center justify-center space-x-2 transition
            ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-stone-800"}`}
          style={{ backgroundColor: "#8B7355" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
};

// ---------- Page Layout ----------
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-4 px-4 sm:px-6 lg:px-8">
      {/* Centered Content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Left Side */}
          <div className="w-full lg:w-1/2 lg:pr-10 flex flex-col items-center lg:items-start">
            <div className="mb-8 sm:mb-10 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-1 sm:mb-2">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-black" />
                <h1 className="text-2xl font-semibold ml-2">
                  Thundra
                  <span className="align-super text-xs sm:text-sm ml-0.5">
                    ™
                  </span>
                </h1>
              </div>
              <h2 className="text-[20px] text-[#1A1410] font-normal mb-2 sm:mb-3">
                Welcome Back
              </h2>
              <p className="text-[16px] text-[#6B6560]">
                Manage your e-commerce platform with powerful AI-driven tools
                and comprehensive analytics.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-16 w-full">
              <FeatureCard title="Secure Admin Access" icon={Shield} />
              <FeatureCard title="AI-Powered Design Tools" icon={Sparkles} />
              <FeatureCard title="Quality Management" icon={CheckCircle} />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#E8E3DC] pt-4 sm:pt-6 w-full">
              <StatItem number="2,847" label="Total Orders" />
              <StatItem number="1,834" label="Customers" />
              <StatItem number="156" label="Products" />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full max-w-sm flex justify-center">
            <SignInForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 w-full py-4">
        © 2025 Thundra. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
