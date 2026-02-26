"use client";

import React from "react";
import Card from "./Card";

import dollerIcon from "@/public/image/admin/dashboard/doller.svg";
import shopIcon from "@/public/image/admin/dashboard/shop.svg";
import userIcon from "@/public/image/admin/dashboard/userIcon.svg";
import aiIcon from "@/public/image/admin/dashboard/ai.svg";
import RecentOrders from "./Recentorder";
import TopProducts from "./Topproducts";
import FooterAdmin from "./FooterAdmin";
import Title from "./Title";
import { useGetDashboardDataQuery } from "@/app/store/slices/services/adminService/adminDashboardApi";

const DashboardContent = () => {
  const { data, isLoading, error } = useGetDashboardDataQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 sm:p-8">
        <Title
          text="Dashboard Overview"
          paragraph="Welcome back! Here's what's happening with your store today."
        />
        <div className="grid grid-cols-1 w-full mb-6 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={dollerIcon}
            percent="+0.0%"
            total={data?.total_revenue || "0.00"}
            text="Total Revenue"
          />
          <Card
            icon={shopIcon}
            percent="+0.0%"
            total={data?.total_orders || 0}
            text="Orders"
          />
          <Card
            icon={userIcon}
            percent="+0.0%"
            total={data?.total_customers || 0}
            text="Customers"
          />
          <Card
            icon={aiIcon}
            percent="+0.0%"
            total={data?.ai_designs || 0}
            text="AI Designs"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <RecentOrders orders={data?.recent_orders} />
          </div>
          <div>
            <TopProducts products={data?.top_products} />
          </div>
        </div>
      </div>

      <div>
        <FooterAdmin />
      </div>
    </div>
  );
};

export default DashboardContent;
