"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock } from "lucide-react";

type Props = {
  serviceId: string;
  children: React.ReactNode;
};

export function ServiceAuthCard({
  serviceId,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-left"
      >
        {children}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* ICON */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <Lock size={30} />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Please sign in
            </h2>

            {/* TEXT */}
            <p className="mt-3 text-center text-gray-500">
              You need an account to access this service
              and continue further.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3">

              <Link
                href={`/sign-in?redirect_url=/services/${serviceId}`}
                className="rounded-xl bg-orange-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-orange-700"
              >
                Sign in
              </Link>

              <Link
                href={`/sign-up?redirect_url=/services/${serviceId}`}
                className="rounded-xl border border-gray-300 px-5 py-3 text-center font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Create account
              </Link>

            </div>

            {/* CANCEL */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full text-sm text-gray-400 hover:text-gray-700"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </>
  );
}