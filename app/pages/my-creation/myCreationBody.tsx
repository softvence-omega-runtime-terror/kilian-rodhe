"use client";

import { useState } from "react";
import Image from "next/image";
import icon from "@/public/image/myCreationIcon/Icon.svg";

// ----------------------------------------------------
// 1. TYPES
// ----------------------------------------------------

type Product = {
  id: string;
  status?: string;
  title: string;
  productType: string;
  design: string;
  orderDate?: string;
  savedDate?: string;
  price: number;
  image: string;
};

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

type ProductCardProps = {
  product: Product;
  tabType: "ordered" | "saved" | "my";
  onDelete?: (id: string, title: string) => void;
};

// --- NEW TYPE FOR EMPTY STATE PROPS ---
type EmptyCreationsStateProps = {
  onFindProduct: () => void;
  isLoading: boolean;
};

// ----------------------------------------------------
// 2. COMMON DATA
// ----------------------------------------------------

const COMMON_TITLE = "My Custom Design";

// Ordered Products (Dummy data remains the same)
const DUMMY_ORDERED_PRODUCTS: Product[] = [
  {
    id: "o1",
    status: "Delivered",
    title: COMMON_TITLE,
    productType: "Premium Cotton T-Shirt",
    design: "Sunset Landscape",
    orderDate: "Nov 15, 2025",
    price: 29.99,
    image:
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png?dpr=1.2&auto=format&nrs=0&w=600",
  },
  {
    id: "o2",
    status: "In Transit",
    title: COMMON_TITLE,
    productType: "Comfort Hoodie",
    design: "Abstract Art",
    orderDate: "Nov 10, 2025",
    price: 54.99,
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg?v=1732862026",
  },
  {
    id: "o3",
    status: "Delivered",
    title: COMMON_TITLE,
    productType: "Ceramic Mug",
    design: "Coffee Lover",
    orderDate: "Nov 5, 2025",
    price: 37.99,
    image:
      "https://www.smarteshopbd.com/wp-content/uploads/2022/12/electric-ceramic-coffee-mug-and-saucer.jpg",
  },
];

// Saved Designs (Dummy data remains the same)
const DUMMY_SAVED_DESIGNS: Product[] = [
  {
    id: "s1",
    title: COMMON_TITLE,
    productType: "Premium Cotton T-Shirt",
    design: "Beach Sunset",
    savedDate: "Nov 20, 2025",
    price: 79.99,
    image:
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png?dpr=1.2&auto=format&nrs=0&w=600",
  },
  {
    id: "s2",
    title: COMMON_TITLE,
    productType: "Comfort Hoodie",
    design: "Modern Logo",
    savedDate: "Nov 18, 2025",
    price: 49.99,
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg?v=1732862026",
  },
];

// My Designs (Dummy data remains the same)
const DUMMY_MY_DESIGNS: Product[] = [
  {
    id: "m1",
    title: COMMON_TITLE,
    productType: "Ceramic Mug",
    design: "Blue Hexagons",
    savedDate: "Oct 28, 2025",
    price: 30.0,
    image:
      "https://www.smarteshopbd.com/wp-content/uploads/2022/12/electric-ceramic-coffee-mug-and-saucer.jpg",
  },
  {
    id: "m2",
    title: COMMON_TITLE,
    productType: "Comfort Hoodie",
    design: "Taco Icon",
    savedDate: "Oct 20, 2025",
    price: 250.0,
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg?v=1732862026",
  },
  {
    id: "m3",
    title: COMMON_TITLE,
    productType: "Premium Cotton T-Shirt",
    design: "Floral Scroll",
    savedDate: "Sep 15, 2025",
    price: 50.0,
    image:
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png?dpr=1.2&auto=format&nrs=0&w=600",
  },
  {
    id: "m4",
    title: COMMON_TITLE,
    productType: "Ceramic Mug",
    design: "Angry Bear",
    savedDate: "Sep 10, 2025",
    price: 20.0,
    image:
      "https://www.smarteshopbd.com/wp-content/uploads/2022/12/electric-ceramic-coffee-mug-and-saucer.jpg",
  },
];

// ----------------------------------------------------
// 3. DELETE CONFIRMATION MODAL (No changes)
// ----------------------------------------------------

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-lg font-bold text-gray-900">
            Confirm Design Deletion
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Are you sure you want to delete:{" "}
            <strong>&quot;{title}&quot;</strong>?
          </p>
        </div>

        <div className="mt-5 flex justify-between gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border-2 border-[#E8E3DC] px-4 py-2 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. PRODUCT CARD (No changes)
// ----------------------------------------------------

const ProductCard = ({ product, tabType, onDelete }: ProductCardProps) => {
  const isOrdered = tabType === "ordered";
  const isSaved = tabType === "saved";
  const isMyDesign = tabType === "my";

  const statusColor =
    product.status === "Delivered" ? "bg-yellow-600" : "bg-orange-600";
  const statusText =
    product.status === "Delivered" ? "Delivered" : "In Transit";

  const dateLabel = isOrdered ? "Order Date:" : "Created Date:";
  const dateValue = isOrdered ? product.orderDate : product.savedDate;

  const showDeleteButton =
    (isSaved || isMyDesign) && typeof onDelete === "function";

  return (
    <div className="rounded-lg border-2 border-[#E8E3DC] bg-white hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg">
        <img src={product.image} alt={product.title} className="w-full h-full" />

        {isOrdered && (
          <span
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white ${statusColor}`}
          >
            {statusText}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-1 truncate">
          {product.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4">{product.productType}</p>

        <div className="grid grid-cols-2 text-sm gap-y-2">
          <div className="text-gray-500">Design:</div>
          <div className="font-medium text-right">{product.design}</div>

          <div className="text-gray-500">{dateLabel}</div>
          <div className="font-medium text-right">{dateValue}</div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8E3DC] flex justify-between items-center">
          <p className="text-lg font-bold text-gray-500">Price:</p>
          <p className="text-2xl text-indigo-600">
            €{product.price.toFixed(2)}
          </p>
        </div>

        {/* Delete Button */}
        {showDeleteButton && (
          <button
            onClick={() => onDelete!(product.id, product.title)}
            className="mt-4 w-full text-red-600 py-2 border border-red-300 rounded-lg"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. EMPTY STATE (MODIFIED)
// ----------------------------------------------------

const EmptyCreationsState = ({
  onFindProduct,
  isLoading,
}: EmptyCreationsStateProps) => (
  <div className="mt-16 text-center max-w-lg mx-auto p-10">
    <div className="mx-auto h-28 w-28 mb-6">
      <Image
        src={icon}
        alt="No Creations Icon"
        className="w-full h-full object-contain opacity-90"
      />
    </div>
    <h2 className="text-xl font-bold mb-2">No Creations Yet</h2>
    <p className="text-md text-gray-500 mb-8">
      You haven&apos;t created any designs or ordered any products yet.
    </p>
    <button
      onClick={onFindProduct}
      disabled={isLoading}
      className={`px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg transition-colors flex items-center justify-center mx-auto ${
        isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#c9a632]"
      }`}
    >
      {isLoading ? (
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
          FINDING...
        </>
      ) : (
        "FIND A PRODUCT"
      )}
    </button>
  </div>
);

// ----------------------------------------------------
// 6. MAIN PAGE (MODIFIED)
// ----------------------------------------------------

export default function App() {
  const [activeTab, setActiveTab] = useState<"ordered" | "saved" | "my">(
    "ordered"
  );
  const [isLoading, setIsLoading] = useState(false); // New state for loader

  const [savedProducts, setSavedProducts] =
    useState<Product[]>(DUMMY_SAVED_DESIGNS);
  const [orderedProducts] = useState<Product[]>(DUMMY_ORDERED_PRODUCTS);
  const [myDesigns, setMyDesigns] = useState<Product[]>(DUMMY_MY_DESIGNS);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
    tab: "saved" | "my" | null;
  }>({
    isOpen: false,
    id: null,
    title: "",
    tab: null,
  });

  // --- MODIFIED handleFindProduct to include loading state ---
  const handleFindProduct = () => {
    setIsLoading(true);

    // Simulate an artificial delay before redirection to show the loader
    // In a real application, this delay would be the time taken for an async action (e.g., API call)
    setTimeout(() => {
      window.location.href = "/pages/shop";
      // setIsLoading(false); // This line is not needed as the page redirects
    }, 1000); // 1-second delay for demonstration
  };

  const openDeleteModal = (
    id: string,
    title: string,
    tabId: "saved" | "my"
  ) => {
    setModalState({ isOpen: true, id, title, tab: tabId });
  };

  const closeDeleteModal = () =>
    setModalState({ isOpen: false, id: null, title: "", tab: null });

  const confirmDeletion = () => {
    if (modalState.tab === "saved") {
      setSavedProducts((prev) =>
        prev.filter((p) => p.id !== modalState.id)
      );
    } else if (modalState.tab === "my") {
      setMyDesigns((prev) =>
        prev.filter((p) => p.id !== modalState.id)
      );
    }

    closeDeleteModal();
  };

  const renderContent = (products: Product[], tabId: "ordered" | "saved" | "my") => {
    if (products.length === 0)
      return (
        <EmptyCreationsState
          onFindProduct={handleFindProduct} // Pass handler
          isLoading={isLoading} // Pass loading state
        />
      );

    const deleteHandler =
      tabId === "saved" || tabId === "my"
        ? (id: string, title: string) => openDeleteModal(id, title, tabId)
        : undefined;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            tabType={tabId}
            onDelete={deleteHandler}
          />
        ))}
      </div>
    );
  };

  const tabs = [
    {
      id: "ordered",
      label: "ORDERED PRODUCTS",
      count: orderedProducts.length,
    },
    {
      id: "saved",
      label: "SAVED DESIGNS",
      count: savedProducts.length,
    },
    {
      id: "my",
      label: "MY DESIGNS",
      count: myDesigns.length,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="pt-16 pb-12 text-center">
        <h1 className="text-4xl italic text-gray-800">My Creations</h1>
        <p className="mt-2 text-md text-gray-500">
          Manage your orders and saved designs in one place.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex justify-center space-x-6 mb-10 bg-white p-2 rounded-xl border-2 border-[#E8E3DC]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 rounded-lg transition-all ${
                  isActive
                    ? "text-white bg-indigo-600"
                    : "text-gray-600 bg-white"
                }`}
              >
                <span className="uppercase">{tab.label}</span>
                <span
                  className={`rounded-full px-2 text-xs font-bold ${
                    isActive ? "bg-white text-indigo-600" : "bg-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="pb-16">
          {activeTab === "ordered" &&
            renderContent(orderedProducts, "ordered")}
          {activeTab === "saved" &&
            renderContent(savedProducts, "saved")}
          {activeTab === "my" && renderContent(myDesigns, "my")}
        </div>
      </div>

      {/* Modal */}
      <DeleteConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeletion}
        title={modalState.title}
      />
    </div>
  );
}