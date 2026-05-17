"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import logoCodeLink from "@/public/logo_codelink.png";
import { useUser } from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link href="/">
          <Image src={logoCodeLink} alt="Logo" className="h-10 w-auto" />
        </Link>

        {/* Nav */}
        {!isAdminRoute && (
          <div className="hidden md:flex gap-6 text-sm">
            <Link href="/">Accueil</Link>
            <Link href="/services">Services</Link>
          </div>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {!isAdminRoute ? (
            <>
              {!isSignedIn ? (
                <div className="flex gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm rounded-lg border">
                      Sign in
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-sm rounded-lg bg-black text-white">
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              ) : (
                <UserButton />
              )}

              <Link href="/cart">
                <ShoppingCart className="size-5" />
              </Link>
            </>
          ) : (
            <Link href="/">Retour</Link>
          )}
        </div>
      </div>
    </header>
  );
}