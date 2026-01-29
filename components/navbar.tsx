"use client";
import React, { useState, useRef, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { Menu, X, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import thanderIcon from "../public/image/logo.png";
import searchIcon from "../public/image/Icon-2.svg";
import userIcon from "../public/image/Icon-1.svg";
import cartIcon from "../public/image/Icon.svg";
import EmptyCart from "./shoppingCard";

import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logout as logoutAction } from "@/app/store/slices/authSlice";
import { useLogoutMutation } from "@/app/store/slices/services/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Reusable Components ---

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium tracking-[1.8px] uppercase py-1 transition duration-300 ease-in-out cursor-pointer block ${isActive
          ? "text-[#795548] border-b-2 border-[#795548]"
          : "text-[#1a1a1a] hover:text-[#795548] hover:border-b-2 hover:border-[#795548]/50"
        }`}
    >
      {children}
    </Link>
  );
};

const IconImage = ({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) => (
  <button className="p-1 focus:outline-none" onClick={onClick} aria-label={alt}>
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className="w-5 h-5 md:w-6 md:h-6 object-contain text-[#1a1a1a] cursor-pointer transition duration-200 hover:opacity-75"
    />
  </button>
);

// --- Main Header Component ---
const Header: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector(selectAuth);
  const { refresh, isAuthenticated } = auth;

  const [logoutApi] = useLogoutMutation();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        isSearchOpen
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  // Toggle handlers
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleSearchClick = () => {
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
  };

  const handleNavLinkClick = () => setIsMenuOpen(false);

  // Inside your Header component (logot)
  const handleLogout = async () => {
    if (!refresh) {
      toast.error("No refresh token found. Logging out locally...");
      dispatch(logoutAction());
      router.push("/");
      return;
    }

    try {
      toast.loading("Logging out...");
      await logoutApi({ refresh }).unwrap();
      dispatch(logoutAction());
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (err: unknown) {
      console.error("Logout error:", err);
      toast.error("Failed to logout via API. Cleared session locally.");
      dispatch(logoutAction());
      router.push("/");
    }
  };


  return (
    <header className="sticky top-0 w-full bg-[rgba(255,255,255,0.95)] backdrop-blur-sm z-50 border-b border-gray-100 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-black text-center py-2 text-white text-[10px] sm:text-[12px] font-medium tracking-[2px] sm:tracking-[2.4px] uppercase">
        FREE SHIPPING ON ORDERS OVER €100 | AI-POWERED DESIGN STUDIO
      </div>

      {/* Main Navigation */}
      <div className="flex justify-between items-center h-[72px] md:h-[81px] max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 relative">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden text-[#1a1a1a] hover:text-[#795548] transition duration-200"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            <NavLink href="/" onClick={handleNavLinkClick}>HOME</NavLink>
            <NavLink href="/pages/my-creation" onClick={handleNavLinkClick}>MY CREATION</NavLink>
            <NavLink href="/pages/shop" onClick={handleNavLinkClick}>SHOP</NavLink>
            <NavLink href="/pages/save-products" onClick={handleNavLinkClick}>SAVED PRODUCTS</NavLink>
          </nav>
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            className="w-[90px] md:w-[150px] lg:w-[172px]"
            width={200}
            height={59}
            sizes="(max-width: 768px) 90px, 200px"
            alt="Thundra Logo"
            src={thanderIcon}
            priority
          />
        </div>

        {/* Right Section Icons */}
        <div className="flex items-center space-x-2 md:space-x-6 lg:space-x-10">
          <div className="hidden md:flex space-x-6 lg:space-x-10">
            <NavLink href="/pages/contact" onClick={handleNavLinkClick}>CONTACT</NavLink>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <IconImage src={userIcon} alt="User Account" onClick={toggleUserMenu} />
            <IconImage src={searchIcon} alt="Search" onClick={() => setIsSearchOpen(!isSearchOpen)} />
            <IconImage src={cartIcon} alt="Shopping Cart" onClick={toggleCart} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-screen opacity-100 border-t border-gray-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col py-4 px-6 space-y-3">
          <NavLink href="/" onClick={handleNavLinkClick}>HOME</NavLink>
          <NavLink href="/pages/my-creation" onClick={handleNavLinkClick}>MY CREATION</NavLink>
          <NavLink href="/pages/shop" onClick={handleNavLinkClick}>SHOP</NavLink>
          <NavLink href="/pages/save-products" onClick={handleNavLinkClick}>SAVED PRODUCTS</NavLink>
          <div className="w-full h-px bg-gray-200 my-2"></div>
          <NavLink href="/contact" onClick={handleNavLinkClick}>CONTACT</NavLink>
        </nav>
      </div>

      {/* User Dropdown */}
      <div
        ref={userMenuRef}
        className={`absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-md transition-all duration-300 ease-in-out ${isUserMenuOpen ? "opacity-100 max-h-40" : "opacity-0 max-h-0"
          }`}
        style={{ overflow: "hidden" }}
      >
        {isAuthenticated ? (
          <div
            onClick={handleLogout}
            className="py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-200"
          >
            Logout
          </div>
        ) : (
          <>
            <div className="py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-200">
              <Link href="/pages/login">Login</Link>
            </div>
            <div className="py-2 px-4 text-gray-700 cursor-pointer hover:bg-gray-200 transition duration-200">
              <Link href="/pages/createaccount">Sign Up</Link>
            </div>
          </>
        )}
      </div>

      {/* Search Input */}
      {isSearchOpen && (
        <div ref={searchInputRef} className="absolute right-0 top-[115px] md:top-[115px] w-[300px] bg-white shadow-md rounded-md flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full py-2 px-4 rounded-l-md border border-gray-300 focus:outline-none"
          />
          <button onClick={handleSearchClick} className="py-2 px-4 bg-[#795548] text-white rounded-r-md hover:bg-[#5d4037] focus:outline-none">
            <SearchIcon size={25} />
          </button>
        </div>
      )}

      {/* Shopping Cart */}
      {isCartOpen && <EmptyCart toggleCart={toggleCart} />}
    </header>
  );
};

export default Header;
