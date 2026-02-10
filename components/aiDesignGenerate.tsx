"use client";

import React from "react";
import Image from "next/image";
import { motion, Variant } from "framer-motion";

// import specialColorIcon from "../public/image/livePreview/specialIconColor.svg";
import whiteSpecialIcon from "../public/image/livePreview/whitSpecileIcon.svg";
import blueSpecialIcom from "../public/image/livePreview/blueSpecialIcon.svg";

import { Jost } from "next/font/google";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


interface AiDesignGenerateProps {
  onPreviewClick: () => void;
  onGenerate: (payload: any) => void;
  isGenerating?: boolean;
}

const AiDesignGenerate: React.FC<AiDesignGenerateProps> = ({
  onPreviewClick,
  onGenerate,
  isGenerating = false,
}) => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerStagger = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const buttonHover: Variant = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  };

  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string | null>>({});
  const [prompt, setPrompt] = React.useState("");

  const handleOptionSelect = (categoryId: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === option ? null : option,
    }));
  };

  const handleGenerate = () => {
    const payload = {
      prompt,
      style: selectedOptions.style || null,
      lighting: selectedOptions.lighting || null,
      weatherenv: selectedOptions.weatherenv || null,
      cameraperspective: selectedOptions.cameraperspective || null,
      colorscheme: selectedOptions.colorscheme || null,
      subjecttype: selectedOptions.subjecttype || null,
      emotionexpression: selectedOptions.emotionexpression || null,
      backgroundtype: selectedOptions.backgroundtype || null,
      clothingfashion: selectedOptions.clothingfashion || null,
      compositiontype: selectedOptions.compositiontype || null,
      imagequality: selectedOptions.imagequality || null,
      modificationtype: selectedOptions.modificationtype || null,
    };
    onGenerate(payload);
  };

  return (
    <div className="space-y-6">
      {/* <motion.div
        className="border-l-4 border-yellow-400 pl-4 py-3 mb-6 bg-yellow-50 rounded-r-md"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center mb-2">
          <Image
            src={specialColorIcon}
            alt="Sparkle Icon"
            className="w-4 h-4 mr-2"
          />
          <h3
            className="text-[16px] font-bold tracking-widest text-gray-700"
            style={{ fontFamily: "'Cormorant Garamond', sans-serif" }}
          >
            Adobe Firefly AI Technology
          </h3>
        </div>
        <p
          className="text-xs text-[#6b6b6b] tracking-widest leading-snug"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Generate unique, high-quality images using AI. Describe your vision
          and watch it come to life with professional-grade results optimized
          for printing.
        </p>
      </motion.div> */}

      {/* <motion.div
        className="border-l-4 border-blue-500 pl-4 py-3 mb-6 bg-linear-to-br from-[#EAF3FF] via-[#F5F9FF] to-[#E0EDFF] shadow-sm"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center mb-2">
          <div className="bg-blue-500 p-1 flex items-center justify-center w-6 h-6 mr-2">
            <Image
              src={whiteSpecialIcon}
              alt="Sparkle Icon"
              className="w-4 h-4"
            />
          </div>
          <h3
            className="text-sm font-semibold text-gray-800"
            style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.4px" }}
          >
            Powered by Adobe Firefly
          </h3>
        </div>
        <p
          className="text-xs text-[#1c398e] tracking-widest leading-snug"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Describe your design idea and our AI will create a high-resolution
          graphic optimized for printing. All images are generated at 300 DPI
          for professional quality.
        </p>
      </motion.div> */}

      {/* --- STRUCTURED PROMPT SYSTEM --- */}
      <motion.div
        className="mb-8 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ delay: 0.4 }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-widest text-gray-700 mb-4"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Structured Prompt System
        </h3>
        <div className="space-y-4">
          {[
            { id: 'style', label: 'Style', options: ["Comic", "Cartoon", "Minimalist"] },
            { id: 'lighting', label: 'Lighting', options: ["Bright day light", "Soft light", "Golden hour"] },
            { id: 'weatherenv', label: 'Weather', options: ["Sunny", "Rain", "Fog"] },
            { id: 'cameraperspective', label: 'Camera Perspective', options: ["Close up", "Medium shot", "Wide shot"] },
            { id: 'colorscheme', label: 'Color Scheme', options: ["Black White", "Monochrome", "Pastel"] },
            { id: 'subjecttype', label: 'Subject Type', options: ["Person", "Animal", "Landscape"] },
            { id: 'emotionexpression', label: 'Emotion', options: ["Happy", "Sad", "Excited"] },
            { id: 'backgroundtype', label: 'Background', options: ["Transparent", "Solid color", "Natural"] },
            { id: 'clothingfashion', label: 'Fashion', options: ["Casual", "Business", "Sports Wear"] },
            { id: 'compositiontype', label: 'Composition', options: ["Centered", "Symmetrical", "Asymmetrical"] },
            { id: 'imagequality', label: 'Quality', options: ["HD", "Low Resulation", "Sharp"] },
            { id: 'modificationtype', label: 'Modification', options: ["Background Removal", "Style Transfer", "Face Enhancement"] },
          ].map((category) => (
            <div key={category.id} className="space-y-2">
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {category.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(category.id, option)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${selectedOptions[category.id] === option
                      ? 'bg-red-800 text-white border-red-800 shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-red-800 hover:text-red-800'
                      }`}
                    style={{ fontFamily: "'Jost', sans-serif" }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* --- DESCRIBE YOUR DESIGN INPUT AREA --- */}
      <motion.div
        className="mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ delay: 0.6 }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-widest text-gray-700 mb-2"
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          DESCRIBE YOUR DESIGN
        </h3>
        <textarea
          className="w-full h-24 p-3 border border-gray-300 rounded-md resize-none focus:outline-none  text-sm"
          placeholder="Example: A majestic lion with golden mane, detailed portrait style,
          dramatic lighting..."
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.5px" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        <p
          className="text-xs mt-2 text-gray-600"
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.5px" }}
        >
          Be specific about colors, style, mood, and elements you want to see
        </p>
      </motion.div>

      {/* --- QUICK PROMPTS --- */}
      <motion.div
        className="mb-8"
        variants={containerStagger}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
      >
        <h4
          className="text-xs font-semibold uppercase text-gray-500 mb-3"
          style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.7px" }}
        >
          QUICK PROMPTS:
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            "Minimalist mountain landscape in sunset colors",
            "Cute astronaut cat floating in space",
            "Abstract geometric pattern in gold and black",
            "Vintage floral bouquet illustration",
          ].map((quickText, index) => (
            <motion.button
              key={index}
              className="p-3 bg-gray-100 text-[#1a1a1a] rounded-md text-xs text-left cursor-pointer shadow-sm hover:bg-gray-200 transition duration-150"
              style={{
                fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.5px",
              }}
              whileHover={buttonHover}
              whileTap={{ scale: 0.95 }}
              variants={fadeInVariants}
              onClick={() => setPrompt(quickText)}
            >
              {quickText}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* --- ACTION BUTTONS (PREVIEW/GENERATE) --- */}
      <motion.div
        className="flex flex-col w-full justify-between items-center gap-4 mt-8"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ delay: 1 }}
      >
        {/* <motion.button
          // 🚀 onPreviewClick is correctly typed!
          onClick={onPreviewClick}
          className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 text-sm font-medium shadow-sm w-full justify-center"
          // **Removed sm:w-auto from here**
          whileHover={buttonHover}
          whileTap={{ scale: 0.95 }}
        >
          <Image src={blueSpecialIcom} alt="Preview Icon" className="w-4 h-4" />
          <span className={`${jostFont.className} text-[#9810fa]`}>
            Preview
          </span>
        </motion.button> */}

        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`flex items-center space-x-2 px-6 py-3 shadow-lg bg-[#795548] text-white text-sm font-medium w-full justify-center ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          // **Removed sm:w-auto from here**
          whileHover={!isGenerating ? {
            scale: 1.05,
            boxShadow:
              "0 10px 15px -3px rgba(121, 85, 72, 0.4), 0 4px 6px -2px rgba(121, 85, 72, 0.2)",
          } : {}}
          whileTap={!isGenerating ? { scale: 0.95 } : {}}
          animate={!isGenerating ? {
            scale: [1, 1.02, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          } : {}}
        >
          <Image
            src={whiteSpecialIcon}
            alt="Generate Icon"
            className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`}
          />
          <span
            className={`${jostFont.className} text-white tracking-[2.1px] text-[14px] font-medium`}
          >
            {isGenerating ? 'GENERATING...' : 'GENERATE AI DESIGN'}
          </span>
        </motion.button>
      </motion.div>

      {/* <p
        className="text-xs mb-3 text-gray-500 text-center mt-6"
        style={{ fontFamily: "'Jost', sans-serif", letterSpacing: "0.5px" }}
      >
        Powered by Adobe Firefly · Professional 300 DPI Quality
      </p> */}

      {/* --- PRO TIPS --- */}
      {/* <motion.div>
        <div className="border border-gray-200 p-4 mb-8 rounded-md">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-700">
            PRO TIPS FOR BEST RESULTS:
          </h3>
          <ul
            className="list-disc ml-5 space-y-2 text-sm text-gray-600"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            <li>
              Include style keywords (cartoon, realistic, minimalist,
              watercolor, etc.)
            </li>
            <li>Specify exact colors you want to see in your design</li>
            <li>
              Describe the mood or emotion (dramatic, playful, elegant, bold)
            </li>
            <li>Keep descriptions clear and detailed for precise results</li>
          </ul>
        </div>
      </motion.div> */}
    </div>
  );
};

export default AiDesignGenerate;
