"use client";

import React from "react";

export interface RecentOrder {
  order_uid: string;
  customer_name: string;
  product_name: string;
  status: string;
  total_paid: string;
  created_at: string;
}

interface RecentOrdersProps {
  orders?: RecentOrder[];
}

export default function RecentOrders({ orders = [] }: RecentOrdersProps) {
  return (
    <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>

      <div className="divide-y divide-gray-200">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="flex justify-between items-center py-4">
              <div>
                <p className="font-medium text-gray-800">{order.order_uid}</p>
                <p className="text-gray-600">{order.customer_name}</p>
                <p className="text-gray-500 text-sm">{order.product_name}</p>
              </div>

              <div className="text-right">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }`}
                >
                  {order.status}
                </div>
                <p className="mt-2 font-medium text-gray-800">
                  €{parseFloat(order.total_paid).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-gray-500 text-center">No recent orders found.</p>
        )}
      </div>
    </div>
  );
}
