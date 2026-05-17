"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  ShoppingBag,
  User,
  ArrowLeft,
} from "lucide-react";

const mainNav = [
    { href: "/developer", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
    { href: "/developer/services", label: "Mes services", icon: Package, exact: false },
    { href: "/developer/services/new", label: "Créer un service", icon: Plus, exact: true },

];

const disabledNav = [
    { label: "Commandes", icon: ShoppingBag },
    { label: "Profil", icon: User },
];


export function DeveloperSidebar() {
    const pathname = usePathname();

    function isActive(href: string, exact: boolean) {
        return exact ? pathname === href : pathname.startsWith(href) && pathname !== "/developer/services/new";
    }

    return (
        <aside className="w-64 shrink-0 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col px-3 py-6">

            {/* TITLE */}
            <div className="mb-6 px-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Espace développeur
            </p>
            </div>

            {/* MAIN NAV */}
            <nav className="flex flex-col gap-1">
            {mainNav.map(({ href, label, icon: Icon, exact }) => (
                <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(href, exact)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                >
                <Icon className="size-4 shrink-0" />
                {label}
                </Link>
            ))}
            </nav>

            {/* DISABLED (futurs) */}
            <div className="mt-4 flex flex-col gap-1 border-t border-gray-100 pt-4">
            {disabledNav.map(({ label, icon: Icon }) => (
                <div
                key={label}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed"
                >
                <Icon className="size-4 shrink-0" />
                {label}
                <span className="ml-auto text-xs text-gray-300">Bientôt</span>
                </div>
            ))}
            </div>

            {/* BACK TO CATALOGUE */}
            <div className="mt-auto border-t border-gray-100 pt-4">
            <Link
                href="/services"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="size-4 shrink-0" />
                Retour catalogue
            </Link>
            </div>

        </div>
        </aside>
    );
}