// "use client";
// import React, { useState } from "react";

// import Sidebar from "@/components/admin/Sidebar";
// import DashboardContent from "@/components/admin/DashboardContent";
// import Topbar from "@/components/admin/Topbar";
// import Products from "@/components/admin/Products";
// import Order from "@/components/admin/Order";
// import Customers from "@/components/admin/Customers";
// import DesinQuality from "@/components/admin/DesignQuality";
// import Settings from "@/components/admin/Settings";
// import CMS from "@/components/admin/CMS";
// import Discount from "@/components/admin/Discount";


// // --- Main Layout ---
// const DashboardLayout = () => {
//   const [currentPage, setCurrentPage] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   const renderContent = () => {
//     switch (currentPage) {
//       case "dashboard":
//         return <DashboardContent />;
//       case "products":
//         return <Products />;
//       case "orders":
//         return <Order />;
//       case "customers":
//         return <Customers />;
//       case "design":
//         return <DesinQuality />;
//       case "discounts":
//         return <Discount />;
//       case "cms":
//         return <CMS />;
//       case "settings":
//         return <Settings />;
//       default:
//         return <DashboardContent />;
//     }
//   };

//   return (
//     <div className=" font-arial bg-gray-50 flex font-sans">
//       {/* Sidebar */}
//       <Sidebar
//         currentPage={currentPage}
//         setPage={setCurrentPage}
//         isOpen={sidebarOpen}
//         toggleSidebar={toggleSidebar}
//       />

//       {/* Main Section */}
//       <div className="flex flex-col flex-1 lg:ml-64">
//         <Topbar toggleSidebar={toggleSidebar} />
//         <main>{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import DashboardContent from "@/components/admin/DashboardContent";

export default function AdminDashboardPage() {
  return <DashboardContent />;
}

