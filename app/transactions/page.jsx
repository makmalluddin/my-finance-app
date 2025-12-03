"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setTransactions(data);

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadTransactions();
    })();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Transaksi</h1>

      <Link
        href="/transactions/new"
        className="bg-blue-600 text-white px-3 py-2 rounded inline-block mb-4"
      >
        + Tambah Transaksi
      </Link>

      <div className="bg-white border rounded shadow-sm">
        {transactions.length === 0 && (
          <p className="p-4">Belum ada transaksi.</p>
        )}

        {transactions.map((t) => (
          <div
            key={t.id}
            className="border-b p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{t.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(t.created_at).toLocaleString("id-ID")}
              </p>
              <p className="text-sm capitalize">{t.type}</p>
            </div>

            <div className="text-right">
              <p className="font-bold">{formatNumber(t.amount)}</p>

              {/* tombol edit dan delete */}
              <div className="mt-2 flex gap-2 justify-end">
                <Link
                  href={`/transactions/edit/${t.id}`}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// =====================
// DELETE FUNCTION
// =====================
async function deleteTransaction(id) {
  const confirmDelete = confirm("Yakin ingin menghapus?");
  if (!confirmDelete) return;

  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (!error) {
    alert("Berhasil dihapus!");
    window.location.reload(); // refresh daftar
  } else {
    alert("Gagal menghapus: " + error.message);
  }
}

// =====================
// Format angka
// =====================
function formatNumber(num) {
  return "Rp " + Number(num).toLocaleString("id-ID");
}
