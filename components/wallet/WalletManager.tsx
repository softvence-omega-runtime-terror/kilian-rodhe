"use client";

import React, { useState } from "react";
import { useGetWalletQuery } from "@/app/store/slices/services/wallet/walletApi";
import TopUpModal from "./TopUpModal";
import { Jost } from "next/font/google";
import { motion } from "framer-motion";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { toast } from "sonner";

const jostFont = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const WalletManager = () => {
    const { data: walletData, isLoading } = useGetWalletQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const wallet = walletData?.results?.[0];

    return (
        <div className={`space-y-4 ${jostFont.className}`}>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-700">
                Wallet Status
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Free Generations card */}
                <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Free Generations</p>
                    {isLoading ? (
                        <div className="h-8 w-12 bg-gray-100 animate-pulse rounded"></div>
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">{wallet?.free_generations ?? 0}</p>
                    )}
                </div>

                {/* Balance card */}
                <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Balance</p>
                    {isLoading ? (
                        <div className="h-8 w-16 bg-gray-100 animate-pulse rounded"></div>
                    ) : (
                        <p className="text-2xl font-bold text-gray-900">
                            €{Number(wallet?.generation_balance ?? 0).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            <motion.button
                onClick={() => {
                    if (!isAuthenticated) {
                        toast.error("Please login to top up your balance.");
                        return;
                    }
                    setIsModalOpen(true);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gray-900 text-white rounded-md uppercase tracking-[2.1px] text-[12px] font-medium hover:bg-black transition-colors shadow-md"
            >
                Top Up Balance
            </motion.button>

            <TopUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default WalletManager;
