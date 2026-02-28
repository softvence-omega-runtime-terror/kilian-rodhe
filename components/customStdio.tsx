"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/app/store/slices/services/product/productApi";
import stdioImage from "../public/image/stdioImage.png";

const animationStyles = (
  <style jsx global>{`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .slide-up-initial {
      opacity: 0;
      transform: translateY(20px);
    }

    .slide-up-animate {
      animation: slideUp 0.7s forwards;
    }

    .slide-up-delay-1 {
      animation-delay: 0.2s;
    }
    .slide-up-delay-2 {
      animation-delay: 0.4s;
    }
    .slide-up-delay-3 {
      animation-delay: 0.6s;
    }
    .slide-up-delay-4 {
      animation-delay: 0.8s;
    }
  `}</style>
);

export default function CustomDesignStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();
  const { data: productsData } = useGetProductsQuery({});

  const handleStartDesigning = () => {
    const defaultProduct = productsData?.results?.categories?.[0];
    if (defaultProduct) {
      router.push(`/pages/my-creation/create-your-design?id=${defaultProduct.id}`);
    } else {
      router.push("/pages/my-creation/create-your-design");
    }
  };

  useEffect(() => {
    const currentRef = sectionRef.current;

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

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const animationClasses = (delay: string): string =>
    `slide-up-initial ${isVisible ? `slide-up-animate ${delay}` : ""}`;

  return (
    <section
      ref={sectionRef}
      className="relative bg-cover bg-center bg-no-repeat text-white flex items-center justify-center min-h-[400px]"
      style={{ backgroundImage: `url(${stdioImage.src})` }}
    >
      {animationStyles}

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative text-center px-6 max-w-3xl">
        <div
          className={`flex items-center justify-center gap-1 ${animationClasses(
            "slide-up-delay-1"
          )}`}
        >
          <hr className="bg-[#f0c12a] h-[1px] w-[10%] border-0" />
          <p
            className="tracking-[4px] text-sm uppercase text-[#f0c12a]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            AI Custom Design Studio
          </p>
          <hr className="bg-[#f0c12a] h-[1px] w-[10%] border-0" />
        </div>

        <h1
          className={`font-['Cormorant_Garamond'] italic text-3xl md:text-4xl font-medium mb-4 ${animationClasses(
            "slide-up-delay-2"
          )}`}
        >
          Create Your Own Style
        </h1>

        <p
          className={`text-sm md:text-base text-gray-200 mb-6 leading-relaxed ${animationClasses(
            "slide-up-delay-3"
          )}`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          Use our AI-powered design studio or manual text creator to bring your
          vision to life. <br />
          Professional 300 DPI quality guaranteed on every product.
        </p>

        <button
          onClick={handleStartDesigning}
          className={`bg-[#8B5E3C] hover:bg-[#A06C47] transition-colors px-6 py-2 rounded-sm text-sm tracking-wider font-semibold ${animationClasses(
            "slide-up-delay-4"
          )}`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          START DESIGNING
        </button>
      </div>
    </section>
  );
}
