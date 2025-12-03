"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

// ==========================
// DEFINISI TYPE
// ==========================
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "pemasukan" | "pengeluaran" | "hutang" | "bayar_hutang";
  description: string;
  created_at: string;
}

// ==========================
// FORMAT RUPIAH
// ==========================
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

// ==========================
// HITUNG TOTAL BERDASARKAN TIPE
// ==========================
const getTotalByType = (transactions: Transaction[], type: Transaction["type"]) =>
  transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);

// ==========================
// HITUNG SISA HUTANG
// ==========================
const getOutstandingDebt = (transactions: Transaction[]) => {
  const totalHutang = getTotalByType(transactions, "hutang");
  const totalBayar = getTotalByType(transactions, "bayar_hutang");
  return totalHutang - totalBayar;
};

// ==========================
// MAIN COMPONENT
// ==========================
export default function TotalTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;

    if (!userId) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data as Transaction[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => await fetchData())();
  }, []);

  if (loading) return <p className="text-gray-400">Loading data...</p>;

  const totalPemasukan = getTotalByType(transactions, "pemasukan");
  const totalPengeluaran = getTotalByType(transactions, "pengeluaran");
  const totalHutang = getTotalByType(transactions, "hutang");
  const totalBayarHutang = getTotalByType(transactions, "bayar_hutang");
  const sisaHutang = getOutstandingDebt(transactions);

  const summaryCards = [
    {
      title: "Total Pemasukan",
      amount: totalPemasukan,
      icon: TrendingUp,
      color: "emerald",
      description: "Semua pendapatan yang masuk",
    },
    {
      title: "Total Pengeluaran",
      amount: totalPengeluaran,
      icon: TrendingDown,
      color: "red",
      description: "Semua biaya yang dikeluarkan",
    },
    {
      title: "Total Hutang",
      amount: totalHutang,
      icon: AlertCircle,
      color: "orange",
      description: "Total pinjaman yang diterima",
    },
    {
      title: "Total Bayar Hutang",
      amount: totalBayarHutang,
      icon: CheckCircle,
      color: "blue",
      description: "Total hutang yang sudah dibayar",
    },
  ];

  const colorClasses: Record<
    string,
    { text: string; bg: string; border: string; glow: string }
  > = {
    emerald: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "hover:shadow-emerald-500/20",
    },
    red: {
      text: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      glow: "hover:shadow-red-500/20",
    },
    orange: {
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      glow: "hover:shadow-orange-500/20",
    },
    blue: {
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "hover:shadow-blue-500/20",
    },
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Ringkasan Transaksi</h1>
        <p className="text-gray-400 text-lg">
          Statistik lengkap dari semua aktivitas keuangan Anda
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const colors = colorClasses[card.color];

          return (
            <Card
              key={index}
              className={`bg-gradient-to-br from-gray-900 to-gray-800 border ${colors.border} p-8 hover:scale-105 transition-all duration-300 hover:shadow-xl ${colors.glow}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`p-4 ${colors.bg} rounded-xl border ${colors.border}`}
                >
                  <Icon className={`h-8 w-8 ${colors.text}`} />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-400 text-sm">{card.title}</h3>
                <p className={`text-4xl font-bold ${colors.text}`}>
                  {formatCurrency(card.amount)}
                </p>
                <p className="text-gray-500 text-sm">{card.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sisa Hutang */}
      <Card className="bg-gradient-to-br from-orange-950/50 to-gray-900 border-orange-500/30 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <AlertCircle className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Sisa Hutang yang Belum Dibayar
              </h3>
            </div>

            <p className="text-5xl font-bold text-orange-400">
              {formatCurrency(sisaHutang)}
            </p>

            <p className="text-gray-400">
              Dari total {formatCurrency(totalHutang)} hutang, sudah dibayar{" "}
              {formatCurrency(totalBayarHutang)}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2 bg-gray-900/50 p-6 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Progress Pembayaran
              </span>
              <span className="text-white font-bold">
                {totalHutang > 0
                  ? Math.round((totalBayarHutang / totalHutang) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                style={{
                  width: `${
                    totalHutang > 0
                      ? (totalBayarHutang / totalHutang) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Jumlah Pemasukan",
            count: transactions.filter((t) => t.type === "pemasukan").length,
          },
          {
            label: "Jumlah Pengeluaran",
            count: transactions.filter((t) => t.type === "pengeluaran").length,
          },
          {
            label: "Transaksi Hutang",
            count: transactions.filter((t) => t.type === "hutang").length,
          },
          {
            label: "Pembayaran Hutang",
            count: transactions.filter((t) => t.type === "bayar_hutang").length,
          },
        ].map((item, idx) => (
          <Card key={idx} className="bg-gray-900/50 border-gray-800 p-4">
            <p className="text-gray-500 text-xs mb-1">{item.label}</p>
            <p className="text-white text-2xl font-bold">{item.count}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
