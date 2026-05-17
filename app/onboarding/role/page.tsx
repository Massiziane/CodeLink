"use client";

import { useRouter } from "next/navigation";

export default function RolePage() {
  const router = useRouter();

  async function selectRole(role: "CLIENT" | "DEVELOPER") {
    await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    // 🔥 ROLE-BASED REDIRECT
    if (role === "CLIENT") {
      router.push("/services");
    } else {
      router.push("/developer");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">

        <h1 className="text-2xl font-bold">
          Choose your role
        </h1>

        <div className="flex gap-6">

          <button
            onClick={() => selectRole("CLIENT")}
            className="p-6 bg-white border rounded-xl hover:shadow transition"
          >
            I am a Client
          </button>

          <button
            onClick={() => selectRole("DEVELOPER")}
            className="p-6 bg-white border rounded-xl hover:shadow transition"
          >
            I am a Developer
          </button>

        </div>

      </div>
    </div>
  );
}