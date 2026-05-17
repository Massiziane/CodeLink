"use client";

import { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";

export function SignUpAlertModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // expose global trigger
    (window as any).openSignupModal = () => setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Sign up to continue
        </h2>

        <SignUp />
      </div>
    </div>
  );
}