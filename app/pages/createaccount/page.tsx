"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import toast, { Toaster } from 'react-hot-toast';

import userIcon from '../../../public/image/signinIcon/Icon (1).svg';
import emailIcon from '../../../public/image/signinIcon/Icon (2).svg';
import phoneIcon from '../../../public/image/signinIcon/Icon (3).svg';
import lockIcon from '../../../public/image/signinIcon/Icon (4).svg';
import googleIcon from '../../../public/image/signinIcon/Icon (5).svg';
import facebookIcon from '../../../public/image/signinIcon/Icon (6).svg';
import userIcon2 from '../../../public/image/signinIcon/Icon (7).svg';
import eyeIcon from '../../../public/image/signinIcon/Icon (8).svg';
import searchIcon from '../../../public/image/signinIcon/Frame.svg';

import { FaEyeSlash } from 'react-icons/fa';

export default function CreateAccount() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // 🔥 New Social Login Loaders
    const [googleLoading, setGoogleLoading] = useState(false);
    const [facebookLoading, setFacebookLoading] = useState(false);

    const router = useRouter(); 

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);

            toast.success('Account created successfully! Redirecting to login...', {
                duration: 4000,
                style: { background: '#333', color: '#fff' },
            });

            setTimeout(() => router.push('/pages/login'), 1000);

        }, 2000);
    };

    // 🔥 Updated Social Login Handler
    const handleSocialLogin = (platform: string) => {
        // Reset both first
        setGoogleLoading(false);
        setFacebookLoading(false);

        if (platform === "Google") setGoogleLoading(true);
        if (platform === "Facebook") setFacebookLoading(true);

        setTimeout(() => {
            setGoogleLoading(false);
            setFacebookLoading(false);

            toast.success(`Welcome to Thundra via ${platform}!`, {
                duration: 4000,
                style: { background: '#28a745', color: '#fff' },
            });

            setTimeout(() => router.push('/'), 1000);

        }, 1500);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Toaster />

            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200">
                <h2 className="font-['Cormorant_Garamond'] text-[#1A1410] text-[36px] leading-[24px] font-semibold text-center mb-7">
                    Create New Account
                </h2>

                <p className="text-center text-gray-500 tracking-[1] text-sm mb-6"
                   style={{ fontFamily: "'Jost', sans-serif" }}>
                    Join thousands of customers who trust Thundra for personalized, high-quality products with AI-powered design.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    {/* First + Last Name */}
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-2 text-gray-700">First Name *</label>
                            <div className="relative">
                                <Image src={userIcon} alt="User Icon" width={16} height={16} className="absolute left-3 top-3" />
                                <input type="text" placeholder="John" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Last Name *</label>
                            <div className="relative">
                                <Image src={userIcon} alt="User Icon" width={16} height={16} className="absolute left-3 top-3" />
                                <input type="text" placeholder="Doe" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Email Address *</label>
                        <div className="relative">
                            <Image src={emailIcon} alt="Email Icon" width={16} height={16} className="absolute left-3 top-3" />
                            <input type="email" placeholder="your@email.com" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                        <div className="relative">
                            <Image src={phoneIcon} alt="Phone Icon" width={16} height={16} className="absolute left-3 top-3" />
                            <input type="tel" placeholder="+49 123 456 7890" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Password *</label>
                        <div className="relative">
                            <Image src={lockIcon} alt="Lock Icon" width={16} height={16} className="absolute left-3 top-3" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                                {showPassword ? <FaEyeSlash /> : <Image src={eyeIcon} alt="Eye Icon" width={16} height={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password *</label>
                        <div className="relative">
                            <Image src={lockIcon} alt="Lock Icon" width={16} height={16} className="absolute left-3 top-3" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5">
                                {showConfirmPassword ? <FaEyeSlash /> : <Image src={eyeIcon} alt="Eye Icon" width={16} height={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm text-gray-600">
                            <input type="checkbox" className="mr-2" />
                            I agree to the <a href="#" className="text-yellow-800 underline ml-1">Terms & Conditions</a> and <a href="#" className="text-yellow-800 underline ml-1">Privacy Policy</a>
                        </label>

                        <label className="flex items-center text-sm text-gray-600">
                            <input type="checkbox" className="mr-2" />
                            I want to receive marketing emails about new products and special offers
                        </label>
                    </div>

                    {/* Language */}
                    <div className="flex justify-end mt-4">
                        <div className="relative">
                            <Image src={searchIcon} alt="Search Icon" width={16} height={16} className="absolute left-3 top-3" />
                            <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-600 pl-10">
                                <option>English</option>
                                <option>Deutsch</option>
                                <option>Español</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button 
                        type="submit"
                        className={`w-full h-[48px] text-white py-2 rounded-lg mt-4 transition-all ${
                            isLoading ? 'bg-gray-500 cursor-not-allowed' : 
                            'bg-gradient-to-b from-[#8b6f47] to-[#7a5f3a] hover:bg-[#7a5e3e]'}`}
                        disabled={isLoading}
                    >
                        <span className="inline-flex items-center gap-2">
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 
                                    0 0 5.373 0 12h4zm2 5.291A7.962 
                                    7.962 0 014 12H0c0 
                                    3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Image src={userIcon2} alt="User Icon" width={16} height={16} />
                            )}
                            {isLoading ? "Processing..." : "Create Account"}
                        </span>
                    </button>

                    {/* Divider */}
                    <div className="text-center flex items-center gap-1 text-gray-500 text-sm my-3">
                        <hr className='flex-1 border-t-[1px] border-[#0000001A]' />
                        <span className='px-2'>Or sign up with</span>
                        <hr className='flex-1 border-t-[1px] border-[#0000001A]' />
                    </div>

                    {/* 🔥 Social Login Buttons */}
                    <div className="flex justify-center gap-4">

                        {/* GOOGLE */}
                        <button 
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className={`flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/2 transition-all 
                                ${googleLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            disabled={googleLoading || facebookLoading}
                        >
                            {googleLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 
                                    0 0 5.373 0 12h4zm2 5.291A7.962 
                                    7.962 0 014 12H0c0 
                                    3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Image src={googleIcon} alt="Google Icon" width={16} height={16} />
                            )}
                            {googleLoading ? "Processing..." : "Google"}
                        </button>

                        {/* FACEBOOK */}
                        <button 
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className={`flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-1/2 transition-all 
                                ${facebookLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                            disabled={googleLoading || facebookLoading}
                        >
                            {facebookLoading ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 
                                    0 0 5.373 0 12h4zm2 5.291A7.962 
                                    7.962 0 014 12H0c0 
                                    3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Image src={facebookIcon} alt="Facebook Icon" width={16} height={16} />
                            )}
                            {facebookLoading ? "Processing..." : "Facebook"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}
