"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, ShoppingBag } from "lucide-react";

export default function RolePage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<"CLIENT" | "DEVELOPER" | null>(
    null
  );

    async function selectRole(role: "CLIENT" | "DEVELOPER") {
    try {
        setLoadingRole(role);

        const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
        });

        if (!response.ok) {
        const errorText = await response.text();
        console.error("Role update failed:", errorText);
        alert("Could not update role");
        return;
        }

        router.push(role === "CLIENT" ? "/services" : "/developer");
        router.refresh();
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    } finally {
        setLoadingRole(null);
    }
    }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-10">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            CodeLink
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Choose your path
          </h1>
          <p className="mt-4 text-gray-400">
            You can continue as a client or start publishing services as a
            developer.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-2">
          <button
            type="button"
            onClick={() => selectRole("CLIENT")}
            disabled={loadingRole !== null}
            className="group rounded-3xl border border-white/10 bg-white p-8 text-left text-gray-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-950 text-white">
              <ShoppingBag size={28} />
            </div>

            <h2 className="text-3xl font-bold">Client</h2>

            <p className="mt-4 text-gray-600">
              Browse services, hire developers, and manage your orders.
            </p>

            <div className="mt-8 rounded-xl bg-gray-950 px-5 py-3 text-center font-semibold text-white">
              {loadingRole === "CLIENT" ? "Loading..." : "Continue as Client"}
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectRole("DEVELOPER")}
            disabled={loadingRole !== null}
            className="group rounded-3xl border border-blue-500/30 bg-blue-600 p-8 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl disabled:opacity-60"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600">
              <Code2 size={28} />
            </div>

            <h2 className="text-3xl font-bold">Developer</h2>

            <p className="mt-4 text-blue-100">
              Publish services, manage projects, and grow your business.
            </p>

            <div className="mt-8 rounded-xl bg-white px-5 py-3 text-center font-semibold text-blue-600">
              {loadingRole === "DEVELOPER"
                ? "Updating..."
                : "Continue as Developer"}
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}