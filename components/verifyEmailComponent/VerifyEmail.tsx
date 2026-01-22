"use client";

import { setCredentials } from "@/app/store/slices/authSlice";
import { useVerifyOtpMutation } from "@/app/store/slices/services/auth/authApi";
import { cleanString } from "@/app/utils/cleanString";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface VerifyEmailProps {
  email: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: { id: number; email: string } | string;
    profile?: {
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      image?: string;
    };
    tokens: {
      access?: string;
      refresh?: string;
    };
  };
}

export default function VerifyEmail({ email }: VerifyEmailProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((d) => d === "")) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    const otpValue = otp.join("");

    try {
      const payload: VerifyOtpResponse = await verifyOtp({ email, otp: otpValue }).unwrap();

      // Merge user and profile before dispatching
      const user =
        typeof payload.data.user === "string"
          ? JSON.parse(payload.data.user)
          : payload.data.user;

      const fullUser = { ...user, profile: payload.data.profile || {} };

      // Dispatch to Redux
      dispatch(
        setCredentials({
          user: fullUser,
          access: payload.data.tokens.access || "",
          refresh: payload.data.tokens.refresh || "",
        })
      );

      toast.success(payload.message);
      console.log("Full user with profile dispatched:", fullUser);

      router.push("/"); // navigate home
    } catch (err: any) {
      toast.error(err?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Verify Your Email
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          We sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:ring-1 focus:ring-gray-400 focus:outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-[#8b6f47] to-[#7a5f3a] h-12 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
