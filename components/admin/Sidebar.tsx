// "use client";
// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   Users,
//   Sparkles,
//   FileText,
//   Settings,
//   X,
//   LogOut,
//   Loader2,
// } from "lucide-react";
// import Image, { StaticImageData } from "next/image";
// import { useRouter } from "next/navigation";

// import logo from "@/public/image/admin/dashboard/logo.png";
// import discountCardIcon from "@/public/image/admin/Settings/Frame.svg"; // StaticImageData type


// type IconType =
//   | React.FC<React.SVGProps<SVGSVGElement>> // lucide-react icon
//   | StaticImageData; // imported image


// const navItems: { name: string; key: string; icon: IconType }[] = [
//   { name: "Dashboard", key: "dashboard", icon: LayoutDashboard },
//   { name: "Products", key: "products", icon: Package },
//   { name: "Orders", key: "orders", icon: ShoppingCart },
//   { name: "Customers", key: "customers", icon: Users },

//   // Custom Local Icon
//   { name: "Discount Codes", key: "discounts", icon: discountCardIcon },

//   { name: "Design Quality", key: "design", icon: Sparkles },
//   { name: "Content & CMS", key: "cms", icon: FileText },
//   { name: "Settings", key: "settings", icon: Settings },
// ];


// interface SidebarProps {
//   currentPage: string;
//   setPage: (page: string) => void;
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// const renderIcon = (Icon: IconType) => {
//   // If it's an imported image → StaticImageData
//   if (typeof Icon === "object" && "src" in Icon) {
//     return (
//       <Image
//         src={Icon}
//         alt="Nav Icon"
//         width={20}
//         height={20}
//         className="mr-3 h-5 w-5"
//       />
//     );
//   }

//   const LucideIcon = Icon as React.FC<React.SVGProps<SVGSVGElement>>;
//   return <LucideIcon className="mr-3 h-5 w-5" />;
// };


// const Sidebar: React.FC<SidebarProps> = ({
//   currentPage,
//   setPage,
//   isOpen,
//   toggleSidebar,
// }) => {
//   const [showLogoutPopup, setShowLogoutPopup] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const router = useRouter();

//   const handleLogout = () => {
//     setIsLoggingOut(true);

//     setTimeout(() => {
//       setShowLogoutPopup(false);
//       setIsLoggingOut(false);
//       router.push("/admin/signup");
//     }, 1800);
//   };

//   return (
//     <>
//       {/* Backdrop (Mobile) */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={toggleSidebar}
//       />

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-full w-64 bg-[#1A1410] text-white flex flex-col justify-between p-6 border-r border-stone-800 transform z-50 transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full"} 
//           lg:translate-x-0`}
//       >
//         {/* Logo + Close Button */}
//         <div>
//           <div className="flex items-center justify-between mb-10">
//             <Image
//               src={logo}
//               alt="logo"
//               height={30}
//               width={160}
//               className="flex self-center"
//             />
//             <button
//               onClick={toggleSidebar}
//               className="lg:hidden text-gray-300 hover:text-white"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="space-y-2">
//             {navItems.map((item) => {
//               const isCurrent = currentPage === item.key;

//               return (
//                 <button
//                   key={item.key}
//                   onClick={() => {
//                     setPage(item.key);
//                     toggleSidebar();
//                   }}
//                   className={`flex items-center rounded-lg px-2 py-3 w-full text-left text-sm font-medium transition-colors duration-200 ${
//                     isCurrent
//                       ? "bg-[#8B6F47] text-white"
//                       : "text-stone-300 hover:bg-stone-700 hover:text-white"
//                   }`}
//                 >
//                   {renderIcon(item.icon)}
//                   {item.name}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Logout Button */}
//         <div className="pt-6 border-t border-stone-800">
//           <button
//             onClick={() => setShowLogoutPopup(true)}
//             className="flex items-center text-stone-300 hover:text-white transition-colors w-full py-3"
//           >
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Logout Confirmation Popup */}
//       {showLogoutPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
//           <div className="bg-white rounded-xl p-6 shadow-lg w-80 animate-slideUp">
//             <h3 className="text-gray-800 text-lg font-semibold mb-3">
//               Confirm Logout
//             </h3>

//             <p className="text-gray-600 text-sm mb-5">
//               Are you sure you want to logout?
//             </p>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowLogoutPopup(false)}
//                 className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center"
//               >
//                 {isLoggingOut ? (
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 ) : (
//                   "Yes, Logout"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loader Overlay */}
//       {isLoggingOut && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[999] animate-fadeIn">
//           <div className="flex flex-col items-center gap-3">
//             <Loader2 className="w-8 h-8 text-white animate-spin" />
//             <p className="text-white text-sm font-medium">Logging out...</p>
//           </div>
//         </div>
//       )}

//       {/* Animations */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes slideUp {
//           from {
//             transform: translateY(10px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;


"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Sparkles,
  FileText,
  Settings,
  X,
  LogOut,
  Loader2,
} from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";

import logo from "@/public/image/admin/dashboard/logo.png";
import discountCardIcon from "@/public/image/admin/Settings/Frame.svg";

import {
  selectAuth,
  logout as logoutAction,
} from "@/app/store/slices/authSlice";
import { useLogoutMutation } from "@/app/store/slices/services/auth/authApi";

type IconType =
  | React.FC<React.SVGProps<SVGSVGElement>>
  | StaticImageData;

/** 🔑 ROUTE MAP (source of truth) */
const navItems: {
  name: string;
  href: string;
  icon: IconType;
}[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Discount Codes", href: "/admin/discounts", icon: discountCardIcon },
  { name: "Design Quality", href: "/admin/design", icon: Sparkles },
  { name: "Content & CMS", href: "/admin/cms", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const renderIcon = (Icon: IconType) => {
  if (typeof Icon === "object" && "src" in Icon) {
    return (
      <Image
        src={Icon}
        alt="Nav Icon"
        width={20}
        height={20}
        className="mr-3 h-5 w-5"
      />
    );
  }

  const LucideIcon = Icon as React.FC<React.SVGProps<SVGSVGElement>>;
  return <LucideIcon className="mr-3 h-5 w-5" />;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const auth = useSelector(selectAuth);
  const { refresh } = auth;

  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutPopup(false);

    if (!refresh) {
      toast.error("No refresh token found. Logging out locally...");
      dispatch(logoutAction());
      router.push("/admin/login");
      return;
    }

    try {
      toast.loading("Logging out...");
      await logoutApi({ refresh }).unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully!");
      router.push("/admin/signup");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout via API. Cleared session locally.");
      dispatch(logoutAction());
      router.push("/admin/signup");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop (Mobile) */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1A1410] text-white flex flex-col justify-between p-6 border-r border-stone-800 transform z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <Image
              src={logo}
              alt="logo"
              height={30}
              width={160}
              className="flex self-center"
            />
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={toggleSidebar}
                  className={`flex items-center rounded-lg px-2 py-3 w-full text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#8B6F47] text-white"
                      : "text-stone-300 hover:bg-stone-700 hover:text-white"
                  }`}
                >
                  {renderIcon(item.icon)}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-stone-800">
          <button
            onClick={() => setShowLogoutPopup(true)}
            className="flex items-center text-stone-300 hover:text-white transition-colors w-full py-3"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 animate-slideUp">
            <h3 className="text-gray-800 text-lg font-semibold mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center"
              >
                {isLoggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[999] animate-fadeIn">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-white text-sm font-medium">Logging out...</p>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;

