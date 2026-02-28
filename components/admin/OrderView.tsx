"use client";
import React from "react";
import {
  ArrowLeftIcon,
  // Removed unused icons like Edit, Trash2, Box, ShoppingCart
  Printer,
  // Icons required for the timeline
  CheckCircle,
  Clock,
  Truck,
  CheckCircle2,
  // Icons required for the Order Summary Card
  Package,
  Palette,
  Expand,
  DollarSign,
  // Icons for Customer Information Card
  User,
  Mail,
  Phone,
  MapPin,
  // ADDED: Icons for Payment and Delivery Information
  CreditCard, // For Payment Method
  Calendar, // For Estimated Delivery/Payment Date
} from "lucide-react";
import Image from "next/image";
import { useGetOrderByIdQuery } from "@/app/store/slices/services/adminService/orderAdminApi";

// Assuming these paths are correct - Keep them as placeholders

import productImage from "@/public/image/admin/products/productImage.jpg";

// ---------------- Types ----------------

type ViewType = "listOrder" | "add" | "viewOrder" | "edit";
type ViewChangeHandler = (view: ViewType, id?: number) => void;

interface Product {
  id: number;
  name: string;
  typeGenerate: string;
  imageSize: string;
  price: string;
  stock: number;
  sales: number;
  status: "Active" | "Out of Stock";
}

// --- Timeline Types and Data (Kept as is) ---

interface TimelineStepProps {
  status: "complete" | "current" | "pending";
  stepName: string;
  stepDetail: string;
  isLast: boolean;
}

const mockOrderStatus = {
  currentStep: "In Production",
  steps: [
    {
      name: "Order Placed",
      date: "Oct 10, 2025",
    },
    {
      name: "Quality Check Passed",
      date: "300 DPI Verified",
    },
    {
      name: "In Production",
      date: "Currently printing...",
    },
    {
      name: "Shipped",
      date: "Pending shipment",
    },
    {
      name: "Delivered",
      date: "Est. Oct 15, 2025",
    },
  ],
};

const { steps, currentStep } = mockOrderStatus;

// --- TimelineStep Component (Kept as is) ---
const TimelineStep: React.FC<TimelineStepProps> = ({
  status,
  stepName,
  stepDetail,
  isLast,
}) => {
  let Icon: React.ElementType;
  let iconClasses: string;
  let detailColor: string;
  let textWeight: string;

  const isQCCompleted =
    steps.findIndex((s) => s.name === currentStep) >
    steps.findIndex((s) => s.name === "Quality Check Passed");
  const isCompleted =
    steps.findIndex((s) => s.name === currentStep) >
    steps.findIndex((s) => s.name === stepName);

  if (
    isCompleted ||
    stepName === "Order Placed" ||
    (stepName === "Quality Check Passed" && isQCCompleted)
  ) {
    Icon = CheckCircle;
    iconClasses = "text-green-500 bg-green-50";
    detailColor = "text-gray-500";
    textWeight = "font-medium";
  } else if (status === "current") {
    Icon = Clock;
    iconClasses = "text-blue-500 bg-blue-50";
    detailColor = "text-gray-600 font-semibold";
    textWeight = "font-semibold";
  } else if (stepName === "Shipped") {
    Icon = Truck;
    iconClasses = "text-gray-500 bg-gray-100";
    detailColor = "text-gray-500";
    textWeight = "font-medium";
  } else if (stepName === "Delivered") {
    Icon = CheckCircle2;
    iconClasses = "text-gray-500 bg-gray-100";
    detailColor = "text-gray-500";
    textWeight = "font-medium";
  } else {
    Icon = Clock;
    iconClasses = "text-gray-500 bg-gray-100";
    detailColor = "text-gray-500";
    textWeight = "font-medium";
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        {/* Status Icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center p-1 ${iconClasses}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {/* Vertical Line */}
        {!isLast && <div className="h-10 w-0.5 bg-gray-200 mt-0.5" />}
      </div>

      {/* Content */}
      <div className="pt-1.5 pb-4">
        <p className={`text-base text-gray-800 ${textWeight}`}>{stepName}</p>
        <p className={`text-sm ${detailColor}`}>{stepDetail}</p>
      </div>
    </div>
  );
};
// --- END: TimelineStep Component ---

// ---------------- Dummy Data ----------------










// --- END: Payment and Delivery Mock Data ---

// ---------------- Reusable Components ----------------

const Title = ({ text, paragraph }: { text: string; paragraph?: string }) => (
  <div className="flex flex-col space-y-1">
    <h2 className="text-[24px] font-normal text-[#1a1410]">{text}</h2>
    {paragraph && (
      <p
        className=" text-[#6b6560] 
                 text-[16px] 
                 font-normal"
      >
        {paragraph}
      </p>
    )}
  </div>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white p-6 md:p-8 rounded-2xl border border-[#e8e3dc] ${className}`}
  >
    {children}
  </div>
);

// --- Summary Stat Component (Type fix applied here) ---
interface SummaryStatProps {
  // FIX: Type must allow additional props like 'className' when cloned
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  value: string | React.ReactElement;
  isTotal?: boolean;
}

const SummaryStat: React.FC<SummaryStatProps> = ({
  icon,
  label,
  value,
  isTotal = false,
}) => {
  if (isTotal) {
    // Styling for the Total Amount box (Brown background)
    return (
      <div className="flex items-start p-6 rounded-xl w-full h-full bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white">
        {/* Adjusted icon positioning for total box */}
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center text-sm font-medium">
            {/* LINE 264 FIX: icon prop is now typed correctly */}
            {React.cloneElement(icon, { className: "w-5 h-5 mr-1" })} {label}
          </div>
          <span className="text-2xl font-semibold">{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-start p-5 gap-2 rounded-xl bg-[#faf9f7] w-full`}
    >
      {/* Icon for regular stats */}
      <div className="flex items-center text-sm text-gray-600 font-medium">
        {React.cloneElement(icon, {
          className: "w-5 h-5 mr-1 text-yellow-800/80",
        })}
        {label}
      </div>
      <div className="text-xl font-semibold text-gray-800">{value}</div>
    </div>
  );
};

// --- OrderSummary Card Component (Kept as is) ---

// --- END: OrderSummary Card Component ---

// --- CustomerStat Component (Kept as is, no cloneElement type issue here) ---
interface CustomerStatProps {
  icon: React.ReactElement<{ className?: string }>; // Also updated here for consistency
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const CustomerStat: React.FC<CustomerStatProps> = ({
  icon,
  label,
  value,
  // bgColor and iconColor are now fixed styles in the card above but included here for completeness
  bgColor,
  iconColor,
}) => (
  <div
    className={`flex items-start p-6 rounded-xl w-full h-full bg-[#FAF9F7] `}
  >
    <div
      className={`p-3 rounded-xl mr-4 ${bgColor} ${iconColor} flex items-center justify-center`}
    >
      {React.cloneElement(icon, { className: "w-5 h-5" })}
    </div>

    <div className="flex flex-col items-start pt-1">
      <span className="text-sm text-gray-500 font-medium mb-1">{label}</span>
      <span className="text-base font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);


const App = ({
  onViewChange,
  productId,
}: {
  onViewChange: ViewChangeHandler;
  productId: number;
}) => {
  const { data: order, isLoading, error } = useGetOrderByIdQuery(productId);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-sans">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-4 sm:p-8 w-full  bg-gray-50 font-sans">
        <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-[#e8e3dc]">
          <button
            onClick={() => onViewChange("listOrder")}
            className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>

          <Title
            text="Order Not Found"
            paragraph={`Could not load order ID: ${productId}`}
          />
        </div>

        <Card>
          <p className="text-red-500">
            Error: The requested order could not be loaded.
          </p>
        </Card>
      </div>
    );
  }

  const mockOrderStatusDetails = {
    currentStep: order.status === "paid" ? "Order Placed" : order.status,
    steps: [
      {
        name: "Order Placed",
        date: new Date(order.date).toLocaleDateString(),
      },
      {
        name: "Quality Check Passed",
        date: "Verified",
      },
      {
        name: "In Production",
        date: order.status === "processing" ? "Active" : "Completed",
      },
      {
        name: "Shipped",
        date: order.status === "shipped" ? "In Transit" : "Pending",
      },
      {
        name: "Delivered",
        date: ["completed", "delivered"].includes(order.status.toLowerCase()) ? "Success" : "Pending",
      },
    ],
  };

  const { steps, currentStep } = mockOrderStatusDetails;

  return (
    <>
      <div className="p-4 sm:p-8 w-full bg-gray-50 font-sans">
        {/* Header */}
        <div className="flex flex-col-reverse lg:flex-row items-start lg:items-center justify-between mb-8 pb-4 border-b border-[#e8e3dc] space-y-4 lg:space-y-0">
          {/* Left Section (Back Button and Title) - Always full width */}
          <div className="flex w-full lg:w-auto items-center space-x-4 order-2 lg:order-1">
            <button
              onClick={() => onViewChange("listOrder")}
              className="p-3 bg-white rounded-xl border border-[#E8E3DC] hover:bg-gray-100 transition text-gray-600"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>

            <Title
              text="Order Details"
              paragraph="Complete information about this product"
            />
          </div>

          {/* Right Section (Print Button) - Full width on small screens, condensed on large screens */}
          <div className="flex w-full lg:w-auto space-x-3 order-1 lg:order-2">
            {/* ADDED: onClick handler for printing */}
            <button
              onClick={() => window.print()}
              className="flex w-full lg:w-auto items-center justify-center px-4 py-2 bg-[linear-gradient(180deg,#8b6f47,#7a5f3a)] text-white font-semibold rounded-xl border border-[#E8E3DC] hover:opacity-90 transition "
            >
              <Printer className="w-4 h-4 mr-2 text-white" /> Print Order
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column (Product & Status) */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="p-4 space-y-5">
              <h1 className=" text-[#1A1410] text-[16px] font-sans font-medium ">
                Product & Design
              </h1>


              {/* Status & Info */}
              <div className="space-y-3">
                <div className="flex w-full justify-between items-center border-b pb-2 border-[#e8e3dc] ">
                  <div className="flex flex-col ">
                    <span className="text-[12px] text-[#6B6560] font-medium">
                      Product Name
                    </span>
                    <span className="text-[14px] text-[#1A1410] font-medium">
                      {order.product}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-2 border-[#e8e3dc] ">
                  <span className="text-sm text-gray-500 font-medium">
                    Design Type
                  </span>
                  <span className="text-sm font-medium text-[#8200DB] py-1 px-3 rounded-xl bg-[#F3E8FF] border border-transparent ">
                    {order.design_type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 font-medium">
                    Order UID
                  </span>
                  <span className="text-sm font-semibold border flex justify-center gap-2 border-[#e8e3dc] text-gray-700 py-1 px-3 rounded-xl bg-[#DCFCE7]">
                    {order.order_uid}
                  </span>
                </div>
              </div>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <h3 className="text-xl font-normal text-gray-800 mb-6">
                Order Status
              </h3>

              <div className="space-y-0">
                {steps.map((step, index) => {
                  let status: TimelineStepProps["status"];
                  const stepIndex = steps.findIndex(
                    (s) => s.name === step.name
                  );
                  const currentIndex = steps.findIndex(
                    (s) => s.name === currentStep
                  );

                  if (stepIndex < currentIndex) {
                    status = "complete";
                  } else if (stepIndex === currentIndex) {
                    status = "current";
                  } else {
                    status = "pending";
                  }

                  return (
                    <TimelineStep
                      key={step.name}
                      status={status}
                      stepName={step.name}
                      stepDetail={step.date}
                      isLast={index === steps.length - 1}
                    />
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column (Order Summary, Customer Info, Payment & Delivery) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Order Summary Card */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-normal text-[#1a1410] font-sans">
                  Order Summary
                </h2>
                <div className="flex items-center px-4 py-2 bg-blue-100 text-[#1447E6] rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1 text-[#1447E6] " />
                  {order.status}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryStat
                  icon={<Package />}
                  label="Quantity"
                  value={`${order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} items`}
                />

                {/* 🎨 Color - Mocking as not in admin order detail yet */}
                <div className={`flex flex-col justify-start p-5 gap-2 rounded-xl bg-[#faf9f7] w-full`}>
                  <div className="flex items-center text-sm text-gray-600 font-medium">
                    <Palette className="w-5 h-5 mr-1 text-yellow-800/80" />
                    Color
                  </div>
                  <div className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-black border border-gray-400" />
                    <span>Multiple</span>
                  </div>
                </div>

                <SummaryStat icon={<Expand />} label="Items" value={`${order.items.length}`} />

                <SummaryStat
                  icon={<DollarSign />}
                  label="Total Amount"
                  value={`€${order.amount}`}
                  isTotal={true}
                />
              </div>
            </Card>

            {/* 2. Customer Information Card */}
            <Card>
              <h2 className="text-xl font-normal text-[#1a1410] font-sans mb-6">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomerStat
                  icon={<User />}
                  label="Customer Name"
                  value={order.shipping_details?.customer_name || order.customer_email.split('@')[0]}
                  bgColor="bg-[#faf9f7]"
                  iconColor="text-blue-500"
                />
                <CustomerStat
                  icon={<Mail />}
                  label="Email Address"
                  value={order.customer_email}
                  bgColor="bg-[#faf9f7]"
                  iconColor="text-green-500"
                />
                <CustomerStat
                  icon={<Phone />}
                  label="Phone Number"
                  value={order.shipping_details?.phone || "N/A"}
                  bgColor="bg-[#faf9f7]"
                  iconColor="text-purple-500"
                />
                <CustomerStat
                  icon={<MapPin />}
                  label="Shipping Address"
                  value={order.shipping_details?.address || "N/A"}
                  bgColor="bg-[#faf9f7]"
                  iconColor="text-orange-500"
                />
              </div>
            </Card>

            {/* 3. Payment Details and Delivery Information (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Payment Details */}
              <Card className="flex flex-col h-full">
                <h2 className="text-xl font-normal text-[#1a1410] font-sans mb-6">
                  Payment Details
                </h2>
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex items-start p-4 rounded-xl bg-[#faf9f7]">
                    <CreditCard className="w-5 h-5 mr-3 mt-1 text-yellow-800/80" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium">Method</span>
                      <span className="text-base font-semibold text-gray-800">{order.payment_details?.method || "Paid"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between text-base text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">€{order.payment_details?.subtotal || order.amount}</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-700">
                    <span>Shipping</span>
                    <span className="font-medium">€{order.payment_details?.shipping_cost || "0.00"}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 mt-4">
                  <span className="text-xl font-semibold text-[#1a1410]">Total</span>
                  <span className="text-xl font-semibold text-[#8b6f47]">€{order.amount}</span>
                </div>
              </Card>

              {/* Delivery Info */}
              <Card className="flex flex-col h-full">
                <h2 className="text-xl font-normal text-[#1a1410] font-sans mb-6">
                  Delivery Information
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start p-4 rounded-xl bg-[#faf9f7]">
                    <Calendar className="w-5 h-5 mr-3 mt-1 text-yellow-800/80" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 font-medium">Payment Date</span>
                      <span className="text-base font-semibold text-gray-800">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Quality Assurance
                  </h3>
                  <p className="text-sm text-gray-600">Standard verified.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
