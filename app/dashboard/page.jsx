"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Wallet, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from "lucide-react";
import logoNoBG from "@/app/component/logoWhitenb.png"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    saldo: 0,
    pemasukan: 0,
    pengeluaran: 0,
    hutang: 0,
    bayarHutang: 0,
  });

  const [recent, setRecent] = useState([]);

  const fetchData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: summaryData } = await supabase.rpc("get_summary", {
      user_id_input: user.id,
    });

    if (summaryData && summaryData.length > 0) {
      const s = summaryData[0];
      setSummary({
        saldo: s.saldo ?? 0,
        pemasukan: s.pemasukan ?? 0,
        pengeluaran: s.pengeluaran ?? 0,
        hutang: s.hutang ?? 0,
        bayarHutang: s.bayarhutang ?? 0,
      });
    }

    const { data: recentData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentData) setRecent(recentData);

    setLoading(false);
  };

  useEffect(() => {
    (async () => await fetchData())();
  }, []);

  if (loading) return <p className="p-4 text-white">Loading...</p>;

  return (
    <div className="min-h-screen p-6 md:p-10 from-black via-neutral-950 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Image
            src={logoNoBG}
            alt="Logo"
            width={80}
            height={80}
            className="opacity-80"
          />
          <h1 className="text-4xl font-bold tracking-tight">Catatan Keuanganmu</h1>
        </div>
      </div>

      {/* SALDO SECTION */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl opacity-30"></div>

        <div className="relative bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 rounded-xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Wallet className="h-7 w-7 text-emerald-400" />
                </div>
                <span className="text-gray-400 text-lg">Saldo Saat Ini</span>
              </div>

              <h1 className="text-5xl font-bold">{format(summary.saldo)}</h1>
              <p className="text-gray-500 text-sm">Diperbarui secara real-time</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="dashboard/add-transaction"
                className="px-5 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Tambah Transaksi
              </Link>

              <Link
                href="dashboard/total-transactions"
                className="px-5 py-2 border border-neutral-700 rounded-lg text-gray-300 hover:bg-neutral-800"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="Total Pemasukan"
          value={summary.pemasukan}
          icon={<TrendingUp className="text-emerald-400" />}
          color="text-emerald-400"
          border="border-emerald-500/20"
        />

        <SummaryCard
          title="Total Pengeluaran"
          value={summary.pengeluaran}
          icon={<TrendingDown className="text-red-400" />}
          color="text-red-400"
          border="border-red-500/20"
        />

        <SummaryCard
          title="Sisa Hutang"
          value={summary.hutang}
          icon={<AlertCircle className="text-orange-400" />}
          color="text-orange-400"
          border="border-orange-500/20"
        />
      </div>

      {/* TRANSAKSI TERBARU */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Transaksi Terbaru</h2>

          <Link
            href="/dashboard/filter-transactions"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 hover:bg-emerald-500/10 px-3 py-1 rounded"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="border border-neutral-800 rounded-lg">
          {recent.length === 0 && (
            <p className="p-4 text-gray-400">Belum ada transaksi.</p>
          )}

          {recent.map((t) => (
            <div
              key={t.id}
              className="p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(t.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`${colorByType(t.type)} font-bold text-lg`}>
                    {prefixByType(t.type)}
                    {format(t.amount)}
                  </p>
                  <p className={`text-xs ${colorByType(t.type)}`}>
                    {labelByType(t.type)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, color, border }) {
  return (
    <div
      className={`bg-neutral-900/60 border ${border} p-6 rounded-xl hover:scale-105 hover:bg-neutral-900 transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{format(value)}</p>
        </div>
        <div className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function format(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}

function prefixByType(type) {
  return type === "pemasukan" || type === "hutang" ? "+" : "-";
}

function labelByType(type) {
  switch (type) {
    case "pemasukan":
      return "Pemasukan";
    case "pengeluaran":
      return "Pengeluaran";
    case "hutang":
      return "Hutang";
    case "bayar_hutang":
      return "Bayar Hutang";
    default:
      return type;
  }
}

function colorByType(type) {
  switch (type) {
    case "pemasukan":
      return "text-emerald-400";
    case "pengeluaran":
      return "text-red-400";
    case "hutang":
      return "text-orange-400";
    case "bayar_hutang":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
}
