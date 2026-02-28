"use client";
import React, { useEffect, useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import ProductDetailScreen from "@/components/admin/ProductDetailsScreen";
import EditProduct from "@/components/admin/products/updateProduct/EditProduct";
import Footer from "@/components/admin/FooterAdmin";
import Title from "@/components/admin/Title";
import { useGetAllProductsQuery } from "@/app/store/slices/services/adminService/products/productsApi";
import AddNewProductScreen from "./createProducts/AddProductSection";
import { toast } from "sonner";
import { useDeleteProductMutation } from "@/app/store/slices/services/adminService/products/productsApi";


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
    className="flex items-center px-6 cursor-pointer bg-[#8B6F47] text-white font-semibold rounded-xl hover:bg-[#A08169] transition duration-200 shadow-md"
  >
    <Plus className="w-5 h-5 mr-2" />
    Add Product
  </button>
);

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status }: { status: "Active" | "Out of Stock" }) => (
  <span
    className={`px-3 py-1 rounded-lg text-xs font-semibold ${status === "Active"
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


  // ... (inside App)

  const { data } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  console.log(data, "all prods data")

  useEffect(() => {
    const d: any = data;
    const productsList = Array.isArray(d?.data)
      ? d.data
      : (d?.data?.categories || d?.data?.products || d?.categories || d?.products || d?.results?.categories || d?.results?.products || []);

    if (productsList && productsList.length > 0) {
      const mapped: Product[] = productsList.map((p: any) => {
        const categoryTitle = typeof p.category === 'object' && p.category?.title ? p.category.title : 'Unknown';
        const ageRangeLabel = typeof p.age_range === 'object' && p.age_range?.start
          ? `Age ${p.age_range.start}-${p.age_range.end}`
          : 'All Ages';

        return {
          id: p.id,
          name: p.name,
          category: categoryTitle,
          ageGroup: ageRangeLabel,
          price: `€${p.price ?? p.price}`,
          stock: p.stock_quantity,
          sales: p.total_sold ?? 0,
          status: p.stock_quantity > 0 ? "Active" : "Out of Stock",
        };
      });
      setProductData(mapped);
    } else {
      setProductData([]);
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
          onDeleteProduct={async (id) => {
            if (confirm("Are you sure you want to delete this product?")) {
              try {
                await deleteProduct(id).unwrap();
                toast.success("Product deleted successfully");
              } catch (err: unknown) {
                console.error("Delete error:", err);
                toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to delete product");
              }
            }
          }}
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
