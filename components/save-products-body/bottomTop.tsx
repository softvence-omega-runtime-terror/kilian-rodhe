// pages/index.js
"use client";
import Image, { StaticImageData } from "next/image"; // StaticImageData import
import { motion, AnimatePresence } from "framer-motion"; // AnimatePresence for removal animation
import { useState } from "react"; // ⬅️ NEW: useState and useMemo hooks
import { Jost } from "next/font/google";
import { useRouter } from "next/navigation";

// --- Imported Assets ---
import mugImage from "@/public/image/shopIcon/mugImage.jpg";
import cupImage from "@/public/image/shopIcon/cup.jpg";
import arrowIcon from "@/public/image/shopIcon/arrowIcon.svg";
import colorStarIcon from "@/public/image/shopIcon/colorStar.svg";
// -----------------------

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// --- Product Type Definition ---
interface Product {
  id: number; // ⬅️ Product removal
  name: string;
  price: string;
  image: StaticImageData; // Changed type for safety
  alt: string;
  delay: number;
}

// --- Card Data Array (Initial Data) ---
// ⬅️ UPDATED: Added a unique 'id' to each product
const initialProducts: Product[] = [
  {
    id: 1, // Unique ID
    name: "Premium Coffee Mug",
    price: "€14.99",
    image: mugImage,
    alt: "Premium Coffee Mug",
    delay: 0.2,
  },
  {
    id: 2, // Unique ID
    name: "Snapback Cap",
    price: "€24.99",
    image: cupImage,
    alt: "Snapback Cap",
    delay: 0.4,
  },
];

export default function Home() {
  const router = useRouter();

  
  const [activeProducts, setActiveProducts] = useState(initialProducts);
  

  const [removedProductName, setRemovedProductName] = useState<string | null>(null);


  // --- Handlers ---

  const handleOrderNow = () => {
    router.push(`/pages/shipping`);
  };

  const handleCustomize = (productName: string) => {
    router.push(`/pages/customise`);
    console.log(`Navigating to customize page for: ${productName}`);
  };

  // ⬅️ NEW HANDLER: Heart icon
  const handleRemoveProduct = (productId: number, productName: string) => {
   
    const newProducts = activeProducts.filter((p) => p.id !== productId);
    
  
    setActiveProducts(newProducts);

  
    setRemovedProductName(productName);
    
   
    setTimeout(() => {
      setRemovedProductName(null);
    }, 2000);
  };
  
  // ⬅️ NEW COMPONENT: Floating Success Message
  const RemoveSuccessMessage = ({ productName }: { productName: string }) => (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-3 rounded-lg shadow-xl z-50 flex items-center space-x-2"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span className="text-xl">🗑️</span>
      <span>
        {productName} has been removed from the list.
      </span>
    </motion.div>
  );


  return (
    <div className={`bg-[#FAFAFA] ${jostFont.className}`}>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-10 md:gap-5">
          {/* ⬅️ UPDATED: Mapping over activeProducts state */}
          {activeProducts.map((product) => (
            <motion.div
              key={product.id} // ⬅️ Using product.id as key
              className="group flex flex-col items-center w-full sm:w-[calc(50%-20px)] md:w-[calc(50%-20px)] lg:w-[calc(50%-40px)]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              // animation duration/delay adjusted for smoother filtering
              transition={{ duration: 0.6, delay: 0.1 }} 
            >
              {/* Image Container */}
              <div className="relative w-full h-80 overflow-hidden mb-6">
                <Image
                  src={product.image}
                  alt={product.alt}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-[0.9] transition-transform duration-500"
                />

                {/* Icons Overlay (Heart Icon) - ⬅️ UPDATED: Added motion.button and onClick */}
                <div className="absolute top-6 right-14 flex space-x-2">
                  <motion.button
                    onClick={() => handleRemoveProduct(product.id, product.name)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className="p-1 transition-transform duration-100  rounded-full shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="27"
                      height="23"
                      viewBox="0 0 27 23"
                      fill="none"
                    >
                      <path
                        d="M0 7.35487C2.72625e-05 5.87114 0.450125 4.42232 1.29084 3.19976C2.13156 1.9772 3.32336 1.03842 4.70881 0.507404C6.09427 -0.0236082 7.60821 -0.12187 9.05068 0.225597C10.4932 0.573063 11.7963 1.34991 12.788 2.45354C12.8578 2.52822 12.9423 2.58776 13.0361 2.62847C13.1299 2.66918 13.2311 2.69018 13.3333 2.69018C13.4356 2.69018 13.5368 2.66918 13.6306 2.62847C13.7244 2.58776 13.8088 2.52822 13.8787 2.45354C14.8673 1.34274 16.1707 0.559361 17.6155 0.207673C19.0603 -0.144015 20.578 -0.0473334 21.9665 0.484849C23.355 1.01703 24.5485 1.95947 25.3882 3.18674C26.2278 4.41401 26.6738 5.86788 26.6667 7.35487C26.6667 10.4082 24.6667 12.6882 22.6667 14.6882L15.344 21.7722C15.0956 22.0575 14.7892 22.2868 14.4454 22.4446C14.1016 22.6025 13.7281 22.6853 13.3497 22.6877C12.9714 22.6901 12.5969 22.612 12.251 22.4585C11.9052 22.305 11.596 22.0797 11.344 21.7975L4 14.6882C2 12.6882 0 10.4215 0 7.35487Z"
                        fill="#E7000B"
                      />
                    </svg>
                  </motion.button>
                </div>

                <motion.button
                  className={`${jostFont.className} absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[90%] h-12 border-2 border-[#ffffff] bg-white/10 text-[#fff] tracking-[2.1px] uppercase text-[14px] font-medium transition-colors duration-300 flex items-center justify-center`}
                  onClick={() => handleCustomize(product.name)}
                >
                  CUSTOMIZE
                  <Image
                    src={arrowIcon}
                    alt="Arrow Icon"
                    width={16}
                    height={16}
                    className="ml-2"
                  />
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="w-full max-w-md text-center">
                <h3
                  className={`${jostFont.className} text-[16px] text-[#2c2c2c] mb-1`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${jostFont.className} text-[16px] font-medium mb-2`}
                >
                  {product.price}
                </p>

                {/* Star Ratings */}
                <div className="flex justify-center items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Image
                      key={i}
                      src={colorStarIcon}
                      alt="Star Icon"
                      width={14}
                      height={14}
                    />
                  ))}
                </div>

                {/* ORDER NOW Button */}
                <motion.button
                  className={`${jostFont.className} shadow text-[14px] w-full h-12 mb-8 bg-[#D4AF37] text-[#000] py-3 tracking-[2.1px] uppercase font-medium hover:bg-[#c2a25b] transition-colors duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrderNow}
                >
                  ORDER NOW
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
      {/* ⬅️ NEW: Conditionally render the success message using AnimatePresence */}
      <AnimatePresence>
        {removedProductName && (
          <RemoveSuccessMessage productName={removedProductName} />
        )}
      </AnimatePresence>
      {/* --------------------------------------------------------------------- */}
    </div>
  );
}