// ShippingPage.js (or .tsx)

"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag } from "lucide-react";

// Fonts
import { Jost, Cormorant_Garamond } from "next/font/google";

// Assets
import mug from "@/public/image/shipping/mug.png";
import userIcon from "@/public/image/shipping/Icon (1).svg";
import mailIcon from "@/public/image/shipping/Icon (2).svg";
import phone from "@/public/image/shipping/Icon (3).svg";
import location from "@/public/image/shipping/Icon (4).svg";
import track from "@/public/image/shipping/Icon (5).svg";
import base from "@/public/image/shipping/Icon (6).svg";
import rightIcon from "@/public/image/shipping/Icon (7).svg";
import clock from "@/public/image/shipping/Icon (8).svg";
import whiteRightIcon from "@/public/image/shipping/Icon.svg";
import leftArrow from "@/public/image/shipping/Icon (9).svg";
import { toast } from "sonner";
import {
  useAddOrderAddressMutation,
  useGetCartQuery,
  useGetOrderDetailsQuery,
  IAddressBookItem
} from "@/app/store/slices/services/order/orderApi";
import { useCheckDiscountApplicabilityMutation, IDiscountCheckResponse } from "@/app/store/slices/services/order/discountApi";
import AddressBook from "./addressBook";

// Fonts
const jostFont = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});

const ACCENT_COLOR = "#8b6f47";

// ---------------- Types ----------------

interface ShippingMethodProps {
  title: string;
  desc: string;
  price: string;
  isSelected: boolean;
  onClick: () => void;
}

interface StepProps {
  index: number;
  label: string;
  currentStepIndex?: number;
}

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  Icon?: StaticImageData;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ---------------- Shipping Method Component ---------------- (No changes)

const ShippingMethod: React.FC<ShippingMethodProps> = ({
  title,
  desc,
  price,
  isSelected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between border-2 rounded-xl p-3 cursor-pointer transition duration-200 ease-in-out ${isSelected
      ? "border-2 border-transparent ring-2 ring-offset-1 ring-offset-[#fdfbf9] ring-[#a07d48] bg-[#fdfbf9]"
      : "border-gray-200 hover:border-[#a07d48]/50"
      }`}
  >
    <div>
      <p className="font-medium text-gray-800 text-sm">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
    <p className="font-semibold text-gray-800 text-sm">{price}</p>
  </div>
);

// ---------------- Step Component ---------------- (No changes)

const Step: React.FC<StepProps> = ({ index, label, currentStepIndex = 1 }) => {
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
    labelClasses += " text-gray-400";
  }

  const lineIsSolid = index <= currentStepIndex;

  return (
    <div className="flex items-center">
      {index > 0 && (
        <div
          className={`h-0.5 w-12 mx-2 ${lineIsSolid && index === 1 ? "bg-[#a07d48]" : "bg-gray-300"
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

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type,
  required,
  Icon,
  name,
  value,
  onChange,
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1">
      {label} {required && <span className="text-[#a07d48]">*</span>}
    </label>

    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Image src={Icon} alt={`${label} icon`} width={16} height={16} />
        </div>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-inset focus:ring-gray-300 outline-none placeholder-gray-400 text-sm transition duration-150 ${Icon ? "pl-10" : "pl-4"
          }`}
      />
    </div>
  </div>
);

// ---------------- Main Component (MODIFIED) ----------------

const ShippingPage: React.FC = () => {
  const router = useRouter();
  const [addOrderAddress, { isLoading: isAddingAddress }] = useAddOrderAddressMutation();
  const { data: cartData, isLoading: cartLoading } = useGetCartQuery();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone_number: "",
    address: "",
    postal_code: "",
    address_name: "", // Address Type (Home/Office)
  });

  const [orderId, setOrderId] = useState<number | null>(null);
  const { data: orderDetails, isLoading: orderLoading } = useGetOrderDetailsQuery(orderId as number, {
    skip: !orderId,
  });
  const [checkDiscount, { isLoading: isCheckingDiscount }] = useCheckDiscountApplicabilityMutation();

  const [orderCoupon, setOrderCoupon] = useState("");
  const [productCoupons, setProductCoupons] = useState<Record<string, string>>({});
  const [discountResults, setDiscountResults] = useState<IDiscountCheckResponse | null>(null);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isNewAddress, setIsNewAddress] = useState(true);

  const handleSelectAddress = (address: IAddressBookItem) => {
    setSelectedAddressId(address.id);
    setIsNewAddress(false);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone_number: address.phone_number,
      address: address.address,
      postal_code: (address.postal_code || "").toString(),
      address_name: address.address_name,
    });
  };

  const searchParams = useSearchParams();

  React.useEffect(() => {
    const urlOrderId = searchParams.get("order_id");
    const savedOrderId = localStorage.getItem("checkout_order_id");

    if (urlOrderId) {
      setOrderId(parseInt(urlOrderId));
      // Sync it back to localStorage just in case
      localStorage.setItem("checkout_order_id", urlOrderId);
    } else if (savedOrderId) {
      setOrderId(parseInt(savedOrderId));
    } else {
      console.warn("No order_id found in URL or localStorage");
      toast.error("Order session missing. Please start from the checkout page.");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // If user types manually, we assume they might be creating a new address or modifying one
    // For simplicity, let's keep isNewAddress as false if it was selected from book, 
    // but the user might want it to be true if they changed something.
    // However, the requirement is "if address from existing then is_new_address will false".
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error("Order information missing. Please go back to checkout.");
      return;
    }

    try {
      const addressData: any = {
        order_id: orderId,
        is_new_address: isNewAddress,
      };

      if (isNewAddress) {
        addressData.address_name = formData.address_name;
        addressData.address = formData.address;
        addressData.firstName = formData.firstName;
        addressData.lastName = formData.lastName;
        addressData.email = formData.email;
        addressData.phone_number = formData.phone_number;
        addressData.postal_code = parseInt(formData.postal_code) || 0;
      } else {
        addressData.address_id = selectedAddressId;
      }

      await addOrderAddress(addressData).unwrap();
      router.push(`/pages/payment?order_id=${orderId}`);
    } catch (err) {
      console.error("Failed to add address", err);
      toast.error("Failed to save shipping information. Please try again.");
    }
  };

  const handleApplyDiscounts = async () => {
    if (!orderDetails) return;

    try {
      const res = await checkDiscount({
        order_code: orderCoupon || "",
        product_codes: productCoupons,
      }).unwrap();
      setDiscountResults(res);
      toast.success("Discount codes checked successfully");
    } catch (err: any) {
      console.error("Failed to check discount", err);
      toast.error(err?.data?.message || "Failed to check discount applicability");
    }
  };

  // --- Calculation Logic ---
  const cartTotal = orderDetails?.product_total_amount || 0;
  const shippingCost = orderDetails?.shipping_cost || 0;

  // Calculate product discounts
  let totalProductDiscount = 0;
  const itemDiscounts: Record<string, number> = {};

  if (discountResults?.success && orderDetails?.items) {
    orderDetails.items.forEach(item => {
      const res = discountResults.data.product[item.order_product_id.toString()];
      if (res?.is_valid) {
        let amount = 0;
        const itemPrice = parseFloat(item.order_product_price);
        if (res.data.discount_type === "percentage") {
          amount = (itemPrice * res.data.discount_amount) / 100;
          if (res.data.max_discount_amount) {
            amount = Math.min(amount, res.data.max_discount_amount);
          }
        } else {
          amount = res.data.discount_amount;
        }
        itemDiscounts[item.id] = amount;
        totalProductDiscount += amount * item.quantity;
      }
    });
  }

  const subtotalAfterProductDiscount = cartTotal - totalProductDiscount;

  // Calculate order discount
  let orderDiscountAmount = 0;
  if (discountResults?.success && discountResults.data.order?.is_valid) {
    const res = discountResults.data.order;
    if (subtotalAfterProductDiscount >= res.data.min_purchase_amount) {
      if (res.data.discount_type === "percentage") {
        orderDiscountAmount = (subtotalAfterProductDiscount * res.data.discount_amount) / 100;
        if (res.data.max_discount_amount) {
          orderDiscountAmount = Math.min(orderDiscountAmount, res.data.max_discount_amount);
        }
      } else {
        orderDiscountAmount = res.data.discount_amount;
      }
    }
  }

  const totalDiscount = totalProductDiscount + orderDiscountAmount;
  const total = (cartTotal + shippingCost) - totalDiscount;

  const subtotal = cartTotal; // For consistent naming with checkout step

  const ACTIVE_STEP_INDEX = 1;

  return (
    <div className="min-h-screen bg-[#f9f7f5] font-sans flex flex-col items-center py-10">
      {/* Back Link */}
      <div className="w-full md:container px-3 lg:container mb-5">
        <button
          onClick={() => router.push("/pages/shop")}
          className="font-medium text-[14px] text-[#6B6560] hover:text-gray-900 transition flex items-center"
        >
          <Image src={leftArrow} alt="Back arrow" width={16} height={16} />
          <span className="ml-3">Back to Shop</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full border-b pb-3 border-t pt-3 bg-[#ffffff] border-[#E8E3DC] flex flex-col sm:flex-row items-center justify-center mb-12 sm:px-0">
        {["Check Out", "Shipping Info", "Payment"].map((label, index) => (
          <Step
            key={index}
            index={index}
            label={label}
            currentStepIndex={ACTIVE_STEP_INDEX}
          />
        ))}
      </div>

      {/* Main container */}
      <div className="w-full max-w-5xl rounded-xl border border-gray-100 flex flex-col lg:flex-row gap-10 p-8 md:p-12">
        {/* Left: Shipping Form */}
        <div className="flex-1 border-2 border-[#E8E3DC] rounded-xl p-4 bg-white">
          <h2
            className={`${cormorantItalic.className} text-[24px] font-semibold mb-6 text-[#1A1410]`}
          >
            Shipping Information
          </h2>

          <AddressBook
            onSelectAddress={handleSelectAddress}
            selectedAddressId={selectedAddressId}
          />

          <form
            onSubmit={handleContinueToPayment}
            className={`${jostFont.className} space-y-6`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
                Icon={userIcon}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
                Icon={userIcon}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
                Icon={mailIcon}
              />
              <InputField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="+49 123 456 7890"
                Icon={phone}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address, apartment, suite, etc."
                required
                Icon={location}
              />
              <InputField
                label="Address Type"
                name="address_name"
                value={formData.address_name}
                onChange={handleInputChange}
                placeholder="Home / Office / etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                placeholder="10115"
                required
              />
            </div>

            {/* Shipping Method */}
            {/* <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Shipping Method
              </label>

              <div className="space-y-3">
                {shippingOptions.map((item, i) => (
                  <ShippingMethod
                    key={i}
                    {...item}
                    isSelected={i === selectedShipping}
                    onClick={() => setSelectedShipping(i)}
                  />
                ))}
              </div>
            </div> */}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 text-sm"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isAddingAddress}
                style={{ backgroundColor: ACCENT_COLOR }}
                className={`
                    px-8 py-2 text-white rounded-lg transition duration-150 text-sm font-medium shadow-md shadow-[#a07d48]/20 flex items-center justify-center
                    ${isAddingAddress ? 'opacity-70 cursor-wait' : 'hover:bg-[#8a6a3f]'}
                `}
              >
                {isAddingAddress ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary (No changes) */}
        <div
          className={`${jostFont.className} w-full lg:w-[350px] bg-[#ffffff] rounded-xl p-6 border-2 border-[#E8E3DC] self-start`}
        >
          <h3 className="font-semibold text-gray-800 mb-6 text-lg">
            Order Summary
          </h3>

          <div className="space-y-4">
            {orderDetails ? (
              orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 mb-4">
                  {/* Note: IOrderItem might not have images in the type, but let's check if they are there or use a placeholder */}
                  <div className="w-16 h-16 flex-shrink-0 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <ShoppingBag className="text-gray-300" size={24} />
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.order_product_name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {itemDiscounts[item.id] > 0 ? (
                        <>
                          <p className="text-xs font-medium text-gray-400 line-through">
                            €{parseFloat(item.order_product_price).toFixed(2)}
                          </p>
                          <p className="text-xs font-semibold text-[#a07d48]">
                            €{(parseFloat(item.order_product_price) - itemDiscounts[item.id]).toFixed(2)}
                          </p>
                          <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded leading-none">
                            -€{itemDiscounts[item.id].toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <p className="text-xs font-semibold text-[#a07d48]">
                          €{parseFloat(item.order_product_price).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Product Coupon Input */}
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Product Coupon"
                        value={productCoupons[item.order_product_id] || ""}
                        onChange={(e) => setProductCoupons(prev => ({ ...prev, [item.order_product_id]: e.target.value }))}
                        className="w-full px-2 py-1 text-[10px] border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#a07d48]"
                      />
                      {discountResults?.data?.product[item.order_product_id.toString()] && (
                        <p className={`text-[10px] mt-1 ${discountResults.data.product[item.order_product_id.toString()].is_valid ? 'text-green-600' : 'text-red-500'}`}>
                          {discountResults.data.product[item.order_product_id.toString()].is_valid
                            ? "Applicable"
                            : discountResults.data.product[item.order_product_id.toString()].data.message || "Invalid coupon"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : cartLoading || orderLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No items found.</p>
            )}
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Global Order Discount Section */}
          <div className="space-y-3 mb-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-medium text-gray-700">Order Discount Code</label>
              <input
                type="text"
                placeholder="Enter Code"
                value={orderCoupon}
                onChange={(e) => setOrderCoupon(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a07d48]"
              />
              {discountResults?.data?.order && (
                <p className={`text-[10px] ${discountResults.data.order.is_valid ? 'text-green-600' : 'text-red-500'}`}>
                  {discountResults.data.order.is_valid
                    ? "Applicable"
                    : "Invalid coupon"}
                </p>
              )}
            </div>

            {totalProductDiscount > 0 && (
              <div className="flex justify-between items-center text-[11px] text-green-600 bg-green-50/50 px-2 py-1 rounded">
                <span className="font-medium">Product Discount</span>
                <span className="font-bold">-€{totalProductDiscount.toFixed(2)}</span>
              </div>
            )}

            {orderDiscountAmount > 0 && (
              <div className="flex justify-between items-center text-[11px] text-green-600 bg-green-50/50 px-2 py-1 rounded">
                <span className="font-medium">Order Discount</span>
                <span className="font-bold">-€{orderDiscountAmount.toFixed(2)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleApplyDiscounts}
              disabled={isCheckingDiscount || (!orderCoupon && Object.values(productCoupons).every(v => !v))}
              className={`w-full py-2 bg-[#a07d48] text-white text-sm font-medium rounded-lg transition duration-200 ${isCheckingDiscount ? 'opacity-70 cursor-wait' : 'hover:bg-[#8a6a3f]'
                }`}
            >
              {isCheckingDiscount ? "Checking..." : "Apply Discount"}
            </button>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal ({orderDetails?.items?.length || 0} item{orderDetails?.items?.length !== 1 ? 's' : ''})</span>
              <span className="text-gray-900 font-medium">€{subtotal.toFixed(2)}</span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Total Discount</span>
                <span className="font-medium">-€{totalDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-gray-900 font-medium">{shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : 'Free'}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          <div className="flex justify-between font-bold text-lg text-gray-800">
            <span>Total</span>
            <div className="flex flex-col items-end">
              {totalDiscount > 0 && (
                <span className="text-sm text-gray-400 line-through font-normal">
                  €{(cartTotal + shippingCost).toFixed(2)}
                </span>
              )}
              <span style={{ color: ACCENT_COLOR }}>€{total.toFixed(2)}</span>
            </div>
          </div>

          {/* <ul
            className={`${jostFont.className} text-xs text-gray-500 mt-5 space-y-2`}
          >
            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={track} width={16} height={16} alt="track" />
              </span>
              Free shipping over $150
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={base} width={16} height={16} alt="base" />
              </span>
              GDPR compliant & secure
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={rightIcon} width={16} height={16} alt="right" />
              </span>
              300 DPI quality guaranteed
            </li>

            <li className="flex items-center">
              <span className="mr-2 text-sm">
                <Image src={clock} width={16} height={16} alt="clock" />
              </span>
              5–7 business days delivery
            </li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;