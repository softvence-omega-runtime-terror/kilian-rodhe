"use client";

import React, { useState } from "react";
// ➡️ Import useRouter for navigation
import { useRouter } from "next/navigation";
import Image from "next/image";
// ✅ Framer Motion import: Variants TargetAndTransition
import { motion, type Variants, type TargetAndTransition } from "framer-motion";

// --- Imported Components (Assumed to exist in your project structure) ---
import LivePreviewModal from "@/components/previewModel";
import CustomTextDesign from "@/components/customTextDesign";
import AiDesignGenerate from "./aiDesignGenerate";

// --- Image Imports (Assumed to exist in the specified paths) ---
import aiDesignIcon from "../public/image/livePreview/aidesignIcon.svg";
import alineIcon from "../public/image/livePreview/alineIcon.svg";
import colorIcon from "../public/image/livePreview/colorIcon.svg";
import imageIcon from "../public/image/livePreview/imageIcon.svg";
import layerIcon from "../public/image/livePreview/layerIcon.svg";
import reloadIcon from "../public/image/livePreview/reloadIcon.svg";
import scaleIcon from "../public/image/livePreview/scaleIcon.svg";
import secondTIcon from "../public/image/livePreview/secondTicon.svg";
import specialIcon from "../public/image/livePreview/specialIcon.svg";
import tIcon from "../public/image/livePreview/tIcon.svg";
import tshirtImage from "../public/image/livePreview/tshirt.jpg";
import bachIcon from "../public/image/livePreview/bachIcon.svg";
import shoppingIcon from "../public/image/livePreview/shopingIcon.svg";

import { Jost, Cormorant_Garamond } from "next/font/google";

const jostFont = Jost({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    style: ["italic"],
});

// ---------------- CombinedDesignPageFixed Component ----------------
const CombinedDesignPageFixed = () => {
    // 1️⃣ Initialize the router
    const router = useRouter();

    // State to manage the active design mode: 'ai' or 'text'
    const [designMode, setDesignMode] = useState("ai");

    // Lifted modal state so modal control is available at the top level
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openPreviewModal = () => setIsModalOpen(true);
    const closePreviewModal = () => setIsModalOpen(false);

    // Function to handle navigation to the shipping page
    const handleContinueShopping = () => {
    
        router.push("/pages/shipping");
    };


    const designTools = [
        { src: tIcon, label: "Text" },
        { src: colorIcon, label: "Colors" },
        { src: layerIcon, label: "Layers" },
        { src: reloadIcon, label: "Rotate" },
        { src: scaleIcon, label: "Scale" },
        { src: alineIcon, label: "Align" },
        { src: imageIcon, label: "Images" },
        { src: specialIcon, label: "AI Tools" },
    ];

    const fadeInVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const toolsStagger: Variants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const buttonHover: TargetAndTransition = {
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 },
    };

    // Define active and inactive button styles
    const activeModeStyle =
        "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-md";
    const inactiveModeStyle = "text-gray-600 hover:bg-gray-200";

    return (
        <div className=" bg-gray-50 font-sans text-gray-800 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* --- Left Column (Product Preview) --- */}
                <motion.div
                    className=" rounded-lg overflow-hidden p-4 sm:p-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                >
                    <section>
                        <header className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
                            <div className="text-left">
                                <p
                                    className="text-xs uppercase tracking-[2.4px] text-[#6B6B6B]"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                    LIVE PREVIEW
                                </p>
                                <h1
                                    className="text-xl md:text-2xl font-serif text-[#1A1A1A] font-normal mt-0.5 italic"
                                    style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
                                >
                                    Premium Cotton T-Shirt
                                </h1>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`${jostFont.className} text-[12px] uppercase text-[#6B6B6B] tracking-[2.4px]`}
                                >
                                    price
                                </span>
                                <br />
                                <p
                                    className="text-2xl md:text-3xl font-light text-gray-900"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                    €29.99
                                </p>
                            </div>
                        </header>
                        <main>
                            {/* T-Shirt Image */}
                            <motion.div
                                className="py-4 flex justify-center"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <div className="border border-gray-200 p-1 sm:p-2 max-w-sm w-full mx-auto">
                                    <Image
                                        src={tshirtImage}
                                        alt="Model wearing white Premium Cotton T-Shirt"
                                        className="w-full h-auto object-cover rounded-sm"
                                    />
                                </div>
                            </motion.div>

                            {/* High-Resolution Guarantee */}
                            <motion.div
                                className="mt-6 border border-yellow-300 bg-yellow-50/50 p-5 rounded-md shadow-sm"
                                whileHover={{
                                    scale: 1.01,
                                    boxShadow:
                                        "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-start mb-3">
                                    <div className="p-3 mr-3 bg-[#D4AF37] border border-yellow-300">
                                        <Image
                                            src={bachIcon}
                                            alt="Special Icon"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                    <h2
                                        className={`${cormorantItalic.className} text-[20px] font-medium text-[#1A1A1A] pt-1`}
                                    >
                                        High-Resolution Guarantee
                                    </h2>
                                </div>
                                <p
                                    className="text-sm text-[#6a6a6a] mb-3 leading-relaxed tracking-widest"
                                    style={{ fontFamily: "'Jost', sans-serif" }}
                                >
                                    AI-generated images are created with high resolution for
                                    crisp, stunning results. Your custom product will look amazing
                                    both on screen and in real life, guaranteed.
                                </p>
                                <hr className="h-[2px] w-full border-0 bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.8)] to-transparent rounded-full mb-1.5" />
                                <div className="flex flex-wrap gap-x-4 text-xs">
                                    <p
                                        className={`${jostFont.className} text-[12px] text-[#6B6B6B] tracking-[0.5px] flex items-center`}
                                    >
                                        <span className="text-green-600 font-bold mr-1">
                                            &#x2713;
                                        </span>
                                        Professional printing quality
                                    </p>
                                    <p
                                        className={`${jostFont.className} text-[12px] tracking-[0.5px] text-[#6B6B6B] flex items-center`}
                                    >
                                        <span className="text-green-600 font-bold mr-1">
                                            &#x2713;
                                        </span>
                                        Color accuracy
                                    </p>
                                    <p
                                        className={`${jostFont.className} text-[12px] tracking-[0.5px] text-[#6B6B6B] flex items-center`}
                                    >
                                        <span className="text-gray-700 font-bold mr-1">
                                            &#x2713;
                                        </span>
                                        Sharp details
                                    </p>
                                </div>
                            </motion.div>
                        </main>
                    </section>
                </motion.div>

                {/* --- Right Column (Design Tools) --- */}
                <motion.div
                    className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 p-4 sm:p-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInVariants}
                >
                    <h2
                        className="text-xl font-semibold text-[#0a0a0a] mb-6"
                        style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
                    >
                        Design Tools
                    </h2>
                    {/* Design Tools Grid */}
                    <motion.div
                        className="grid grid-cols-4 gap-4 mb-8"
                        variants={toolsStagger}
                        initial="hidden"
                        animate="visible"
                    >
                        {designTools.map((tool, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center justify-center p-3 sm:p-4 border border-gray-200 rounded-md text-center text-sm text-gray-600 cursor-pointer group"
                                variants={fadeInVariants}
                                whileHover={buttonHover}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="text-xl sm:text-2xl mb-1 text-gray-700 group-hover:text-blue-600">
                                    <Image
                                        src={tool.src}
                                        alt={`${tool.label} Icon`}
                                        className="w-5 h-5 mx-auto"
                                    />
                                </div>
                                <div>
                                    <span
                                        className="text-[#0a0a0a] font-medium"
                                        style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                        {tool.label}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* AI Generator / Text Creator Toggle */}
                    <motion.div
                        className="flex flex-col sm:flex-row bg-gray-100 rounded-md p-1 mb-6 shadow-inner"
                        variants={fadeInVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                    >
                        <motion.button
                            onClick={() => setDesignMode("ai")}
                            className={`w-full sm:flex-1 py-2 text-sm font-medium  flex items-center justify-center space-x-2 transition duration-200 mb-1 sm:mb-0 sm:mr-1 ${
                                designMode === "ai" ? activeModeStyle : inactiveModeStyle
                            }`}
                            whileHover={buttonHover}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src={aiDesignIcon}
                                alt="AI Generator Icon"
                                className="w-4 h-4"
                            />
                            <span
                                className="tracking-widest"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                                AI GENERATOR
                            </span>
                        </motion.button>

                        <motion.button
                            onClick={() => setDesignMode("text")}
                            className={`w-full sm:flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition duration-200 sm:ml-1 ${
                                designMode === "text" ? activeModeStyle : inactiveModeStyle
                            }`}
                            whileHover={buttonHover}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src={secondTIcon}
                                alt="Text Creator Icon"
                                className="w-4 h-4 "
                            />
                            <span
                                className="tracking-widest font-medium"
                                style={{ fontFamily: "'Jost', sans-serif" }}
                            >
                                TEXT CREATOR
                            </span>
                        </motion.button>
                    </motion.div>
                    {/* Dynamic Content: AI Generator or Custom Text Design */}
                    {designMode === "ai" ? (
                        <AiDesignGenerate onPreviewClick={openPreviewModal} />
                    ) : (
                        <CustomTextDesign />
                    )}
                    <motion.div
                        variants={fadeInVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: designMode === "ai" ? 1.5 : 0.8 }}
                    >
                        <div className="space-y-6 border border-[#E5E5E5] p-4 rounded-md">
                            {/* Total Price */}
                            <div>
                                <p
                                    className={`${jostFont.className} text-[14px] tracking-[0.5px] text-[#6B6B6B] text-lg font-normal `}
                                >
                                    Total Price
                                </p>
                                <p
                                    className={`${jostFont.className} text-[36px] italic tracking-[0.5px] text-[#1a1a1a] mt-1`}
                                >
                                    €29.99
                                </p>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                className={`${jostFont.className} 	w-full flex items-center opacity-[0.5] bg-[#795548] justify-center py-4 text-white transition duration-300 ease-in-out`}
                            >
                                <Image
                                    src={shoppingIcon}
                                    alt="Shopping Cart Icon"
                                    width={18}
                                    height={18}
                                    className="mr-3"
                                />
                                <span
                                    className={`${jostFont.className} text-[18px] uppercase font-medium tracking-[2.7px]`}
                                >
                                    ADD TO CART
                                </span>
                                <span
                                    className={`${jostFont.className} ml-3 text-lg font-light tracking-wider`}
                                >
                                    · €29.99
                                </span>
                            </button>

                            {/* Continue Shopping Button with onClick handler */}
                            <button
                                onClick={handleContinueShopping}
                                className={`${jostFont.className} w-full py-4 text-[#1a1a1a] border border-gray-300 bg-white text-[14px] uppercase font-medium tracking-[2.1px] transition duration-300 ease-in-out hover:bg-gray-50`}
                            >
                                CONTINUE SHOPPING
                            </button>

                            {/* Guarantees Section with Image Icons */}
                            <div className="flex justify-center mt-6 gap-2 pt-4 border-t border-gray-100">
                                <div
                                    className="flex flex-col items-center text-center p-3 bg-[#F5F5F5] text-[12px] px-2 w-1/2"
                                    style={{
                                        fontFamily: "'Jost', sans-serif",
                                        letterSpacing: "0.5px",
                                    }}
                                >
                                    <p className="leading-tight text-[#6B6B6B]">
                                        🚚 Free shipping <br /> on orders over €100
                                    </p>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <LivePreviewModal isOpen={isModalOpen} onClose={closePreviewModal} />
        </div>
    );
};

export default CombinedDesignPageFixed;