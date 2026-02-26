"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { Jost, Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const jostFont = Jost({ subsets: ["latin"], weight: ["400", "500", "600"] });
const cormorantItalic = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["italic"] });

const CancelPage = () => {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <div className={`${jostFont.className} min-h-[70vh] bg-[#f9f7f5] flex flex-col items-center justify-center px-4 py-20`}>
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border-2 border-[#E8E3DC]">
                    <div className="mx-auto w-20 h-20 bg-red-50 flex items-center justify-center rounded-full mb-6">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>

                    <h1 className={`${cormorantItalic.className} text-4xl font-bold text-[#1A1410] mb-4`}>
                        Payment Cancelled
                    </h1>

                    <p className="text-gray-600 mb-8">
                        The payment process was cancelled or didn&apos;t go through. Don&apos;t worry, your items are still in your cart.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => router.push("/pages/payment")}
                            className="w-full bg-[#1A1410] text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-black transition duration-300 shadow-lg flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Try Again
                        </button>

                        <button
                            onClick={() => router.push("/pages/shipping")}
                            className="w-full bg-white text-[#1A1410] border-2 border-[#E8E3DC] py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gray-50 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Return to Shipping
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CancelPage;
