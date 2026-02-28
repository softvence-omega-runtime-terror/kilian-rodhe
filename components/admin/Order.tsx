import React, { useState, useRef, useEffect } from "react";
import { Search, Eye, ChevronUp, ChevronDown } from "lucide-react";

// Assuming OrderView is a placeholder component for viewing order details
import OrderView from "./OrderView";
import Footer from "./FooterAdmin";
import { useGetOrdersQuery, IOrderAdminItem } from "@/app/store/slices/services/adminService/orderAdminApi";

// --- Custom Dropdown Component ---
interface DropdownFilterProps {
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const displayValue = selectedValue === options[0] ? title : selectedValue;
  const Icon = isOpen ? ChevronUp : ChevronDown;

  return (
    <div
      className="relative w-full md:w-auto md:min-w-[180px]"
      ref={dropdownRef}
    >
      <button
        onClick={toggleOpen}
        className="w-full px-4 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-700 focus:outline-none transition duration-200 flex justify-between items-center hover:bg-neutral-200"
      >
        <span className="truncate">{displayValue}</span>
        <Icon className="w-4 h-4 text-gray-500 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-2 w-full min-w-[180px] bg-white rounded-xl shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
          {/* Header based on image */}

          {/* Options */}
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 transition duration-150 ${selectedValue === option
                ? "font-semibold text-gray-900 bg-gray-50"
                : "text-gray-700"
                }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
// --- End: Custom Dropdown Component ---

// --- New Type Definitions ---
type ViewType = "listOrder" | "add" | "viewOrder" | "editOrder";
type ViewChangeHandler = (view: ViewType, id?: number) => void;

// -----------------------------
// Utility: Title + Paragraph
const Title = ({ text, paragraph }: { text: string; paragraph?: string }) => (
  <div className="flex flex-col space-y-1">
    <h2 className="text-2xl text-gray-800">{text}</h2>
    {paragraph && <p className="text-sm text-gray-500">{paragraph}</p>}
  </div>
);

// --- UPDATED INTERFACE FOR ORDER DATA ---
type OrderStatus = "Processing" | "Completed" | "Shipped" | "Quality Check";
// Match the types from the image's "All Types" dropdown
type OrderDesignType = "AI Generated" | "User Upload" | "Letter/Number";

interface Order {
  id: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  product: string;
  designType: OrderDesignType; // Updated type
  amount: string;
  date: string;
  status: OrderStatus; // Updated type
}



// Helper component for the status badge (UPDATED COLORS)
const StatusBadge = ({ status }: { status: string }) => {
  const getBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "quality check":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-semibold ${getBadgeStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span
            key={index}
            className="bg-yellow-200 font-semibold rounded px-0.5"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

// Main Table Component (MODIFIED ACTIONS)
const OrderTable = ({
  data,
  onViewOrder,
  searchTerm,
}: {
  data: IOrderAdminItem[];
  onViewOrder: (id: number) => void;
  searchTerm: string;
}) => (
  <div className="bg-white rounded-xl border border-[#e8e3dc] overflow-x-auto ">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 font-bold font-sans text-[#1a1410] text-[14px] ">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Order ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs  font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Design Type
          </th>
          <th className="px-6 py-3 text-left text-xs  font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs  font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs  font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs  font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((order) => (
          <tr
            key={order.id}
            className="hover:bg-gray-50 transition duration-150"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <HighlightText text={order.order_uid} highlight={searchTerm} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#1a1410]">
              <div className="flex flex-col">
                <HighlightText
                  text={order.customer_email.split('@')[0]}
                  highlight={searchTerm}
                />
                <span className="text-xs text-gray-400">
                  <HighlightText
                    text={order.customer_email}
                    highlight={searchTerm}
                  />
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <HighlightText text={order.product} highlight={searchTerm} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <HighlightText text={order.design_type} highlight={searchTerm} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
              <HighlightText text={`€${order.amount}`} highlight={searchTerm} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <StatusBadge status={order.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-4">
                {/* Only View Button Remains */}
                <button
                  onClick={() => onViewOrder(order.id)}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {data.length === 0 && (
      <div className="text-center py-10 text-gray-500">
        No orders found matching your criteria.
      </div>
    )}
  </div>
);

// --- Order List Screen (RENAMED) ---
const OrderListScreen = ({
  onViewChange,
  orderData,
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedDesignType,
  setSelectedDesignType,
}: {
  onViewChange: ViewChangeHandler;
  orderData: IOrderAdminItem[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedDesignType: string;
  setSelectedDesignType: (val: string) => void;
}) => {
  const handleViewOrder = (id: number) => {
    onViewChange("viewOrder", id);
  };

  const uniqueStatuses = [
    "All Status",
    "Processing",
    "Quality Check",
    "Shipped",
    "Completed",
    "Paid"
  ];

  const uniqueDesignTypes = [
    "All Types",
    "AI Generated",
    "User Upload",
    "Letter/Number",
    "Customize"
  ];
  return (
    <div className="p-4 sm:p-8 w-full bg-gray-50">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-6">
        <Title
          text="Orders Management"
          paragraph="View and manage all customer orders"
        />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#e8e3dc] mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders, customers, or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-800 placeholder-gray-500 focus:outline-none transition duration-200"
            />
          </div>

          {/* 1. Status Dropdown (Custom Component) */}
          <DropdownFilter
            title="All Status"
            options={uniqueStatuses}
            selectedValue={selectedStatus}
            onSelect={setSelectedStatus}
          />

          {/* 2. Types Dropdown (Custom Component) */}
          <DropdownFilter
            title="All Types"
            options={uniqueDesignTypes}
            selectedValue={selectedDesignType}
            onSelect={setSelectedDesignType}
          />
        </div>
      </div>
      {/* --- END: Search and Filters Section --- */}

      {/* Order Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="md:col-span-2">
          {/* Filter locally as well for better UX or just rely on API? Initial plan says fetch from API. We already pass search/status to API in App. So we just show orderData. */}
          <OrderTable
            data={orderData}
            onViewOrder={handleViewOrder}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [view, setView] = useState<ViewType>("listOrder");
  const [currentOrderId, setCurrentOrderId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDesignType, setSelectedDesignType] = useState("All Types");

  const { data: ordersData } = useGetOrdersQuery({
    search: searchTerm || undefined,
    status: selectedStatus === "All Status" ? undefined : selectedStatus,
    design_type: selectedDesignType === "All Types" ? undefined : selectedDesignType
  });

  const orders = ordersData?.results || [];

  const handleViewChange: ViewChangeHandler = (newView, id = 0) => {
    setCurrentOrderId(id);
    setView(newView);
  };

  return (
    <div className="mt-4 bg-gray-50">
      {view === "listOrder" && (
        <OrderListScreen
          onViewChange={handleViewChange}
          orderData={orders}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDesignType={selectedDesignType}
          setSelectedDesignType={setSelectedDesignType}
        />
      )}

      {view === "viewOrder" && currentOrderId > 0 && (
        <OrderView
          onViewChange={(newView: string) =>
            handleViewChange(newView as ViewType)
          }
          productId={currentOrderId}
        />
      )}

      <div className="mt-6 relative -bottom-17">
        <Footer />
      </div>
    </div>
  );
};

export default App;
