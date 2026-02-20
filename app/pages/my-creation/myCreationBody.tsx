"use client";
import React, { useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { useRouter } from "next/navigation";
import { useGetCustomProductsQuery, ICustomProductVersion, useDeleteCustomProductVersionMutation } from "@/app/store/slices/services/ai/aiApi";
import { useGetOrdersQuery, IOrder } from "@/app/store/slices/services/order/orderApi";

// Placeholder image for standalone environment
// const ICON_PLACEHOLDER_URL =
//   "https://placehold.co/112x112/E0E7FF/4338CA/png?text=%E2%9C%A8";

// Ensure you have this path or replace with a local placeholder if needed
import emptyIcon from "@/public/image/myCreationIcon/Icon.svg";
import Image from "next/image";

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["italic"],
});


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
  version: number;
};

type ProductCardProps = {
  product: Product;
  tabType: "ordered" | "saved" | "my";
  onDelete?: (id: string, title: string) => void;
};

type EmptyCreationsStateProps = {
  onFindProduct: () => void;
  isLoading: boolean;
};

// ----------------------------------------------------
// 2. DUMMY DATA
// ----------------------------------------------------

const COMMON_TITLE = "My Custom Design";

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
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png",
  },
  {
    id: "o2",
    status: "In Transit",
    title: COMMON_TITLE,
    productType: "Comfort Hoodie",
    design: "Abstract Art",
    orderDate: "Nov 10, 2025",
    price: 54.99,
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg",
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

const DUMMY_SAVED_DESIGNS: Product[] = [
  {
    id: "s1",
    title: COMMON_TITLE,
    productType: "Premium Cotton T-Shirt",
    design: "Beach Sunset",
    savedDate: "Nov 20, 2025",
    price: 79.99,
    image:
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png",
  },
  {
    id: "s2",
    title: COMMON_TITLE,
    productType: "Comfort Hoodie",
    design: "Modern Logo",
    savedDate: "Nov 18, 2025",
    price: 49.99,
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg",
  },
];

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
    image: "https://nobero.com/cdn/shop/files/Go_through_front.jpg",
  },
  {
    id: "m3",
    title: COMMON_TITLE,
    productType: "Premium Cotton T-Shirt",
    design: "Floral Scroll",
    savedDate: "Sep 15, 2025",
    price: 50.0,
    image:
      "https://mms-images-prod.imgix.net/mms/images/catalog/6a62c76ef0978853a20391b6c32da4fe/colors/176100/views/alt/front_large_extended.png",
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
// 3. DELETE MODAL
// ----------------------------------------------------

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  version,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white shadow-2xl p-6 w-11/12 max-w-sm">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
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
            Are you sure you want to delete <strong>&quot;{title}&quot;</strong> (Version {version})?
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-[#E8E3DC]  py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. PRODUCT CARD
// ----------------------------------------------------

const ProductCard = ({ product, tabType, onDelete }: ProductCardProps) => {
  const isOrdered = tabType === "ordered";
  const isSaved = tabType === "saved";
  const isMy = tabType === "my";

  const statusColor =
    product.status === "Delivered" ? "bg-yellow-600" : "bg-orange-600";

  const dateLabel = isOrdered ? "Order Date:" : "Created Date:";
  const dateValue = product.orderDate || product.savedDate;

  return (
    <div className=" border-2 border-[#E8E3DC] bg-white hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-3/2 overflow-hidden ">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          className="w-full h-full object-cover"
          alt={product.title}
        // Using a standard <img> tag for external URLs 
        />

        {isOrdered && (
          <span
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white ${statusColor}`}
          >
            {product.status}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-1 truncate">{product.title}</h3>

        <p className="text-sm text-gray-500 mb-4">{product.productType}</p>

        <div className="grid grid-cols-2 text-sm gap-y-2">
          <span className="text-gray-500">Design:</span>
          <span className="font-medium text-right">{product.design}</span>

          <span className="text-gray-500">{dateLabel}</span>
          <span className="font-medium text-right">{dateValue}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8E3DC] flex justify-between items-center">
          <p className="text-lg font-bold text-gray-500">Price:</p>
          <p className="text-2xl text-indigo-600">€{product.price.toFixed(2)}</p>
        </div>

        {onDelete && (isSaved || isMy) && (
          <button
            onClick={() => onDelete(product.id, product.title)}
            className="mt-4 w-full text-red-600 py-2 border border-red-300 hover:bg-red-50 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4.5 CUSTOM DESIGN CARD (FOR AI DESIGNS)
// ----------------------------------------------------

const CustomDesignCard = ({
  version,
  productId,
  onDelete
}: {
  version: ICustomProductVersion,
  productId: number,
  onDelete?: (id: number, title: string, version: number) => void;
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = version.image_urls || [];

  // Auto-slide effect
  React.useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev: number) => (prev + 1) % images.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  const handleNext = () => {
    setCurrentIdx((prev: number) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev: number) => (prev - 1 + images.length) % images.length);
  };

  const formattedDate = new Date(version.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="border-2 border-[#E8E3DC] bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Image Slider */}
      <div className="relative aspect-3/2 overflow-hidden group">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentIdx]}
              className="w-full h-full object-cover transition-opacity duration-500"
              alt={`Version ${version.version} image ${currentIdx + 1}`}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIdx ? 'bg-[#D4AF37] scale-125' : 'bg-gray-400'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-semibold truncate flex-1">{version.product.name}</h3>
          <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-sm">
            V{version.version}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4">AI Generated Design</p>

        <div className="grid grid-cols-2 text-sm gap-y-2">
          <span className="text-gray-500">Created Date:</span>
          <span className="font-medium text-right">{formattedDate}</span>

          {/* <span className="text-gray-500">Season ID:</span>
          <span className="font-medium text-right truncate ml-2" title={version.custom_ai_product.toString()}>
            {version.custom_ai_product}
          </span> */}
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8E3DC] flex justify-between items-center">
          <p className="text-lg font-bold text-gray-500">Design Cost:</p>
          <p className="text-2xl text-indigo-600">€{(version.product.price)}</p>
          {/* <p className="text-2xl text-indigo-600">€{parseFloat(version.design_cost).toFixed(2)}</p> */}
        </div>

        {onDelete && (
          <button
            className="mt-4 w-full text-red-600 py-2 border border-red-300 hover:bg-red-50 transition"
            onClick={(e) => {
              e.preventDefault();
              onDelete(version.id, version.product.name, version.version);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4.6 ORDER CARD
// ----------------------------------------------------

const OrderCard = ({ order }: { order: IOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="border-2 border-[#E8E3DC] bg-white hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-[#E8E3DC] flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Order #{order.order_uid}</h3>
          <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
        </div>
        <span className={`text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {order.items.slice(0, isExpanded ? undefined : 2).map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="w-16 h-20 bg-gray-100 rounded shrink-0 flex items-center justify-center text-[10px] text-gray-400">
              Img
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{item.order_product_name}</h4>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[11px] text-gray-500 mt-0.5">{item.order_product_classification} · {item.order_product_size.join(', ')}</p>

                {/* Color Display */}
                {item.order_product_color_code && item.order_product_color_code.length > 0 && (
                  <div className="flex justify-between items-center mt-2 gap-2">
                    <span className="text-[11px] text-gray-600">Color: </span>
                    <div className="flex gap-1">
                      {item.order_product_color_code.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-gray-600">Qty: {item.quantity}</span>
                <span className="text-sm font-bold text-indigo-600">€{parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}

        {order.items.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-indigo-600 font-bold hover:underline"
          >
            {isExpanded ? 'Show less' : `+ ${order.items.length - 2} more items`}
          </button>
        )}
      </div>

      <div className="p-5 bg-gray-50 border-t border-[#E8E3DC] flex justify-between items-center">
        <div>
          <p className="text-[10px] text-gray-500">Shipping: €{order.shipping_cost.toFixed(2)}</p>
          <p className="text-xs font-bold text-gray-900 mt-1">Total Due</p>
        </div>
        <p className="text-2xl font-bold text-[#a07d48]">€{order.total_cost.toFixed(2)}</p>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. EMPTY STATE
// ----------------------------------------------------

const EmptyCreationsState = ({
  onFindProduct,
  isLoading,
}: EmptyCreationsStateProps) => (
  <div className="mt-16 text-center max-w-lg mx-auto p-10">
    <div className="mx-auto h-28 w-28 mb-6">
      <Image
        src={emptyIcon}
        alt="No Creations Icon"
        className="w-full h-full object-contain opacity-90"
        priority
      />
    </div>

    <h2 className="text-xl font-bold mb-2">No Creations Yet</h2>

    <p className="text-md text-gray-500 mb-8">
      You haven&apos;t created any designs or ordered any products yet.
    </p>

    <button
      onClick={onFindProduct}
      disabled={isLoading}
      className={`px-8 py-3 bg-[#D4AF37] text-white font-bold flex items-center justify-center mx-auto ${isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#c9a632]"
        }`}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2"
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
              d="M4 12a8 8 0 018-8"
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
// 6. MAIN PAGE
// ----------------------------------------------------

export default function App() {
  // Initialize Next.js Router
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<"ordered" | "saved" | "my">("ordered");

  const [isLoading, setIsLoading] = useState(false);

  const [savedProducts, setSavedProducts] =
    useState<Product[]>(DUMMY_SAVED_DESIGNS);
  const [orderedProducts] = useState<Product[]>(DUMMY_ORDERED_PRODUCTS);
  const [myDesigns, setMyDesigns] =
    useState<Product[]>(DUMMY_MY_DESIGNS);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    id: string | null;
    title: string;
    version: number;
    tab: "saved" | "my" | null;
  }>({
    isOpen: false,
    id: null,
    title: "",
    version: 0,
    tab: null,
  });

  const [deleteDesignVersion] = useDeleteCustomProductVersionMutation();

  // Function now uses router.push for navigation
  const handleFindProduct = () => {
    setIsLoading(true);

    setTimeout(() => {
      // REAL NEXT.JS ROUTER NAVIGATION
      router.push("/pages/shop");
      setIsLoading(false);
    }, 1000);
  };

  const openDeleteModal = (
    id: string | number,
    title: string,
    tab: "saved" | "my",
    version?: number
  ) => {
    setModalState({ isOpen: true, id: id.toString(), title, tab, version: version || 0 });
  };

  const closeDeleteModal = () => {
    setModalState({ isOpen: false, id: null, title: "", version: 0, tab: null });
  };

  const confirmDeletion = () => {
    if (modalState.tab === "saved") {
      setSavedProducts((prev: Product[]) =>
        prev.filter((p: Product) => p.id !== modalState.id)
      );
    } else if (modalState.tab === "my") {
      if (modalState.id && !isNaN(Number(modalState.id))) {
        deleteDesignVersion(Number(modalState.id));
      } else {
        setMyDesigns((prev: Product[]) =>
          prev.filter((p: Product) => p.id !== modalState.id)
        );
      }
    }

    closeDeleteModal();
  };

  const renderContent = (
    list: Product[],
    tab: "ordered" | "saved" | "my"
  ) => {
    if (list.length === 0)
      return (
        <EmptyCreationsState
          onFindProduct={handleFindProduct}
          isLoading={isLoading}
        />
      );

    const deleteHandler =
      tab === "saved" || tab === "my"
        ? (id: string, title: string) =>
          openDeleteModal(id, title, tab)
        : undefined;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            tabType={tab}
            onDelete={deleteHandler}
          />
        ))}
      </div>
    );
  };

  const { data: customProductsData, isLoading: isAiProductsLoading } = useGetCustomProductsQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrdersQuery();

  const tabs = [
    { id: "ordered", label: "ORDERED PRODUCTS", count: ordersData?.count || 0 },
    // { id: "saved", label: "SAVED DESIGNS", count: savedProducts.length },
    { id: "my", label: "MY DESIGNS", count: customProductsData?.results.reduce((acc: number, p: any) => acc + p.versions.length, 0) || 0 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="pt-16 pb-12 text-center">
        <h1 className={`${cormorantItalic.className} text-4xl  text-gray-800`}>My Creations</h1>
        <p className="mt-2 px-2 text-md text-gray-500">
          Manage your orders and saved designs in one place.
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row md:justify-center md:space-x-6
          space-y-2 md:space-y-0 mb-10 bg-white p-3  border-2 border-[#E8E3DC]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full md:w-auto flex justify-center items-center space-x-2 py-3 px-4 transition-all ${activeTab === t.id
                ? "text-white bg-indigo-600"
                : "text-gray-600 bg-white"
                }`}
            >
              <span className="uppercase">{t.label}</span>
              <span
                className={`rounded-full px-2 text-xs font-bold ${activeTab === t.id
                  ? "bg-white text-indigo-600"
                  : "bg-gray-200"
                  }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pb-16">
          {activeTab === "ordered" && (
            isOrdersLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              (!ordersData || ordersData.results.length === 0) ? (
                <EmptyCreationsState
                  onFindProduct={handleFindProduct}
                  isLoading={isLoading}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {ordersData.results.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )
            )
          )}
          {activeTab === "saved" && renderContent(savedProducts, "saved")}
          {activeTab === "my" && (
            isAiProductsLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              (!customProductsData || customProductsData.results.length === 0) ? (
                <EmptyCreationsState
                  onFindProduct={handleFindProduct}
                  isLoading={isLoading}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {customProductsData.results.map((product) =>
                    product.versions.map((version) => (
                      <CustomDesignCard
                        key={version.id}
                        version={version}
                        productId={product.product}
                        onDelete={(id, title, version) => openDeleteModal(id, title, "my", version)}
                      />
                    ))
                  )}
                </div>
              )
            )
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeletion}
        title={modalState.title}
        version={modalState.version}
      />
    </div>
  );
}