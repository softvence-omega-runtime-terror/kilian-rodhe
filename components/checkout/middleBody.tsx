"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Minus, Trash2, Check, ShoppingBag } from "lucide-react";
import { Jost, Cormorant_Garamond } from "next/font/google";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useCheckoutMutation,
  ICartItem,
} from "@/app/store/slices/services/order/orderApi";

// Assets (Reusing from shipping)
import whiteRightIcon from "@/public/image/shipping/Icon.svg";
import leftArrow from "@/public/image/shipping/Icon (9).svg";
import track from "@/public/image/shipping/Icon (5).svg";
import base from "@/public/image/shipping/Icon (6).svg";
import rightIcon from "@/public/image/shipping/Icon (7).svg";
import clock from "@/public/image/shipping/Icon (8).svg";

const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

// const ACCENT_COLOR = "#8b6f47";
// const GOLD_COLOR = "#DFA637";

// ---------------- Types ----------------

interface StepProps {
  index: number;
  label: string;
  currentStepIndex?: number;
}

// ---------------- Components ----------------

const Step: React.FC<StepProps> = ({ index, label, currentStepIndex = 0 }) => {
  const isCompleted = index < currentStepIndex;
  const isCurrent = index === currentStepIndex;

  let circleClasses =
    "w-10 h-10 flex items-center justify-center rounded-full text-lg flex-shrink-0 transition-all duration-300";

  if (isCompleted || isCurrent) {
    circleClasses +=
      " bg-[#a07d48] text-white font-medium shadow-md shadow-[#a07d48]/30";
  } else {
    circleClasses += " bg-[#f7f5f3] text-[#a07d48] font-medium";
  }

  let labelClasses =
    "text-sm ml-2 transition-colors duration-300 whitespace-nowrap";

  if (isCompleted || isCurrent) {
    labelClasses += " font-semibold text-gray-800";
  } else {
    labelClasses += " text-gray-400 text-xs sm:text-sm";
  }

  const lineIsSolid = index <= currentStepIndex;

  return (
    <div className="flex items-center">
      {index > 0 && (
        <div
          className={`h-0.5 w-8 sm:w-12 mx-1 sm:mx-2 ${lineIsSolid ? "bg-[#a07d48]" : "bg-gray-300"
            }`}
        ></div>
      )}

      <div className="flex items-center">
        <div className={circleClasses}>
          {isCompleted ? (
            <Image
              src={whiteRightIcon}
              width={16}
              height={16}
              alt="Completed"
            />
          ) : (
            index + 1
          )}
        </div>
        <span className={labelClasses}>{label}</span>
      </div>
    </div>
  );
};

const CheckoutReview: React.FC = () => {
  const router = useRouter();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const cartItems: ICartItem[] = cartData?.cards || [];

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<number>(1); // Default to Standard (id: 1)
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  // Track specific overrides locally for size/color if not persistently saved in cart
  // In a real app, these should probably be synced with the cart API
  const [itemOverrides, setItemOverrides] = useState<Record<number, { size?: string, color?: string }>>({});

  const shippingOptions = [
    { id: 1, title: "Standard Shipping", desc: "5–7 business days", price: "€5.99", value: 5.99 },
    { id: 2, title: "Express Shipping", desc: "2–3 business days", price: "€15.99", value: 15.99 },
    { id: 3, title: "Overnight Delivery", desc: "Next business day", price: "€29.99", value: 29.99 },
  ];

  // Initialize selected items when cart loads
  React.useEffect(() => {
    if (cartItems.length > 0 && selectedItems.length === 0) {
      setSelectedItems(cartItems.map(item => item.id));
    }
  }, [cartItems]);

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdateQuantity = async (item: ICartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    setUpdatingItemId(item.id);
    try {
      await updateCartItem({ product_id: item.id, quantity: newQuantity }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity", err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await deleteCartItem(id).unwrap();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleOverrideChange = (id: number, field: 'size' | 'color', value: string) => {
    setItemOverrides(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const subtotal = useMemo(() => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => {
        const price = item.product.discounted_price ?? parseFloat(item.product.price);
        return acc + (price * item.quantity);
      }, 0);
  }, [cartItems, selectedItems]);

  const totalQuantity = useMemo(() => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems, selectedItems]);

  const selectedShippingOption = shippingOptions.find(o => o.id === selectedShipping);
  const shippingCost = selectedShippingOption?.value || 0;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    const checkoutProducts = cartItems
      .filter(item => selectedItems.includes(item.id))
      .map(item => {
        const sizes = [
          ...(item?.product?.cloth_size || []),
          ...(item?.product?.kids_size || []),
          ...(item?.product?.mug_size || [])
        ];
        const colors = item?.product?.colors && item?.product?.colors.length > 0
          ? item?.product?.colors
          : (item?.product?.color_code ? [item?.product?.color_code] : []);

        return {
          checkout_card_id: item.id,
          quantity: item.quantity,
          checkout_product_color: itemOverrides[item.id]?.color ? [itemOverrides[item.id].color] : (colors[0] ? [colors[0]] : []),
          checkout_product_size: itemOverrides[item.id]?.size ? [itemOverrides[item.id].size] : (sizes[0] ? [sizes[0]] : [])
        };
      });

    try {
      await checkout({
        card_products: checkoutProducts,
        shipping_id: selectedShipping
      }).unwrap();

      // Navigate to the next step
      router.push("/pages/shipping");
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to proceed to checkout. Please try again.");
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f7f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a07d48]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f9f7f5] ${jostFont.className} flex flex-col items-center py-10 px-4 md:px-0`}>
      {/* Back Link */}
      <div className="w-full max-w-6xl mb-5">
        <button
          onClick={() => router.push("/pages/shop")}
          className="font-medium text-[14px] text-[#6B6560] hover:text-gray-900 transition flex items-center"
        >
          <Image src={leftArrow} alt="Back arrow" width={16} height={16} />
          <span className="ml-3">Back to Shop</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full border-b pb-3 border-t pt-3 bg-[#ffffff] border-[#E8E3DC] flex flex-row items-center justify-center mb-12">
        {["Check Out", "Shipping Info", "Payment"].map((label, index) => (
          <Step
            key={index}
            index={index}
            label={label}
            currentStepIndex={0}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Left Side: Cart Items Review */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border-2 border-[#E8E3DC] rounded-xl p-6 shadow-sm transition-all duration-300">
            <h2 className={`${cormorantItalic.className} text-[32px] font-semibold mb-6 text-[#1A1410]`}>
              Order Review
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Your cart is currently empty.</p>
                <button
                  onClick={() => router.push("/pages/shop")}
                  className="mt-4 text-[#a07d48] font-semibold hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {cartItems.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  const itemPrice = item.product.discounted_price ?? parseFloat(item.product.price);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className={`flex flex-col sm:flex-row gap-6 p-4 rounded-lg border transition-all duration-300 ${isSelected ? 'border-[#a07d48] bg-[#fdfbf9]' : 'border-transparent'}`}
                    >
                      {/* Checkbox */}
                      <div className="flex items-center">
                        <div
                          onClick={() => toggleItemSelection(item.id)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${isSelected ? 'bg-[#a07d48] border-[#a07d48]' : 'border-gray-300'}`}
                        >
                          {isSelected && <Check size={14} className="text-white" />}
                        </div>
                      </div>

                      {/* Image */}
                      <div className="w-32 h-40 relative bg-gray-100 rounded-lg overflow-hidden shrink-0 mx-auto sm:mx-0">
                        {item.product.images?.[0]?.image ? (
                          <Image
                            src={item.product.images[0].image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`${cormorantItalic.className} text-2xl font-medium text-gray-900 leading-tight`}>
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {/* Size Selection */}
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Size</label>
                            {(() => {
                              const sizes = [
                                ...(item?.product?.cloth_size || []),
                                ...(item?.product?.kids_size || []),
                                ...(item?.product?.mug_size || [])
                              ];
                              if (sizes.length === 0) return <p className="text-xs text-red-500 italic">No sizes available</p>;
                              return (
                                <select
                                  value={itemOverrides[item.id]?.size || sizes[0]}
                                  onChange={(e) => handleOverrideChange(item.id, 'size', e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#a07d48]"
                                >
                                  {sizes.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              );
                            })()}
                          </div>

                          {/* Color Selection */}
                          <div>
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Color</label>
                            {(() => {
                              const colors = item.product.colors && item.product.colors.length > 0
                                ? item.product.colors
                                : (item.product.color_code ? [item.product.color_code] : []);

                              if (colors.length === 0) return <p className="text-xs text-red-500 italic">No colors available</p>;

                              const selectedColor = itemOverrides[item.id]?.color || colors[0];

                              return (
                                <div className="flex flex-wrap gap-2">
                                  {colors.map(color => (
                                    <button
                                      key={color}
                                      onClick={() => handleOverrideChange(item.id, 'color', color)}
                                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${selectedColor === color ? 'border-[#a07d48] scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    >
                                      {selectedColor === color && (
                                        <Check size={14} className={color.toLowerCase() === '#ffffff' ? 'text-black mx-auto' : 'text-white mx-auto'} />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-auto pt-4">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item, -1)}
                              disabled={item.quantity <= 1 || updatingItemId === item.id}
                              className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-r"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="w-12 text-center font-medium text-sm flex items-center justify-center">
                              {updatingItemId === item.id ? (
                                <div className="h-4 w-4 border-2 border-[#a07d48]/30 border-t-[#a07d48] rounded-full animate-spin" />
                              ) : (
                                item.quantity
                              )}
                            </div>
                            <button
                              onClick={() => handleUpdateQuantity(item, 1)}
                              disabled={updatingItemId === item.id}
                              className="p-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-gray-400 text-xs line-through mb-1">€{(itemPrice * 1.2).toFixed(2)}</p>
                            <p className="text-xl font-semibold text-gray-900">€{(itemPrice * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shipping Methods Section */}
          <div className="bg-white border-2 border-[#E8E3DC] rounded-xl p-6 shadow-sm">
            <h2 className={`${cormorantItalic.className} text-[24px] font-semibold mb-6 text-[#1A1410]`}>
              Select Shipping Method
            </h2>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedShipping(option.id)}
                  className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${selectedShipping === option.id
                    ? "border-[#a07d48] bg-[#fdfbf9] ring-1 ring-[#a07d48]"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === option.id ? 'border-[#a07d48]' : 'border-gray-300'}`}>
                      {selectedShipping === option.id && <div className="w-2.5 h-2.5 rounded-full bg-[#a07d48]" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{option.title}</p>
                      <p className="text-xs text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{option.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Summary Container */}
        <div className="w-full lg:w-95 space-y-6">
          <div className="bg-white border-2 border-[#E8E3DC] rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 text-xl uppercase tracking-wider">Summary</h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Items ({totalQuantity})</span>
                <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900 font-medium">{shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (19%)</span>
                <span className="text-gray-900 font-medium">€{(subtotal * 0.19).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <div className="flex justify-between items-center font-bold text-2xl text-gray-900">
              <span className={cormorantItalic.className}>Total Due</span>
              <span className="text-[#a07d48]">€{(total + (subtotal * 0.19)).toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || selectedItems.length === 0}
              className={`w-full mt-8 py-4 rounded-lg font-bold text-sm tracking-[2.5px] uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${isCheckingOut || selectedItems.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
                }`}
            >
              {isCheckingOut ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Proceed to Shipping"
              )}
            </button>

            {/* Benefits */}
            <ul className="mt-8 space-y-4 pt-6 border-t border-gray-50">
              {[
                { icon: track, text: "Free shipping over €150" },
                { icon: base, text: "GDPR compliant & secure" },
                { icon: rightIcon, text: "300 DPI quality guaranteed" },
                { icon: clock, text: "5–7 business days delivery" },
              ].map((item, i) => (
                <li key={i} className="flex items-center text-xs text-gray-500">
                  <Image src={item.icon} width={16} height={16} alt="benefit icon" className="mr-3" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutReview;
