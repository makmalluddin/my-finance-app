"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Home, Plus, Filter, LogOut, DollarSign } from "lucide-react";
import React from "react";
import logoNoBG from "@/app/component/logoWhitenb.png"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: DollarSign, label: "Total Transaksi", path: "/dashboard/total-transactions" },
    { icon: Plus, label: "Tambah Transaksi", path: "/dashboard/add-transaction" },
    { icon: Filter, label: "Filter Transaksi", path: "/dashboard/filter-transactions" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-1">
              <Image
                src={logoNoBG}
                width={80}
                height={80}
                alt="Logo"
                className="object-contain"
              />
              <span className="text-lg font-semibold text-white">
                Finance App
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="inline h-4 w-4 mr-2" />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 min-h-screen border-r border-gray-800 bg-gray-900/50 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-50">
        <div className="flex justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 py-3 px-4 transition-colors ${
                  isActive ? "text-emerald-400" : "text-gray-400"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
