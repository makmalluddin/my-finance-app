"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function EditTransaction() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // ✔ tidak async, aman untuk client component

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    type: "",
    description: "",
  });

  // ===========================
  // LOAD DATA
  // ===========================
  const loadData = useCallback(async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setForm({
      amount: data.amount,
      type: data.type,
      description: data.description,
    });

    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  // ===========================

  // ===========================
  // UPDATE DATA
  // ===========================
  const updateTransaction = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("transactions")
      .update(form)
      .eq("id", id);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Transaksi berhasil diperbarui!");
    router.push("/transactions");
  };
  // ===========================

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Transaksi</h1>

      <form onSubmit={updateTransaction} className="space-y-3">

        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Pilih Jenis</option>
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
          <option value="hutang">Hutang</option>
          <option value="bayar hutang">Bayar Hutang</option>
        </select>

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
