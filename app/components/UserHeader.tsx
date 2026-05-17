"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Image from "next/image";
import logoCodeLink from "@/public/logo_codelink.png";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();

  const isAdminRoute =
    pathname.startsWith("/admin");

  const { isSignedIn } = useUser();

  const [cartCount, setCartCount] =
    useState(0);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const response = await fetch(
          "/api/cart/count"
        );

        const data =
          await response.json();

        setCartCount(data.count ?? 0);
      } catch (error) {
        console.error(error);
      }
    }

    if (isSignedIn) {
      fetchCartCount();
    }
  }, [isSignedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center"
        >
          <Image
            src={logoCodeLink}
            alt="CodeLink Logo"
            className="h-11 w-auto transition hover:scale-105"
            priority
          />
        </Link>

        {/* NAV */}
        {!isAdminRoute && (
          <nav className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 text-sm font-medium md:flex">

            <Link
              href="/"
              className={`rounded-full px-4 py-2 transition ${
                pathname === "/"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:bg-white hover:text-orange-600"
              }`}
            >
              Accueil
            </Link>

            <Link
              href="/services"
              className={`rounded-full px-4 py-2 transition ${
                pathname.startsWith(
                  "/services"
                )
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:bg-white hover:text-orange-600"
              }`}
            >
              Services
            </Link>

          </nav>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {!isAdminRoute ? (
            <>
              {!isSignedIn ? (
                <div className="flex items-center gap-2">

                  <SignInButton mode="modal">
                    <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600">
                      Sign in
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md">
                      Sign up
                    </button>
                  </SignUpButton>

                </div>
              ) : (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-10 h-10",
                    },
                  }}
                />
              )}

              {/* CART */}
            <Link
              href="/cart"
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md"
            >
              <ShoppingCart className="size-5" />

              {cartCount > 0 && (
                <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            </>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft className="size-4" />
              Retour
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}