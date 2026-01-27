"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Jost } from "next/font/google";

const jostFont = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

type ToastType = "success" | "info" | "error";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const ToastMessage = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    let bgColor = "bg-green-600";
    let icon = "✅";

    if (type === "info") {
        bgColor = "bg-blue-600";
        icon = "ℹ️";
    } else if (type === "error") {
        bgColor = "bg-red-600";
        icon = "⚠️";
    }

    return (
        <motion.div
            className={`${jostFont.className} fixed top-24 right-4 ${bgColor} text-white px-6 py-4 rounded shadow-2xl z-[100] text-center font-medium flex items-center gap-3`}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
        >
            <span className="text-xl">{icon}</span>
            <span>{message}</span>
        </motion.div>
    );
};

export default ToastMessage;
