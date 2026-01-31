"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

import userIcon from "../../../public/image/signinIcon/Icon (1).svg";
import emailIcon from "../../../public/image/signinIcon/Icon (2).svg";
import phoneIcon from "../../../public/image/signinIcon/Icon (3).svg";
import lockIcon from "../../../public/image/signinIcon/Icon (4).svg";
// import userIcon2 from "../../../public/image/signinIcon/Icon (7).svg";
import eyeIcon from "../../../public/image/signinIcon/Icon (8).svg";
import { FaEyeSlash } from "react-icons/fa";
import { useRegisterMutation } from "@/app/store/slices/services/auth/authApi";
import VerifyEmail from "@/components/verifyEmailComponent/VerifyEmail";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();
  const [showVerify, setShowVerify] = useState(false); // 🔹 show VerifyEmail conditionally

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone_number", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password2", confirmPassword);
    if (profileImage) formData.append("image", profileImage);

    try {
      const response = await register(formData).unwrap();

      if (response?.message) {
        setShowVerify(true);
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      alert(err?.data?.message || "Registration failed. Try again.");
    }
  };

  if (showVerify) {
    return <VerifyEmail email={email} />; // Pass email to VerifyEmail component if needed
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="font-['Cormorant_Garamond'] text-[#1A1410] text-[36px] font-semibold text-center mb-7">
          Create New Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">First Name *</label>
            <div className="relative">
              <Image src={userIcon} alt="User" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type="text"
                placeholder="John"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Last Name *</label>
            <div className="relative">
              <Image src={userIcon} alt="User" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Doe"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
            <div className="relative">
              <Image src={emailIcon} alt="Email" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
            <div className="relative">
              <Image src={phoneIcon} alt="Phone" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type="tel"
                placeholder="+49 123 456 7890"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Profile Image</label>
            <label className="flex items-center gap-4 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" width={48} height={48} className="rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">+</div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Password *</label>
            <div className="relative">
              <Image src={lockIcon} alt="Lock" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                {showPassword ? <FaEyeSlash /> : <Image src={eyeIcon} alt="Eye" width={16} height={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password *</label>
            <div className="relative">
              <Image src={lockIcon} alt="Lock" width={16} height={16} className="absolute left-3 top-3" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5">
                {showConfirmPassword ? <FaEyeSlash /> : <Image src={eyeIcon} alt="Eye" width={16} height={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-b from-[#8b6f47] to-[#7a5f3a] h-[48px] text-white rounded-lg mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
