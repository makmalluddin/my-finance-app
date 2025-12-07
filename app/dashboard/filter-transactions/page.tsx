"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";

import { Calendar, Filter as FilterIcon, Search } from "lucide-react";

// =========================================
// Typing
// =========================================
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "pemasukan" | "pengeluaran" | "hutang" | "bayar_hutang" | string;
  description: string | null;
  created_at: string | null;
}

export default function FilterTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filterMonth, setFilterMonth] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");

  // =======================
  // Edit & Delete states
  // =======================
  const [editData, setEditData] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // =======================
  // Fetch Data
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTransactions(data as Transaction[]);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // =======================
  // Helpers
  // =======================
  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const transactionTypes = [
    { value: "pemasukan", label: "Pemasukan" },
    { value: "pengeluaran", label: "Pengeluaran" },
    { value: "hutang", label: "Hutang" },
    { value: "bayar_hutang", label: "Bayar Hutang" },
  ];

  const getTypeColor = (type: string) => {
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
  };

  const formatCurrency = (value: number) =>
    "Rp " + value.toLocaleString("id-ID");

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =======================
  // Filtering
  // =======================
  const filteredTransactions = transactions.filter((t) => {
    let matchMonth = true;
    let matchType = true;

    if (filterMonth) {
      const m = t.created_at ? new Date(t.created_at).getMonth() + 1 : null;
      matchMonth = m !== null && m.toString().padStart(2, "0") === filterMonth;
    }

    if (filterType) {
      matchType = t.type === filterType;
    }

    return matchMonth && matchType;
  });

  const totalAmount = filteredTransactions.reduce((sum, t) => {
    if (t.type === "pemasukan" || t.type === "hutang")
      return sum + t.amount;
    return sum - t.amount;
  }, 0);

  // =======================
  // Reset filter
  // =======================
  const handleReset = () => {
    setFilterMonth("");
    setFilterType("");
  };

  // =======================
  // UPDATE TRANSACTION
  // =======================
  const handleUpdateTransaction = async () => {
    if (!editData) return;

    const { error } = await supabase
      .from("transactions")
      .update({
        amount: editData.amount,
        type: editData.type,
        description: editData.description,
      })
      .eq("id", editData.id);

    if (!error) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === editData.id ? editData : t))
      );
      setEditData(null);
    }
  };

  // =======================
  // DELETE TRANSACTION
  // =======================
  const handleDeleteTransaction = async () => {
    if (!deleteId) return;

    await supabase.from("transactions").delete().eq("id", deleteId);

    setTransactions((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  // ======================================================================
  // RENDER PAGE
  // ======================================================================
  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8 space-y-10">
      {/* Header */}
        <div className="flex items-start justify-between">
            <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
                Filter Transaksi
            </h1>
            <p className="text-gray-400 text-lg">
                Temukan transaksi berdasarkan periode atau jenis
            </p>
            </div>

            {/* Export Button */}
            <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 shadow-lg whitespace-nowrap"
            >
            <a href="/api/export/excel">Export Excel</a>
            </Button>
        </div>

      {/* FILTER CARD */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Month */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Bulan
            </label>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Semua Bulan" />
              </SelectTrigger>
              <SelectContent className="text-white bg-gray-800 border-gray-700">
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
              <FilterIcon className="h-4 w-4" /> Jenis
            </label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                <SelectValue placeholder="Semua Jenis" />
              </SelectTrigger>
              <SelectContent className="text-white bg-gray-800 border-gray-700">
                {transactionTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          <div className="space-y-2">
            <label className="text-transparent">.</label>
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full bg-transparent border-gray-700 text-gray-300"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <p className="text-gray-400 text-sm">Total Transaksi</p>
          <p className="text-4xl font-bold text-white">
            {filteredTransactions.length}
          </p>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <p className="text-gray-400 text-sm">Total Nilai</p>
          <p
            className={`text-4xl font-bold ${
              totalAmount >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatCurrency(totalAmount)}
          </p>
        </Card>
      </div>

      {/* ========================= RESULTS ========================== */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Search className="h-6 w-6" /> Hasil Pencarian
        </h2>

        {loading ? (
          <Card className="bg-gray-900/50 border-gray-800 p-6 text-center text-gray-400">
            Memuat data...
          </Card>
        ) : filteredTransactions.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800 p-10 text-center">
            <p className="text-gray-500 text-lg">Tidak ada transaksi ditemukan</p>
          </Card>
        ) : (
          <Card className="bg-gray-900/50 border-gray-800">
            <div className="divide-y divide-gray-800">
              {filteredTransactions.map((t) => (
                <div
                  key={t.id}
                  className="p-5 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <p className="text-white font-medium text-lg">
                        {t.description ?? "-"}
                      </p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(t.created_at)}
                        </span>

                        <span
                          className={`font-medium ${getTypeColor(t.type)}`}
                        >
                          {t.type.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className={`text-2xl font-bold ${getTypeColor(t.type)}`}>
                        {t.type === "pemasukan" || t.type === "hutang" ? "+" : "-"}
                        {formatCurrency(t.amount)}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent border text-white hover:bg-blue-700"
                          onClick={() => setEditData(t)}
                        >
                          Edit
                        </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-transparent border text-white hover:bg-blue-700"
                            onClick={() => setDeleteId(t.id)}
                          >
                            Delete
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ======================== EDIT MODAL ======================== */}
      <Dialog open={!!editData} onOpenChange={() => setEditData(null)}>
        <DialogContent className="bg-gradient-to-br from-gray-900 from-70% to-gray-800 border-gray-700 p-6 space-y-4/50">
          <DialogHeader className="text-white">
            <DialogTitle>Edit Transaksi</DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-3">
              <Input
                type="number"
                value={editData.amount}
                className="text-white border-gray-700"
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    amount: Number(e.target.value),
                  })
                }
              />

              <Select
                value={editData.type}
                onValueChange={(v) =>
                  setEditData({ ...editData, type: v })
                }
              >
                <SelectTrigger className="text-white border-gray-700">
                  <SelectValue placeholder="Jenis Transaksi" />
                </SelectTrigger>

                <SelectContent>
                  {transactionTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={editData.description ?? ""}
                className="text-white border-gray-700"
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    description: e.target.value,
                  })
                }
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditData(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTransaction}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================== DELETE DIALOG ======================== */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-gray-900 from-70% to-gray-800 border-gray-700 p-6 space-y-4/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Hapus transaksi ini?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeleteTransaction}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
