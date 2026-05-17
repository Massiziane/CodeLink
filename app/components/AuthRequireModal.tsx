"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

type Props = {
  redirectUrl: string;
  title: string;
  message: string;
  backHref?: string;
  backLabel?: string;
};

export function AuthRequiredModal({
  redirectUrl,
  title,
  message,
  backHref = "/services",
  backLabel = "Continue browsing",
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Lock size={30} />
          </div>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-3 text-center text-gray-500">
          {message}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/sign-in?redirect_url=${redirectUrl}`}
            className="rounded-xl bg-orange-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-700"
          >
            Sign in
          </Link>

          <Link
            href={`/sign-up?redirect_url=${redirectUrl}`}
            className="rounded-xl border border-gray-300 px-5 py-3 text-center font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            Create account
          </Link>
        </div>

        <Link
          href={backHref}
          className="mt-5 block text-center text-sm text-gray-400 hover:text-gray-700"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}