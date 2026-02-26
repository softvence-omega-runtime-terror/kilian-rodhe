"use client";

import React from "react";

export interface TopProduct {
  order_product_name: string;
  total_sales: number;
  total_revenue: string;
}

interface TopProductsProps {
  products?: TopProduct[];
}

export default function TopProducts({ products = [] }: TopProductsProps) {
  return (
    <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>

      <div className="divide-y divide-gray-200">
        {products.length > 0 ? (
          products.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#7B614E] text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {item.order_product_name}
                  </p>
                  <p className="text-gray-500 text-sm">{item.total_sales} sales</p>
                </div>
              </div>

              <div className="text-right font-medium text-gray-800">
                €{parseFloat(item.total_revenue).toLocaleString()}
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-gray-500 text-center">No top products found.</p>
        )}
      </div>
    </div>
  );
}
