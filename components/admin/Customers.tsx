import React, { useState } from "react";
import { Search, Eye, Edit, Trash2 } from "lucide-react";

import CustomerDetails from "./CustomerDetails";
import EditCustomer from "./EditCustomer";

// NOTE: Ensure the path to your icon is correct in your project structure
import orderIcon from "@/public/image/admin/products/orderIcon.svg";
import Image from "next/image";
import Footer from "./FooterAdmin";
import AddNewProductScreen from "./products/createProducts/AddprofuctSection";

// --- Type Definitions ---
type ViewType = "list" | "add" | "view" | "edit";
type ViewChangeHandler = (view: ViewType, id?: number) => void;

// -----------------------------
// Utility: Title + Paragraph
const Title = ({ text, paragraph }: { text: string; paragraph?: string }) => (
  <div className="flex flex-col space-y-1">
    <h2 className="text-2xl text-gray-800">{text}</h2>
    {paragraph && <p className="text-sm text-gray-500">{paragraph}</p>}
  </div>
);

// --- UPDATED INTERFACE TO REFLECT CUSTOMER DATA ---
interface Customer {
  id: number;
  name: string;
  email: string;
  segment: "Regular" | "New";
  totalOrders: number;
  totalSpent: string;
  preferredDesign: "AI Generated" | "User Upload";
  lastOrder: string;
}

// --- INITIAL CUSTOMER DATA ---
const initialCustomerData: Customer[] = [
  {
    id: 1,
    name: "Emma Schmidt",
    email: "emma.s@email.com",
    segment: "Regular",
    totalOrders: 12,
    totalSpent: "€418.88",
    preferredDesign: "AI Generated",
    lastOrder: "Oct 10, 2025",
  },
  {
    id: 2,
    name: "Lucas Müller",
    email: "lucas.m@email.com",
    segment: "Regular",
    totalOrders: 8,
    totalSpent: "€279.92",
    preferredDesign: "AI Generated",
    lastOrder: "Oct 10, 2025",
  },
  {
    id: 3,
    name: "Sophie Weber",
    email: "sophie.w@email.com",
    segment: "Regular",
    totalOrders: 15,
    totalSpent: "€524.85",
    preferredDesign: "User Upload",
    lastOrder: "Oct 09, 2025",
  },
  {
    id: 4,
    name: "Noah Fischer",
    email: "noah.f@email.com",
    segment: "Regular",
    totalOrders: 5,
    totalSpent: "€174.95",
    preferredDesign: "User Upload",
    lastOrder: "Oct 09, 2025",
  },
  {
    id: 5,
    name: "Mia Becker",
    email: "mia.b@email.com",
    segment: "New",
    totalOrders: 20,
    totalSpent: "€798.80",
    preferredDesign: "AI Generated",
    lastOrder: "Oct 08, 2025",
  },
  {
    id: 6,
    name: "Leon Wagner",
    email: "leon.w@email.com",
    segment: "New",
    totalOrders: 3,
    totalSpent: "€104.97",
    preferredDesign: "User Upload",
    lastOrder: "Oct 08, 2025",
  },
];

// Segment Badge Component
const SegmentBadge = ({ segment }: { segment: "Regular" | "New" }) => {
  const isRegular = segment === "Regular";
  return (
    <span
      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
        isRegular ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
      }`}
    >
      {segment}
    </span>
  );
};

// Highlight Text for Search
const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) return <>{text}</>;

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

// -----------------------------
// Customer Table Component
// -----------------------------
const CustomerTable = ({
  data,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  searchTerm,
}: {
  data: Customer[];
  onViewProduct: (id: number) => void;
  onEditProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
  searchTerm: string;
}) => (
  <div className="bg-white rounded-xl border border-[#e8e3dc] overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Segment
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Total Orders
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Total Spent
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Preferred Design
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Last Order
          </th>
          <th className="px-6 py-3 text-right text-xs font-bold text-[#1a1410] uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((customer) => (
          <tr key={customer.id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <div className="flex flex-col">
                <HighlightText text={customer.name} highlight={searchTerm} />
                <span className="text-xs text-gray-500">
                  <HighlightText text={customer.email} highlight={searchTerm} />
                </span>
              </div>
            </td>

            <td className="px-6 py-4 text-sm">
              <SegmentBadge segment={customer.segment} />
            </td>

            <td className="px-6 py-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Image src={orderIcon} alt="Orders" className="w-4 h-4 mr-2" />
                <span>{customer.totalOrders}</span>
              </div>
            </td>

            <td className="px-6 py-4 text-sm font-medium text-gray-800">
              <HighlightText
                text={customer.totalSpent}
                highlight={searchTerm}
              />
            </td>

            <td className="px-6 py-4 text-sm text-gray-500">
              <HighlightText
                text={customer.preferredDesign}
                highlight={searchTerm}
              />
            </td>

            <td className="px-6 py-4 text-sm text-gray-500">
              {customer.lastOrder}
            </td>

            <td className="px-6 py-4 text-right text-sm font-medium">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => onViewProduct(customer.id)}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => onEditProduct(customer.id)}
                  className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                  title="Edit Customer"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => onDeleteProduct(customer.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete Customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {data.length === 0 && (
      <div className="text-center py-10 text-gray-500">
        No customers found matching your criteria.
      </div>
    )}
  </div>
);

// -----------------------------
// Customer List Screen
// -----------------------------
const ProductListScreen = ({
  onViewChange,
  onDeleteProduct,
  productData,
}: {
  onViewChange: ViewChangeHandler;
  onDeleteProduct: (id: number) => void;
  productData: Customer[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All Segments");
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredCustomers = productData.filter((customer) => {
    const searchLower = searchTerm.toLowerCase().trim();

    const matchesSearch =
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.totalSpent.toLowerCase().includes(searchLower) ||
      customer.preferredDesign.toLowerCase().includes(searchLower);

    const matchesSegment =
      selectedSegment === "All Segments" ||
      customer.segment === selectedSegment;

    const matchesType =
      selectedType === "All Types" || customer.preferredDesign === selectedType;

    return matchesSearch && matchesSegment && matchesType;
  });

  const uniqueSegments = [
    "All Segments",
    ...Array.from(new Set(initialCustomerData.map((c) => c.segment))),
  ];

  const uniqueTypes = [
    "All Types",
    ...Array.from(new Set(initialCustomerData.map((c) => c.preferredDesign))),
  ];

  return (
    <div className="pt-8 px-4 sm:p-10 w-full bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <Title
          text="Customers"
          paragraph="View and manage your customer base"
        />
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#e8e3dc] mb-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-800 placeholder-gray-500 focus:outline-none transition"
            />
          </div>

          {/* Segment Filter */}
          <div className="relative w-full md:w-auto md:min-w-[180px]">
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 pr-10 text-gray-700"
            >
              {uniqueSegments.map((seg) => (
                <option key={seg}>{seg}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative w-full md:w-auto md:min-w-[180px]">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 pr-10 text-gray-700"
            >
              {uniqueTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
        <div className="md:col-span-2">
          <CustomerTable
            data={filteredCustomers}
            onViewProduct={(id) => onViewChange("view", id)}
            onEditProduct={(id) => onViewChange("edit", id)}
            onDeleteProduct={onDeleteProduct}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// Main App Component
// -----------------------------
const App = () => {
  const [customerData, setCustomerData] =
    useState<Customer[]>(initialCustomerData);

  const [view, setView] = useState<ViewType>("list");
  const [currentCustomerId, setCurrentCustomerId] = useState<number>(0);

  const handleViewChange: ViewChangeHandler = (newView, id = 0) => {
    setCurrentCustomerId(id);
    setView(newView);
  };

  const handleDeleteProduct = (id: number) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete customer ID: ${id}?`
    );

    if (isConfirmed) {
      setCustomerData((prev) => prev.filter((customer) => customer.id !== id));

      alert(`Customer ID ${id} deleted successfully.`);

      if (view !== "list" && currentCustomerId === id) {
        handleViewChange("list");
      }
    }
  };

  return (
    <div className="bg-gray-50">
      {view === "list" && (
        <ProductListScreen
          onViewChange={handleViewChange}
          onDeleteProduct={handleDeleteProduct}
          productData={customerData}
        />
      )}

      {view === "add" && (
        <AddNewProductScreen
          onViewChange={(newView: string) =>
            handleViewChange(newView as ViewType)
          }
        />
      )}

      {view === "view" && currentCustomerId > 0 && (
        <CustomerDetails
          onViewChange={(newView: string) =>
            handleViewChange(newView as ViewType)
          }
          productId={currentCustomerId}
        />
      )}

      {view === "edit" && currentCustomerId > 0 && (
        <EditCustomer
          onViewChange={(newView: string) =>
            handleViewChange(newView as ViewType)
          }
        />
      )}

      <div className="mt-6 relative -bottom-17">
        <Footer />
      </div>
    </div>
  );
};

export default App;
