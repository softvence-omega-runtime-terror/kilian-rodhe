"use client";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectIsAuthenticated, selectRole } from "@/app/store/slices/authSlice";
import type { RootState } from "@/app/store/index";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wait for redux-persist to finish rehydrating from localStorage
  const rehydrated = useSelector(
    (state: RootState) =>
      (state.auth as unknown as { _persist?: { rehydrated: boolean } })._persist?.rehydrated ?? false
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);
  const router = useRouter();

  useEffect(() => {
    // Don't redirect until persist has finished loading from localStorage
    if (!rehydrated) return;

    if (!isAuthenticated || role !== "superuser") {
      router.replace("/pages/login");
    }
  }, [rehydrated, isAuthenticated, role, router]);

  // Show a blank loading screen while rehydrating — prevents false logout
  if (!rehydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#9810FA] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // After rehydration, block unauthorized users
  if (!isAuthenticated || role !== "superuser") {
    return null;
  }

  return (
    <div className="bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-col flex-1 lg:ml-64">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
