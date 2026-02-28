"use client";
import React from "react";
import { Jost } from "next/font/google";

const jostFont = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

interface EmptyStateProps {
    message?: string;
    subMessage?: string;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    message = "No products found matching your criteria.",
    subMessage = "Try adjusting your filters.",
    className = ""
}) => {
    return (
        <div className={`text-center py-20 px-4 w-full ${className}`}>
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
            <h3 className={`${jostFont.className} text-xl font-semibold text-gray-800`}>
                {message}
            </h3>
            {subMessage && (
                <p className={`${jostFont.className} mt-2 text-gray-500`}>
                    {subMessage}
                </p>
            )}
        </div>
    );
};

export default EmptyState;
