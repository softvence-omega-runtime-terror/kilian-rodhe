// import React, { useState } from "react";
// import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";

// import AddNewProductScreen from "@/components/admin/AddprofuctSection";
// import ProductDetailScreen from "./ProductDetailsScreen";
// import EditProduct from "./EditProduct";
// import Footer from "./FooterAdmin";
// import Title from "./Title";
// import { useGetAllProductsQuery } from "@/app/store/slices/services/adminService/products/productsApi";

// // --- New Type Definitions ---
// type ViewType = "list" | "add" | "view" | "edit";
// // Update the ViewChange handler to accept ViewType and optional ID
// type ViewChangeHandler = (view: ViewType, id?: number) => void;

// // Add Product Button
// const Button = ({ onClick }: { onClick: () => void }) => (
//   <button
//     onClick={onClick}
//     className="flex items-center px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md"
//   >
//     <Plus className="w-5 h-5 mr-2" />
//     Add Product
//   </button>
// );

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   ageGroup: string;
//   price: string;
//   stock: number;
//   sales: number;
//   status: "Active" | "Out of Stock";
// }

// const initialProductData: Product[] = [
//   {
//     id: 1,
//     name: "Premium Custom T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Adults (18-35)",
//     price: "€34.99",
//     stock: 156,
//     sales: 234,
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "Kids AI Design T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Kids (5-12)",
//     price: "€29.99",
//     stock: 89,
//     sales: 145,
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "Premium Custom Hoodie",
//     category: "Hoodies",
//     ageGroup: "Adults (18-35)",
//     price: "€54.99",
//     stock: 67,
//     sales: 89,
//     status: "Active",
//   },
//   {
//     id: 4,
//     name: "Custom Letter Cap",
//     category: "Caps",
//     ageGroup: "All Ages",
//     price: "€24.99",
//     stock: 234,
//     sales: 178,
//     status: "Active",
//   },
//   {
//     id: 5,
//     name: "AI Design Mug",
//     category: "Mugs",
//     ageGroup: "Adults (18+)",
//     price: "€19.99",
//     stock: 312,
//     sales: 456,
//     status: "Active",
//   },
//   {
//     id: 6,
//     name: "Women's Premium T-Shirt",
//     category: "T-Shirts",
//     ageGroup: "Women (18-45)",
//     price: "€34.99",
//     stock: 0,
//     sales: 267,
//     status: "Out of Stock",
//   },
// ];

// // Helper component for the status badge
// const StatusBadge = ({ status }: { status: "Active" | "Out of Stock" }) => {
//   const isActive = status === "Active";
//   return (
//     <span
//       className={`px-3 py-1 rounded-lg text-xs font-semibold ${
//         isActive ? "bg-[#dcfce7] text-[#008236]" : "bg-[#d4183d] text-white"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// const HighlightText = ({
//   text,
//   highlight,
// }: {
//   text: string;
//   highlight: string;
// }) => {
//   if (!highlight.trim()) {
//     return <>{text}</>;
//   }

//   const regex = new RegExp(
//     `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
//     "gi"
//   );
//   const parts = text.split(regex);

//   return (
//     <>
//       {parts.map((part, index) =>
//         regex.test(part) ? (
//           <span
//             key={index}
//             className="bg-yellow-200 font-semibold rounded px-0.5"
//           >
//             {part}
//           </span>
//         ) : (
//           <span key={index}>{part}</span>
//         )
//       )}
//     </>
//   );
// };

// // Main Table Component
// const ProductTable = ({
//   data,
//   onViewProduct,
//   onEditProduct,
//   onDeleteProduct,
//   searchTerm, // Added prop for search term
// }: {
//   data: Product[];
//   onViewProduct: (id: number) => void;
//   onEditProduct: (id: number) => void;
//   onDeleteProduct: (id: number) => void;
//   searchTerm: string; // Added prop for search term
// }) => (
//   <div className="bg-white rounded-xl border border-[#e8e3dc] overflow-x-auto">
//     <table className="min-w-full divide-y divide-gray-200">
//       <thead className="bg-gray-50">
//         <tr>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Product Name
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Category
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Age Group
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Price
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Stock
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Sales
//           </th>
//           <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Status
//           </th>
//           <th className="px-6 py-3 text-right text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
//             Actions
//           </th>
//         </tr>
//       </thead>
//       <tbody className="bg-white divide-y divide-gray-200">
//         {data.map((product) => (
//           <tr
//             key={product.id}
//             className="hover:bg-gray-50 transition duration-150"
//           >
//             <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
//               <HighlightText text={product.name} highlight={searchTerm} />
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
//               <HighlightText text={product.category} highlight={searchTerm} />
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
//               <HighlightText text={product.ageGroup} highlight={searchTerm} />
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-800">
//               <HighlightText text={product.price} highlight={searchTerm} />
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
//               {product.stock}
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
//               {product.sales}
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
//               <StatusBadge status={product.status} />
//             </td>
//             <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
//               <div className="flex justify-end space-x-4">
//                 {/* View Button (Icon + Text) */}
//                 <button
//                   onClick={() => onViewProduct(product.id)}
//                   className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
//                   title="View Details"
//                 >
//                   <Eye className="w-4 h-4" />
//                   <span>View</span>
//                 </button>
//                 {/* Edit Button (Icon + Text) */}
//                 <button
//                   onClick={() => onEditProduct(product.id)}
//                   // The image shows a darker blue for Edit, and a trash icon for delete.
//                   className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
//                   title="Edit Product"
//                 >
//                   <Edit className="w-4 h-4" />
//                   <span>Edit</span>
//                 </button>
//                 {/* Delete Button (Icon Only) */}
//                 <button
//                   onClick={() => onDeleteProduct(product.id)}
//                   className="text-red-500 hover:text-red-700 p-1" // Added padding to separate it slightly
//                   title="Delete Product"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     {data.length === 0 && (
//       <div className="text-center py-10 text-gray-500">
//         No products found matching your criteria.
//       </div>
//     )}
//   </div>
// );
// // --- Product List Screen ---
// const ProductListScreen = ({
//   onViewChange,
//   onDeleteProduct, // New prop
//   productData,
// }: {
//   onViewChange: ViewChangeHandler;
//   onDeleteProduct: (id: number) => void;
//   productData: Product[];
// }) => {
//   // --- State for Filtering ---
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Age Groups");
//   // ---

//   const handleViewProduct = (id: number) => {
//     onViewChange("view", id);
//   };

//   const handleEditProduct = (id: number) => {
//     onViewChange("edit", id); // Navigate to the 'edit' screen
//   };

//   // Logic to filter the product data
//   const filteredProducts = productData.filter((product) => {
//     const searchLower = searchTerm.toLowerCase().trim();

//     // 1. Search Term Filter (checks name, category, ageGroup, and price)
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchLower) ||
//       product.category.toLowerCase().includes(searchLower) ||
//       product.ageGroup.toLowerCase().includes(searchLower) ||
//       product.price.toLowerCase().includes(searchLower);

//     // 2. Category Filter
//     const matchesCategory =
//       selectedCategory === "All Categories" ||
//       product.category === selectedCategory;

//     // 3. Age Group Filter
//     const matchesAgeGroup =
//       selectedAgeGroup === "All Age Groups" ||
//       product.ageGroup === selectedAgeGroup;

//     return matchesSearch && matchesCategory && matchesAgeGroup;
//   });

//   // Get unique categories and age groups for dropdowns
//   const uniqueCategories = [
//     "All Categories",
//     ...Array.from(new Set(initialProductData.map((p) => p.category))),
//   ];
//   const uniqueAgeGroups = [
//     "All Age Groups",
//     ...Array.from(new Set(initialProductData.map((p) => p.ageGroup))),
//   ];

//   return (
//     <div className=" px-4 sm:p-10 w-full bg-gray-50">
//       <div className="flex flex-col sm:flex-row items-center justify-between  sm:space-y-0 mb-6">
//         <Title
//           text="Products Management"
//           paragraph="Manage your product catalog and inventory"
//         />
//         <Button onClick={() => onViewChange("add")} />
//       </div>

//       {/* Search and Filters Section (Implemented functionality) */}
//       <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#e8e3dc] mb-6">
//         <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
//           {/* Search Input */}
//           <div className="relative flex-grow w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)} // **WORKING SEARCH**
//               className="w-full px-10 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-800 placeholder-gray-500 focus:outline-none transition duration-200"
//             />
//           </div>

//           {/* All Categories Dropdown */}
//           <div className="relative w-full md:w-auto md:min-w-[180px]">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)} // **WORKING FILTER**
//               className="w-full px-4 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-700 focus:outline-none  transition duration-200 appearance-none pr-10"
//               style={{
//                 // Custom arrow icon for the select box
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 0.75rem center",
//                 backgroundSize: "1.25rem 1.25rem",
//               }}
//             >
//               {uniqueCategories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* All Age Groups Dropdown */}
//           <div className="relative w-full md:w-auto md:min-w-[180px]">
//             <select
//               value={selectedAgeGroup}
//               onChange={(e) => setSelectedAgeGroup(e.target.value)} // **WORKING FILTER**
//               className="w-full px-4 py-2 border border-[#e8e3dc] rounded-xl bg-neutral-100 text-gray-700 focus:outline-none transition duration-200 appearance-none pr-10"
//               style={{
//                 // Custom arrow icon for the select box
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "right 0.75rem center",
//                 backgroundSize: "1.25rem 1.25rem",
//               }}
//             >
//               {uniqueAgeGroups.map((age) => (
//                 <option key={age} value={age}>
//                   {age}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//       {/* --- END: Search and Filters Section --- */}

//       {/* Product Table */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
//         <div className="md:col-span-2">
//           <ProductTable
//             data={filteredProducts} // Use filtered data
//             onViewProduct={handleViewProduct}
//             onEditProduct={handleEditProduct} // Pass handler
//             onDeleteProduct={onDeleteProduct} // Pass handler
//             searchTerm={searchTerm} // Pass search term for highlighting
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---
// const App = () => {
//   // Use state to manage the product data
//   const [productData, setProductData] = useState<Product[]>(initialProductData);
//   // Use state to manage the current view (list, add, view, edit)
//   const [view, setView] = useState<ViewType>("list");
//   // State to track the ID of the product being viewed or edited
//   const [currentProductId, setCurrentProductId] = useState<number>(0);
//   const { data, isLoading, isError } = useGetAllProductsQuery();
//   console.log(data,)


//   const handleViewChange: ViewChangeHandler = (newView, id = 0) => {
//     setCurrentProductId(id);
//     setView(newView);
//   };

//   // New function to handle product deletion
//   const handleDeleteProduct = (id: number) => {
//     const isConfirmed = window.confirm(
//       `Are you sure you want to delete product ID: ${id}?`
//     );
//     if (isConfirmed) {
//       setProductData((prevData) =>
//         prevData.filter((product) => product.id !== id)
//       );
//       alert(`Product ID ${id} deleted successfully.`);
//       // If the user was viewing or editing this product, redirect them to the list
//       if (view !== "list" && currentProductId === id) {
//         handleViewChange("list");
//       }
//     }
//   };

//   return (
//     <div className="lg:px-0  bg-gray-50">
//       {view === "list" && (
//         <ProductListScreen
//           onViewChange={handleViewChange}
//           onDeleteProduct={handleDeleteProduct}
//           productData={productData} // Pass dynamic data
//         />
//       )}
//       {view === "add" && (
//         <AddNewProductScreen
//           // FIX 1: Wrap to satisfy the component's expected signature (view: string) => void
//           onViewChange={(newView: string) =>
//             handleViewChange(newView as ViewType)
//           }
//         />
//       )}
//       {view === "view" && currentProductId > 0 && (
//         <ProductDetailScreen
//           // FIX 1: Wrap to satisfy the component's expected signature (view: string) => void
//           onViewChange={(newView: string) =>
//             handleViewChange(newView as ViewType)
//           }
//           // FIX 2: This line requires ProductDetailScreen.tsx to accept 'productId: number'
//           productId={currentProductId}
//         />
//       )}
//       {view === "edit" &&
//         currentProductId > 0 && ( // Renders the edit screen
//           <EditProduct
//             // FIX 1: Wrap to satisfy the component's expected signature (view: string) => void
//             onViewChange={(newView: string) =>
//               handleViewChange(newView as ViewType)
//             }
//             // FIX 2: This line requires EditProduct.tsx to accept 'productId: number'
//           />
//         )}

//       <div className="mt-6 relative -bottom-17">
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default App;































"use client";
import React, { useEffect, useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import ProductDetailScreen from "@/components/admin/ProductDetailsScreen";
import EditProduct from "@/components/admin/EditProduct";
import Footer from "@/components/admin/FooterAdmin";
import Title from "@/components/admin/Title";
import { useGetAllProductsQuery } from "@/app/store/slices/services/adminService/products/productsApi";
import AddNewProductScreen from "./createProducts/AddprofuctSection";

/* ================= TYPES ================= */

export type ViewType = "list" | "add" | "view" | "edit";
export type ViewChangeHandler = (view: ViewType, id?: number) => void;

interface Product {
  id: number;
  name: string;
  category: string;
  ageGroup: string;
  price: string;
  stock: number;
  sales: number;
  status: "Active" | "Out of Stock";
}

/* ================= BUTTON ================= */

const Button = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center px-6 py-2 bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md"
  >
    <Plus className="w-5 h-5 mr-2" />
    Add Product
  </button>
);

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }: { status: "Active" | "Out of Stock" }) => (
  <span
    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
      status === "Active"
        ? "bg-[#dcfce7] text-[#008236]"
        : "bg-[#d4183d] text-white"
    }`}
  >
    {status}
  </span>
);

/* ================= PRODUCT TABLE ================= */

const ProductTable = ({
  data,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}: {
  data: Product[];
  onViewProduct: (id: number) => void;
  onEditProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
}) => (
  <div className="bg-white rounded-xl border border-[#e8e3dc] overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Product Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Age Group
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Sales
          </th>
          <th className="px-6 py-3 text-left text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs font-bold font-sans text-[#1a1410] text-[14px] uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((product) => (
          <tr
            key={product.id}
            className="hover:bg-gray-50 transition duration-150"
          >
            <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
              {product.name}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
              {product.category}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
              {product.ageGroup}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-800">
              {product.price}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
              {product.stock}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
              {product.sales}
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
              <StatusBadge status={product.status} />
            </td>
            <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => onViewProduct(product.id)}
                  className="text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditProduct(product.id)}
                  className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700 p-1"
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
        No products found.
      </div>
    )}
  </div>
);

/* ================= PRODUCT LIST SCREEN ================= */

const ProductListScreen = ({
  onViewChange,
  onDeleteProduct,
  productData,
}: {
  onViewChange: ViewChangeHandler;
  onDeleteProduct: (id: number) => void;
  productData: Product[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("All Age Groups");

  const filteredProducts = productData.filter((p) => {
    const s = searchTerm.toLowerCase();
    return (
      (p.name + p.category + p.ageGroup + p.price)
        .toLowerCase()
        .includes(s) &&
      (selectedCategory === "All Categories" || p.category === selectedCategory) &&
      (selectedAgeGroup === "All Age Groups" || p.ageGroup === selectedAgeGroup)
    );
  });

  const uniqueCategories = ["All Categories", ...new Set(productData.map((p) => p.category))];
  const uniqueAgeGroups = ["All Age Groups", ...new Set(productData.map((p) => p.ageGroup))];

  return (
    <div className="px-4 sm:p-10 bg-gray-50">
      <div className="flex justify-between mb-6">
        <Title text="Products Management" paragraph="Manage your product catalog and inventory" />
        <Button onClick={() => onViewChange("add")} />
      </div>

      <div className="bg-white p-6 rounded-2xl mb-6">
        <input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-xl"
        />

        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            {uniqueCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="px-4 py-2 border rounded-xl"
          >
            {uniqueAgeGroups.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <ProductTable
        data={filteredProducts}
        onViewProduct={(id) => onViewChange("view", id)}
        onEditProduct={(id) => onViewChange("edit", id)}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
};

// main compo...
const App = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [view, setView] = useState<ViewType>("list");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { data } = useGetAllProductsQuery();
  console.log(data, "all prods data")

  useEffect(() => {
    if (data?.data?.categories) {
      const mapped: Product[] = data.data.categories.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category.title,
        ageGroup: `Age ${p.age_range?.start}-${p.age_range?.end}`,
        price: `€${p.price ?? p.price}`,
        stock: p.stock_quantity,
        sales: p.total_sold ?? 0,
        status: p.stock_quantity > 0 ? "Active" : "Out of Stock",
      }));
      setProductData(mapped);
    }
  }, [data]);

  const handleViewChange: ViewChangeHandler = (v, id) => {
    if ((v === "view" || v === "edit") && id) setSelectedProductId(id);
    setView(v);
  };

  return (
    <>
      {view === "list" && (
        <ProductListScreen
          productData={productData}
          onDeleteProduct={(id) =>
            setProductData((prev) => prev.filter((p) => p.id !== id))
          }
          onViewChange={handleViewChange}
        />
      )}

      {view === "add" && <AddNewProductScreen onViewChange={handleViewChange} />}

      {view === "edit" && selectedProductId && (
        <EditProduct productId={selectedProductId} onViewChange={handleViewChange} />
      )}

      {view === "view" && selectedProductId && (
        <ProductDetailScreen productId={selectedProductId} onViewChange={handleViewChange} />
      )}

      <Footer />
    </>
  );
};

export default App;
