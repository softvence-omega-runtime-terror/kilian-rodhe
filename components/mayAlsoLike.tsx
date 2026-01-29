"use client";

import React, { useRef, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation"; // Added router for navigation
import {
  useGetProductDetailsQuery,
  useGetProductsQuery,
  // IProduct,
} from "@/app/store/slices/services/product/productApi";

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

const cormorantNormal = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

// Adapted Product interface to handle both static and API data if needed, 
// strictly we will map API data to this structure.
interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  imageSrc: string | StaticImageData;
}

interface ProductCardProps {
  product: Product;
  isVisible: boolean;
  index: number;
}

// --- CSS Animation Definitions ---
const animationStyles = (
  <style jsx global>{`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Initial State (Hidden) for Title */
    .title-initial {
      opacity: 0;
      transform: translateY(20px);
    }
    .title-animate {
      animation: slideUp 0.7s ease-out forwards;
    }

    /* Initial State (Hidden) for Cards */
    .card-initial {
      opacity: 0;
      transform: translateY(30px);
    }

    /* Animated State for Cards */
    .card-animate {
      animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Smooth slide up */
    }
  `}</style>
);

// 3. PRODUCT CARD COMPONENT
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isVisible,
  index,
}) => {
  console.log("product : ", product);
  const router = useRouter(); // Hook to navigate

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR", // ISO 4217 code for Euro
  }).format(product.price);

  // Conditional classes for animation with staggered delay
  const delay = `${0.3 + index * 0.15}s`;
  const cardClasses = isVisible ? "card-initial card-animate" : "card-initial";

  const handleCardClick = () => {
    // Navigate to the customization page with the product ID
    router.push(`/pages/customise?id=${product.id}`);
  };

  return (
    <div
      className={`group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${cardClasses} cursor-pointer`}
      style={{ animationDelay: delay }} // Apply staggered delay
      onClick={handleCardClick} // Add click handler
    >
      <div className="relative h-96 overflow-hidden bg-gray-100">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="text-left p-3">
        <p
          className={`${jostFont.className} tracking-[2.4] text-[12px] text-[#6B6B6B] mb-0.5 uppercase`}
        >
          {product.category}
        </p>
        <p
          className={`${cormorantNormal.className} tracking-[0.5] text-[18px] text-[#1a1a1a]`}
        >
          {product.name}
        </p>
        <p
          className={`${jostFont.className} tracking-[0.5] text-[18px] text-[#1a1a1a] mt-1`}
        >
          {formattedPrice}
        </p>
      </div>
    </div>
  );
};

interface YouMayAlsoLikeProps {
  productId?: number;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({ productId }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // 1. Fetch current product details to get category
  const { data: productDetails } = useGetProductDetailsQuery(
    productId as number,
    { skip: !productId }
  );

  const categoryId = productDetails?.data?.category?.id;

  // 2. Fetch related products by category
  const { data: productsData } = useGetProductsQuery(
    { category: categoryId },
    { skip: !categoryId }
  );

  // 3. Map API products to local Product interface
  const products: Product[] =
    productsData?.data?.categories
      ?.filter((p) => p.id !== productId) // Exclude current product
      .slice(0, 4) // Limit to 4 items
      .map((p) => ({
        id: p.id,
        category: p.category?.title || "Category",
        name: p.name,
        price: p.discounted_price || parseFloat(p.price),
        imageSrc: p.images?.[0]?.image || "", // Use first image or empty string
      })) || [];

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [products.length]); // Add dependency to re-run when products load

  // If no products found (and we have a productId), we might want to hide the section or show fallback.
  // For now, we only render if we have products, or if we are loading we just render empty grid.
  // Actually, let's just render what we have.

  // Conditional class for Title
  const titleClasses = isVisible
    ? "title-initial title-animate"
    : "title-initial";

  if (!products || products.length === 0) {
    return null; // Hide if no related products found
  }

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 px-4 bg-gray-50"
    >
      {animationStyles}
      <h2
        className={`text-center ${cormorantItalic.className} text-3xl md:text-[48px] italic mb-10 text-[#1a1a1a] ${titleClasses}`}
      >
        You May Also Like
      </h2>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-2">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isVisible={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;