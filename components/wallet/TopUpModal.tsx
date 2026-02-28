"use client";

import React, { useState } from "react";
import { useTopUpMutation } from "@/app/store/slices/services/wallet/walletApi";
import { toast } from "sonner";
import { Jost } from "next/font/google";

const jostFont = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface TopUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose }) => {
    const [amount, setAmount] = useState<number>(10);
    const [currency, setCurrency] = useState<string>("eur");
    const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
    const [topUp, { isLoading }] = useTopUpMutation();

    if (!isOpen) return null;

    const handleTopUp = async () => {
        try {
            const res = await topUp({
                amount,
                currency,
                payment_method: paymentMethod,
                success_url: `${window.location.origin}/pages/payment/success`,
                cancel_url: `${window.location.origin}/pages/payment/cancel`,
            }).unwrap();

            if (res.success && res.data.session_url) {
                toast.success("Redirecting to payment...");
                window.location.href = res.data.session_url;
            } else {
                toast.error(res.message || "Failed to initiate payment.");
            }
        } catch (error) {
            console.error("Top-up error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className={`bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden ${jostFont.className}`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800 tracking-tight uppercase">Top Up Wallet</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                {currency === 'EUR' ? '€' : '$'}
                            </span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none transition-all text-lg font-medium"
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Currency Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['eur', 'usd'].map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => setCurrency(curr)}
                                    className={`py-2 border rounded-md transition-all uppercase ${currency === curr
                                            ? 'bg-red-800 text-white border-red-800 shadow-md'
                                            : 'border-gray-200 text-gray-600 hover:border-red-800'
                                        }`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'stripe', label: 'Stripe' },
                                { id: 'paypal', label: 'PayPal' }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    disabled={method.id === "paypal"}
                                    onClick={() => setPaymentMethod(method.id as "stripe" | "paypal")}
                                    className={`py-2 border rounded-md transition-all ${paymentMethod === method.id
                                            ? 'bg-red-800 text-white border-red-800 shadow-md'
                                            : method.id === "paypal"
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'border-gray-200 text-gray-600 hover:border-red-800'
                                        }`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 italic">
                    <button
                        onClick={handleTopUp}
                        disabled={isLoading || amount <= 0}
                        className={`w-full py-4 uppercase tracking-[2.4px] font-medium transition-all ${isLoading || amount <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800 shadow-lg active:scale-[0.98]'
                            }`}
                    >
                        {isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-widest leading-relaxed">
                        Secure payment processing. You will be redirected to our payment provider.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TopUpModal;
