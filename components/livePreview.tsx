"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGetProductDetailsQuery, useGetProductsQuery } from "@/app/store/slices/services/product/productApi";
import { useGetCustomProductsQuery, useSaveCustomProductVersionMutation, ISaveCustomProductVersionRequest } from "@/app/store/slices/services/ai/aiApi";
import { useDeductBalanceMutation } from "@/app/store/slices/services/wallet/walletApi";
// ✅ Framer Motion import: Variants TargetAndTransition
import { motion, type Variants, type TargetAndTransition } from "framer-motion";
import { toast } from "sonner";
import { useAppSelector } from "@/app/store/hooks";
import { selectIsAuthenticated } from "@/app/store/slices/authSlice";
import { useGetWalletQuery } from "@/app/store/slices/services/wallet/walletApi";

// --- Imported Components (Assumed to exist in your project structure) ---
import LivePreviewModal from "@/components/previewModel";
import WalletManager from "./wallet/WalletManager";
// import CustomTextDesign from "@/components/customTextDesign";
import AiDesignGenerate from "./aiDesignGenerate";

// --- Image Imports (Assumed to exist in the specified paths) ---
import aiDesignIcon from "../public/image/livePreview/aidesignIcon.svg";
import alineIcon from "../public/image/livePreview/alineIcon.svg";
import colorIcon from "../public/image/livePreview/colorIcon.svg";
import imageIcon from "../public/image/livePreview/imageIcon.svg";
import layerIcon from "../public/image/livePreview/layerIcon.svg";
import reloadIcon from "../public/image/livePreview/reloadIcon.svg";
import scaleIcon from "../public/image/livePreview/scaleIcon.svg";
// import secondTIcon from "../public/image/livePreview/secondTicon.svg";
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
    // 1️⃣ Initialize the router and search params
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("id");
    const { data: allProductsData } = useGetProductsQuery({}, {
        skip: !!productId,
    });

    // If no productId in URL, pick the first product from all products
    const effectiveProductId = productId || allProductsData?.results?.categories?.[0]?.id?.toString();

    const { data: detailsData } = useGetProductDetailsQuery(effectiveProductId ? parseInt(effectiveProductId) : 0, {
        skip: !effectiveProductId,
    });

    const apiProduct = detailsData?.data;

    // State to manage the active design mode: always 'ai' now
    const [designMode] = useState("ai");
    const [selectedAiImage, setSelectedAiImage] = useState<string | null>(null);
    const [selectedAiFile, setSelectedAiFile] = useState<File | Blob | null>(null);
    const [aiGeneratedImages, setAiGeneratedImages] = useState<{
        generated_design_url: string;
        mockup_url: string;
        ai_season_id?: string;
    } | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedProductImageId, setSelectedProductImageId] = useState<number | null>(null);

    // Initialize selectedProductImageId when product data loads
    useEffect(() => {
        if (apiProduct?.images && apiProduct.images.length > 0) {
            if (selectedProductImageId === null) {
                setSelectedProductImageId(apiProduct.images[0].id);
            }
            if (selectedAiImage === null) {
                setSelectedAiImage(apiProduct.images[0].image);
                // Fetch and set as blob for AI generation
                fetch(apiProduct.images[0].image)
                    .then(res => res.blob())
                    .then(blob => setSelectedAiFile(blob))
                    .catch(err => console.error("Error fetching default image blob:", err));
            }
        }
    }, [apiProduct, selectedProductImageId, selectedAiImage]);

    // API Hooks
    const { data: customProductsData, refetch: refetchCustomProducts } = useGetCustomProductsQuery();
    const [saveCustomProductVersion, { isLoading: isSaving }] = useSaveCustomProductVersionMutation();
    const [deductBalance] = useDeductBalanceMutation();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { data: walletData } = useGetWalletQuery();
    const wallet = walletData?.results?.[0];

    // Logo Upload State
    const [logoImage, setLogoImage] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Lifted modal state so modal control is available at the top level
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openPreviewModal = () => setIsModalOpen(true);
    const closePreviewModal = () => setIsModalOpen(false);

    // Function to handle navigation to the shipping page
    const handleContinueShopping = () => {
        router.push("/pages/shipping");
    };

    const handleImageSelect = async (imageSrc: string, imageId?: number) => {
        setSelectedAiImage(imageSrc);
        if (imageId) {
            setSelectedProductImageId(imageId);
        }
        console.log("Selected Image for AI:", imageSrc, "ID:", imageId);

        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            setSelectedAiFile(blob);
        } catch (error) {
            console.error("Error converting image to blob:", error);
        }
    };



    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setLogoImage(base64String);
                console.log("Uploaded Logo for preview:", base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoImage(null);
    };

    const handleAiGenerate = async (payload: any) => {
        if (!isAuthenticated) {
            toast.error("Please login to generate AI designs.");
            return;
        }

        const freeGens = wallet?.free_generations ?? 0;
        const balance = Number(wallet?.generation_balance ?? 0);

        if (freeGens <= 0 && balance <= 0) {
            toast.error("Insufficient balance. Please top up to generate more designs.");
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();

            // Append all fields from payload
            formData.append('prompt', payload.prompt || '');
            formData.append('imagequality', payload.imagequality || '');
            formData.append('compositiontype', payload.compositiontype || '');
            formData.append('subjecttype', payload.subjecttype || '');
            formData.append('backgroundtype', payload.backgroundtype || '');
            formData.append('colorscheme', payload.colorscheme || '');
            formData.append('lighting', payload.lighting || '');
            formData.append('clothingfashion', payload.clothingfashion || '');
            formData.append('style', payload.style || '');
            formData.append('emotionexpression', payload.emotionexpression || '');
            formData.append('modificationtype', payload.modificationtype || '');
            formData.append('cameraperspective', payload.cameraperspective || '');
            formData.append('weatherenv', payload.weatherenv || '');

            // product_image_url should be a string URL as per Swagger and requested fix
            formData.append('product_image_url', selectedAiImage || '');

            if (logoFile) {
                formData.append('logo_image', logoFile);
            }

            const response = await fetch('http://23.20.201.40:8010/generate_merchandise', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    // Content-Type is multipart/form-data, browser handles boundaries when using FormData
                },
                body: formData,
            });

            const data = await response.json();
            if (data.generated_design_url || data.mockup_url) {
                setAiGeneratedImages(data);
                toast.success("Design generated successfully!");

                // Deduct balance after successful generation
                try {
                    await deductBalance().unwrap();
                    console.log("Balance deducted successfully");
                } catch (deductErr) {
                    console.error("Failed to deduct balance:", deductErr);
                    // We don't necessarily want to block the user if deduction fails on client side
                    // but we should log it.
                }
            } else {
                toast.error("Format error in AI response.");
                console.error("API response missing URLs:", data);
            }
            console.log("🚀 AI GENERATED DATA:", data);
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast.error("Failed to generate AI design. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveDesign = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to save your design.");
            return;
        }

        if (!aiGeneratedImages || !productId) {
            toast.error("No generated design to save.");
            return;
        }

        if (!selectedProductImageId) {
            toast.error("Please select a base product image first.");
            return;
        }

        try {
            const existingCustomProduct = customProductsData?.results.find(
                (cp) => cp.product === parseInt(productId)
            );

            const payload: ISaveCustomProductVersionRequest = {
                product_image: selectedProductImageId,
                images: [
                    aiGeneratedImages.generated_design_url,
                    aiGeneratedImages.mockup_url,
                ].filter(Boolean),
            };

            if (existingCustomProduct) {
                payload.custom_product_id = existingCustomProduct.id;
            } else {
                payload.custom_product_data = {
                    product: parseInt(productId),
                };
            }

            const response = await saveCustomProductVersion(payload).unwrap();
            console.log("Save Response:", response);
            toast.success("Design saved successfully!");
            refetchCustomProducts(); // Refresh list to get new IDs if needed
        } catch (error) {
            console.error("Error saving design:", error);
            // safe check for error object having data property
            if (typeof error === 'object' && error !== null && 'data' in error) {
                const errData = (error as any).data;
                if (errData?.images) {
                    toast.error(`Image Error: ${errData.images.join(', ')}`);
                } else {
                    toast.error("Failed to save design. Check console.");
                }
            } else {
                toast.error("Failed to save design.");
            }
        }
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
                                    {apiProduct?.name || "Custom Design"}
                                </h1>
                            </div>
                            {apiProduct && (
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
                                        €{apiProduct.discounted_price || apiProduct.price}
                                    </p>
                                </div>
                            )}
                        </header>
                        <main>
                            {/* T-Shirt Image / Upload Section */}
                            <motion.div
                                className="py-4 flex flex-col items-center"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <div className="border-2 border-dashed border-gray-200 p-1 sm:p-2 max-w-sm w-full mx-auto relative h-[400px] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                                    {selectedAiImage || apiProduct?.images?.[0]?.image ? (
                                        <Image
                                            src={selectedAiImage || (apiProduct?.images?.[0]?.image) || tshirtImage}
                                            alt="Product preview"
                                            fill
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="mb-4">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <p className={`${jostFont.className} text-sm text-gray-600 mb-2`}>No image selected</p>
                                        </div>
                                    )}
                                    {selectedAiImage && !apiProduct && (
                                        <button
                                            onClick={() => setSelectedAiImage(null)}
                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    )}
                                </div>

                                {apiProduct?.images && apiProduct.images.length > 0 && (
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-2 w-full max-w-sm">
                                        {/* Removed device upload as per request */}
                                        {apiProduct.images.map((img: any, idx: number) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleImageSelect(img.image, img.id)}
                                                className={`w-20 h-20 shrink-0 border-2 cursor-pointer relative rounded-sm overflow-hidden ${selectedAiImage === img.image ? 'border-red-800' : 'border-gray-200'
                                                    }`}
                                            >
                                                <Image
                                                    src={img.image}
                                                    alt={`Thumbnail ${idx}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* --- Logo Upload Section --- */}
                            <div className="flex flex-col items-center justify-center mt-2 mb-4">
                                <h3 className={`${jostFont.className} text-xs uppercase tracking-[1.5px] text-[#6B6B6B] mb-2`}>
                                    Upload Logo (Optional)
                                </h3>
                                <div className="relative">
                                    {logoImage ? (
                                        <div className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-sm overflow-hidden flex items-center justify-center group">
                                            <Image
                                                src={logoImage}
                                                alt="Logo preview"
                                                fill
                                                className="object-contain p-1"
                                            />
                                            <button
                                                onClick={handleRemoveLogo}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-red-800 transition-colors bg-white">
                                            <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            <span className="text-[10px] text-gray-400 uppercase">Logo</span>
                                            <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* --- AI Generated Images Result --- */}
                            {aiGeneratedImages && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-6 space-y-4"
                                >
                                    <h3 className={`${jostFont.className} text-xs uppercase tracking-[2.4px] text-[#6B6B6B]`}>
                                        Generated Designs
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {aiGeneratedImages.generated_design_url && (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className={`relative h-40 border-2 rounded-md overflow-hidden cursor-pointer transition-colors ${selectedAiImage === aiGeneratedImages.generated_design_url ? 'border-red-800' : 'border-gray-200'}`}
                                                onClick={() => handleImageSelect(aiGeneratedImages.generated_design_url)}
                                            >
                                                <Image
                                                    src={aiGeneratedImages.generated_design_url}
                                                    alt="Generated Design"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] py-1 text-center backdrop-blur-sm">
                                                    Design Only
                                                </div>
                                            </motion.div>
                                        )}
                                        {aiGeneratedImages.mockup_url && (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className={`relative h-40 border-2 rounded-md overflow-hidden cursor-pointer transition-colors ${selectedAiImage === aiGeneratedImages.mockup_url ? 'border-red-800' : 'border-gray-200'}`}
                                                onClick={() => handleImageSelect(aiGeneratedImages.mockup_url)}
                                            >
                                                <Image
                                                    src={aiGeneratedImages.mockup_url}
                                                    alt="Mockup"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] py-1 text-center backdrop-blur-sm">
                                                    Mockup View
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic mt-1 font-light">
                                        * Select an image above to apply it to your product preview.
                                    </p>
                                </motion.div>
                            )}

                            {/* --- Save Design Button --- */}
                            {aiGeneratedImages && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4"
                                >
                                    <button
                                        onClick={handleSaveDesign}
                                        disabled={isSaving}
                                        className={`w-full py-3 ${isSaving ? 'bg-gray-400' : 'bg-black'} text-white uppercase tracking-widest text-sm font-medium hover:bg-gray-800 transition-colors`}
                                        style={{ fontFamily: "'Jost', sans-serif" }}
                                    >
                                        {isSaving ? "Saving..." : "Save Design"}
                                    </button>
                                </motion.div>
                            )}

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
                    {/* --- Right Column (Design Tools) --- COMMENTED OUT AS PER REQUEST */}
                    {/* 
                    <h2
                        className="text-xl font-semibold text-[#0a0a0a] mb-6"
                        style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
                    >
                        Design Tools
                    </h2>
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
                    */}

                    {/* Dynamic Content: AI Generator always shown now */}
                    <div className="">
                        <AiDesignGenerate
                            onPreviewClick={openPreviewModal}
                            onGenerate={handleAiGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>

                    <div className="mt-8 mb-6">
                        <WalletManager />
                    </div>

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