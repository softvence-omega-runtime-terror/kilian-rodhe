"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react"; // Icons
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Jost, Cormorant_Garamond } from "next/font/google";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  ICartItem,
} from "@/app/store/slices/services/order/orderApi";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

interface ShoppingCartProps {
  toggleCart: () => void;
}

const MotionLink = motion(Link);

const ShoppingCart: React.FC<ShoppingCartProps> = ({ toggleCart }) => {
  const router = useRouter();
  const shopPath = "/pages/collections"; // Updated to likely main shop page

  // API Hooks
  const { data: cartData, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  // Helper to safely get cart items (handles correct API structure)
  // API response structure: { success: boolean, message: string, cards: ICartItem[], errors: any }
  const cartItems: ICartItem[] = cartData?.cards || [];

  const cartTotal = cartItems.reduce((total, item) => {
    // Check if discounted_price exists and is valid, otherwise use price
    // Note: The API example has discounted_price as number (229.81) and price as string ("343.00")
    // We prioritize discounted_price if available.
    const itemPrice = item.product.discounted_price ?? parseFloat(item.product.price);
    return total + (itemPrice * item.quantity);
  }, 0);

  const handleApplyCoupon = () => {
    // Placeholder for coupon logic
    console.log("Apply coupon clicked");
  };

  const handleCheckout = () => {
    toggleCart();
    router.push("/pages/checkout");
  };

  // State to track which item is being modified
  const [loadingId, setLoadingId] = React.useState<number | null>(null);

  const handleIncrement = async (item: ICartItem) => {
    setLoadingId(item.id);
    try {
      await updateCartItem({ product_id: item.id, quantity: item.quantity + 1 }).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecrement = async (item: ICartItem) => {
    if (item.quantity > 1) {
      setLoadingId(item.id);
      try {
        await updateCartItem({ product_id: item.id, quantity: item.quantity - 1 }).unwrap();
      } catch (error) {
        console.error("Failed to update quantity:", error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleRemove = async (id: number) => {
    setLoadingId(id);
    try {
      await deleteCartItem(id).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoadingId(null);
    }
  };


  return (
    <div className="fixed inset-0 flex justify-end z-999">
      {/* Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={toggleCart}
      />

      {/* Cart Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
        className="relative bg-white w-full sm:w-120 h-screen shadow-2xl flex flex-col z-1000"
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-100 p-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-[#C19E3C]" size={28} />
              <h2
                className={`${cormorantItalic.className} text-[32px] text-[#1a1a1a] font-semibold tracking-wide`}
              >
                Shopping Cart
              </h2>
            </div>
            <button
              className="text-gray-400 hover:text-gray-800 transition-colors p-1"
              onClick={toggleCart}
            >
              <X size={28} />
            </button>
          </div>
          <p
            className={`${jostFont.className} text-xs tracking-[2px] uppercase text-gray-500 font-medium`}
          >
            {cartItems.length} Items
          </p>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C19E3C]"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="text-gray-300 mb-4" size={64} />
              <p className={`${cormorantItalic.className} text-2xl text-gray-400 mb-6`}>
                Your cart is empty
              </p>
              <MotionLink
                href={shopPath}
                onClick={toggleCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${jostFont.className} bg-[#1a1a1a] text-white px-8 py-3 text-sm tracking-[2px] uppercase hover:bg-[#333] transition-colors`}
              >
                Start Shopping
              </MotionLink>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex gap-4 group relative"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-32 shrink-0 bg-gray-50 overflow-hidden">
                    {item.product?.images?.[0]?.image ? (
                      <Image
                        src={item.product.images[0].image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 text-xs">No Img</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`${cormorantItalic.className} text-xl text-[#1a1a1a] leading-tight`}>
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                          disabled={loadingId === item.id}
                        >
                          {loadingId === item.id ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-500"></div> : <Trash2 size={16} />}
                        </button>
                      </div>
                      <p className={`${jostFont.className} text-xs text-gray-500 tracking-[1px] uppercase mb-2`}>
                        Price: ${item.product.discounted_price ?? parseFloat(item.product.price as unknown as string)}
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => handleDecrement(item)}
                          disabled={item.quantity <= 1 || loadingId === item.id}
                          className="p-2 hover:bg-gray-50 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`${jostFont.className} w-8 text-center text-sm font-medium`}>
                          {loadingId === item.id ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent mx-auto"></div> : item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="p-2 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                          disabled={loadingId === item.id}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className={`${jostFont.className} text-[#1a1a1a] font-medium tracking-wide`}>
                        ${((item.product.discounted_price ?? parseFloat(item.product.price as unknown as string)) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className={`${jostFont.className} text-sm tracking-[1px] text-gray-500 uppercase`}>Subtotal</span>
              <span className={`${cormorantItalic.className} text-2xl text-[#1a1a1a] font-medium`}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <p className={`${jostFont.className} text-xs text-gray-400 mb-6 text-center`}>
              Shipping & taxes calculated at checkout
            </p>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className={`${jostFont.className} w-full bg-[#1a1a1a] text-white py-4 text-sm tracking-[2px] uppercase font-medium hover:bg-[#333] transition-colors`}
              >
                Checkout (Order)
              </button>
              <button
                onClick={toggleCart}
                className={`${jostFont.className} w-full bg-white border border-gray-200 text-[#1a1a1a] py-4 text-sm tracking-[2px] uppercase font-medium hover:bg-gray-50 transition-colors`}
              >
                Keep Shopping
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShoppingCart;