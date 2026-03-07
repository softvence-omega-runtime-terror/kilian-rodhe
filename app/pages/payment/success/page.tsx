"use client";

import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, ShoppingBag, LayoutDashboard } from "lucide-react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const jostFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"] });
const cormorantItalic = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["italic"] });

const SuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type");

    const isTopUp = type === "topup";

    return (
        <>
            <Navbar />
            <div className={`${jostFont.className} min-h-[70vh] bg-[#f9f7f5] flex flex-col items-center justify-center px-4 py-20`}>
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border-2 border-[#E8E3DC]">
                    <div className="mx-auto w-20 h-20 bg-green-50 flex items-center justify-center rounded-full mb-6">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className={`${cormorantItalic.className} text-4xl font-bold text-[#1A1410] mb-4`}>
                        {isTopUp ? "Top-up Successful!" : "Payment Successful!"}
                    </h1>

                    <p className="text-gray-600 mb-8">
                        {isTopUp
                            ? "Your wallet balance has been updated successfully. You can now use your credits for AI generation."
                            : "Thank you for your purchase. Your order has been placed and is being processed."}
                    </p>

                    <div className="space-y-4">
                        {isTopUp ? (
                            <>
                                <button
                                    onClick={() => router.push(`/pages/my-creation/create-your-design${searchParams.get("id") ? `?id=${searchParams.get("id")}` : ""}`)}
                                    className="w-full bg-[#a07d48] text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#8a6a3f] transition duration-300 shadow-lg shadow-[#a07d48]/20 flex items-center justify-center gap-2"
                                >
                                    <LayoutDashboard size={18} />
                                    Back to Studio
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push("/pages/shop")}
                                    className="w-full bg-[#a07d48] text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#8a6a3f] transition duration-300 shadow-lg shadow-[#a07d48]/20 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={18} />
                                    Continue Shopping
                                </button>

                                <button
                                    onClick={() => router.push("/pages/my-creation")}
                                    className="w-full bg-white text-[#1A1410] border-2 border-[#E8E3DC] py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-2"
                                >
                                    View Order
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SuccessPage;
