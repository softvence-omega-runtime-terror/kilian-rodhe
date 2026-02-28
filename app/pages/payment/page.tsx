// PaymentPage.js (or .tsx)

"use client"; // Required for Next.js client components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import React, { useState } from "react"; // 👈 Import useState
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Jost, Cormorant_Garamond } from "next/font/google";

import {
  CheckCircle,
  X,
  ShoppingBag,
  Download, // Download Icon
} from "lucide-react";

// Imported Assets
import leftArrow from "@/public/image/shipping/Icon (9).svg";
import whiteRightIcon from "@/public/image/shipping/Icon.svg";
import track from "@/public/image/shipping/Icon (5).svg";
import base from "@/public/image/shipping/Icon (6).svg";
import rightIcon from "@/public/image/shipping/Icon (7).svg";
import clock from "@/public/image/shipping/Icon (8).svg";
import { toast } from "sonner";
import {
  useCreatePaymentSessionMutation,
  useGetCartQuery
} from "@/app/store/slices/services/order/orderApi";

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

// Helper Components and Types (Step, PaymentOption) are defined here...
const ACCENT_COLOR = "#8b6f47";
const TOTAL_AMOUNT = "€35.73"; // Use a constant for the total amount

interface PaymentOptionProps {
  label: string;
  value: string;
  selected: string;
  setSelected: (value: string) => void;
}

interface StepProps {
  index: number;
  label: string;
  currentStepIndex?: number;
}

// Payment Option Component (No changes)
const PaymentOption: React.FC<
  PaymentOptionProps & { children?: React.ReactNode }
> = ({ label, value, selected, setSelected, children }) => {
  const isSelected = value === selected;

  return (
    <div
      onClick={() => setSelected(value)}
      className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${isSelected
        ? "border-transparent ring-2 ring-offset-1 ring-[#a07d48] bg-[#fdfbf9] shadow-sm"
        : "border-gray-200 hover:border-[#a07d48]/50"
        }`}
    >
      <label className="flex items-center text-base font-medium text-gray-800 cursor-pointer">
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          checked={isSelected}
          onChange={() => setSelected(value)}
          className="h-4 w-4 text-[#a07d48] border-gray-400 focus:ring-[#a07d48] checked:bg-[#a07d48] mr-3"
        />
        {label}
      </label>

      {isSelected && children && <div className="mt-4 pl-8">{children}</div>}
    </div>
  );
};

// Step Component (No changes)
const Step: React.FC<StepProps> = ({ index, label, currentStepIndex = 2 }) => {
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
          className={`h-0.5 w-12 mx-2 ${lineIsSolid ? "bg-[#a07d48]" : "bg-gray-300"
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
              className="invert"
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


// ----------------------------------------------------------------------
// Success Modal Component (No changes)
// ----------------------------------------------------------------------

const _SuccessModal: React.FC<{
  router: ReturnType<typeof useRouter>;
  onClose: () => void; // Function to close the modal
}> = ({ router, onClose }) => {

  const orderId = "ORD-20251123-1001";
  const subtotal = "€24.99";
  const shipping = "€5.99";
  const tax = "€4.75";
  const totalAmount = TOTAL_AMOUNT; // Use the constant

  // ⬅️ UPDATED HANDLER: Simulates the receipt download by creating a file blob
  const handleDownloadReceipt = () => {

    // 1. Create the content of the dummy receipt file
    const receiptContent = `
        --- PAYMENT RECEIPT ---
        Order ID: ${orderId}
        Date: ${new Date().toLocaleDateString()}
        
        Item: Premium Coffee Mug
        
        Subtotal (1 item): ${subtotal}
        Shipping: ${shipping}
        Tax (19% VAT): ${tax}
        --------------------------
        TOTAL CHARGED: ${totalAmount}
        --------------------------
        
        Thank you for your custom order!
        `;

    // 2. Create a Blob (Binary Large Object)
    const blob = new Blob([receiptContent], { type: 'text/plain' });

    // 3. Create a temporary anchor element
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    // 4. Set attributes for download
    a.href = url;
    a.download = `${orderId}-Receipt.txt`; // Recommended file name

    // 5. Trigger download and clean up
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Optional: Close the modal immediately after triggering the download
    // onClose();
  };

  return (
    <div className={`${jostFont.className} fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-60 backdrop-blur-sm`}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all duration-300 scale-100 relative">

        {/* Cross Icon now CLOSES the modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition"
          aria-label="Close"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#a07d48]/10 mb-4">
          <ShoppingBag className="w-8 h-8 text-[#a07d48]" />
        </div>

        <h3 className={`${cormorantItalic.className} text-3xl font-bold mb-2 text-[#1A1410]`}>
          Congratulations!
        </h3>

        <p className="text-gray-700 mb-6 text-sm">
          Your custom order has been placed successfully! Download your receipt below.
        </p>

        <div className="bg-[#f9f7f5] p-3 rounded-lg mb-6 text-sm">
          <p className="font-medium text-gray-800">Order ID: <span className="text-[#a07d48]">{orderId}</span></p>
          <p className="text-gray-600">Total Charged: <span className="font-bold">{totalAmount}</span></p>
        </div>

        {/* Main Action Button for Download */}
        <button
          onClick={handleDownloadReceipt}
          style={{ backgroundColor: ACCENT_COLOR }}
          className="w-full py-3 text-white rounded-lg shadow-lg hover:bg-[#8a6a3f] transition duration-150 font-medium text-sm flex items-center justify-center mb-3"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="tracking-wider">DOWNLOAD RECEIPT</span>
        </button>

        {/* Secondary Button to return to shopping */}
        <button
          onClick={() => { onClose(); router.push("/pages/shop"); }}
          className="w-full py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 font-medium text-xs tracking-wider"
        >
          CONTINUE SHOPPING
        </button>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Component (MODIFIED)
// ----------------------------------------------------------------------
const PaymentPage: React.FC = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<string>("stripe");
  const [createPaymentSession, { isLoading: isCreatingSession }] = useCreatePaymentSessionMutation();
  const { data: cartData } = useGetCartQuery();

  const [orderId, setOrderId] = useState<number | null>(null);

  React.useEffect(() => {
    const savedOrderId = localStorage.getItem("checkout_order_id");
    if (savedOrderId) {
      setOrderId(parseInt(savedOrderId));
    } else {
      console.warn("No order_id found in localStorage");
      toast.error("Order context missing. Please restart checkout.");
    }
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast.error("Order information missing. Please restart the checkout process.");
      return;
    }

    if (selectedPayment !== "stripe") {
      toast.error("Currently only Stripe is supported.");
      return;
    }

    try {
      const response = await createPaymentSession({ order_id: orderId }).unwrap();
      if (response.success && response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        alert("Failed to create payment session.");
      }
    } catch (err) {
      console.error("Payment failed", err);
      alert("An error occurred while initiating payment.");
    }
  };

  const cartTotal = cartData?.total_price || 0;
  const shippingCost = 5.99;
  const tax = cartTotal * 0.19;
  const total = cartTotal + shippingCost + tax;

  const ACTIVE_STEP_INDEX = 2;


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f9f7f5] font-sans flex flex-col items-center py-10">

        {/* Back Link */}
        <div className="w-full md:container px-3 lg:container mb-5 lg:px-0">
          <button
            onClick={() => router.push("/pages/shop")}
            className="font-medium text-[14px] text-[#6B6560] hover:text-gray-900 transition flex items-center"
          >
            <Image
              src={leftArrow}
              alt="Back arrow"
              width={16}
              height={16}
              className="mr-1"
            />
            <span className="ml-3">Back to Shop</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full border-b bg-[#ffffff] pb-3 border-t pt-3 border-[#E8E3DC] flex flex-col sm:flex-row items-center justify-center mb-12 sm:px-0">
          {["Product Details", "Shipping Info", "Payment"].map(
            (label, index) => (
              <Step
                key={index}
                index={index}
                label={label}
                currentStepIndex={ACTIVE_STEP_INDEX}
              />
            )
          )}
        </div>

        {/* Main Container */}
        <form onSubmit={handlePlaceOrder} className="w-full max-w-5xl flex flex-col lg:flex-row gap-10 p-4 md:p-0">

          {/* Left: Payment Method */}
          <div className="flex-1 rounded-xl p-4 bg-white border-2 border-[#E8E3DC]">
            <h2
              className={`${cormorantItalic.className} text-[24px] font-semibold mb-6 text-[#1A1410]`}
            >
              Payment Method
            </h2>

            <div className={`${jostFont.className} space-y-4`}>
              {/* Stripe */}
              <PaymentOption
                label="Stripe (Credit / Debit Card)"
                value="stripe"
                selected={selectedPayment}
                setSelected={setSelectedPayment}
              />

              {/* PayPal */}
              <PaymentOption
                label="PayPal (Coming Soon)"
                value="paypal"
                selected={selectedPayment}
                setSelected={setSelectedPayment}
              />
            </div>

            {/* Secure Box */}
            <div className="mt-8 p-4 border border-green-500 rounded-lg bg-green-50/50 flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-green-700">Secure Payment</p>
                <p>Your payment information is encrypted and secure.</p>
              </div>
            </div>

            {/* Buttons (MODIFIED) */}
            <div className="flex justify-between pt-8 space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 font-medium text-sm"
              >
                Back
              </button>
              <button
                type="submit"
                style={{ backgroundColor: ACCENT_COLOR }}
                disabled={isCreatingSession}
                className={`
                    px-8 py-3 text-white rounded-lg shadow-lg transition duration-150 font-medium text-sm flex items-center justify-center
                    ${isCreatingSession ? 'opacity-70 cursor-wait' : 'hover:bg-[#8a6a3f]'}
                `}
              >
                {isCreatingSession ? (
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
                  `Place Order - €${total.toFixed(2)}`
                )}
              </button>
            </div>
          </div>

          {/* Right: Order Summary (No changes) */}
          <div
            className={`${jostFont.className} w-full lg:w-[350px] bg-white rounded-xl p-6 border-2 border-[#E8E3DC] self-start`}
          >
            <h3 className="font-semibold text-gray-800 mb-6 text-lg">
              Order Summary
            </h3>

            <div className="space-y-4">
              {cartData?.cards?.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-gray-200">
                    {item.product.images?.[0]?.image ? (
                      <Image
                        src={item.product.images[0].image}
                        alt={item.product.name}
                        className="object-cover"
                        fill
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[10px] text-gray-400">No Image</div>
                    )}
                  </div>

                  <div className="pt-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.product.name}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartData?.cards?.length || 0} item{cartData?.cards?.length !== 1 ? 's' : ''})</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (19% VAT)</span>
                <span>€{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span style={{ color: ACCENT_COLOR }}>€{total.toFixed(2)}</span>
            </div>

            {/* Extra List */}
            <ul
              className={`${jostFont.className} text-xs text-gray-500 mt-5 space-y-2`}
            >
              <li className="flex items-center">
                <Image src={track} width={16} height={16} alt="track" />
                <span className="ml-2">Free shipping over €150</span>
              </li>

              <li className="flex items-center">
                <Image src={base} width={16} height={16} alt="secure" />
                <span className="ml-2">GDPR compliant & secure</span>
              </li>

              <li className="flex items-center">
                <Image src={rightIcon} width={16} height={16} alt="quality" />
                <span className="ml-2">300 DPI quality guaranteed</span>
              </li>

              <li className="flex items-center">
                <Image src={clock} width={16} height={16} alt="delivery" />
                <span className="ml-2">5–7 business days delivery</span>
              </li>
            </ul>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default PaymentPage;