"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { selectIsAuthenticated } from "../store/slices/authSlice";

export const useAuthCheck = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const router = useRouter();

  /**
   * Call this function before any protected action.
   * If user is not logged in, it redirects to login and returns false.
   * Returns true if user is logged in.
   */
  const ensureAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/login"); // redirect to login
      return false;
    }
    return true;
  }, [isAuthenticated, router]);

  return { isAuthenticated, ensureAuth };
};
