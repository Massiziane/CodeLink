"use client";

import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/header";

import { Card, CardContent } from "@/app/components/ui/card";

export default function Home() {
  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-950 px-6">

        <Card className="w-full max-w-md p-10 flex flex-col items-center text-center">

          <CardContent className="flex flex-col items-center text-center">

            {/* LOGO */}
            <Image
              src="/logo_codelink_txt.png"
              alt="CodeLink Logo"
              width={200}
              height={200}
              className="mb-6"
              priority
            />

            {/* TITLE */}
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              CodeLink Cart Test Environment
            </h1>

            {/* DESCRIPTION */}
            <p className="text-zinc-500 mt-3 text-sm leading-relaxed">
              Test cart features, tax calculations (TPS/TVQ), and checkout flow in a controlled environment.
            </p>

            {/* CTA */}
            <div className="mt-8 w-full flex flex-col gap-3">

              <Link
                href="/cart"
                className="flex items-center justify-center w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-zinc-800 transition"
              >
                Go to Cart Test →
              </Link>

              <p className="text-xs text-zinc-400">
                http://localhost:3000/cart
              </p>

            </div>

          </CardContent>
        </Card>

      </div>
    </>
  );
}