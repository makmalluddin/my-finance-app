"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("pemasukan");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Ambil user yang login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg("Anda belum login.");
      setLoading(false);
      return;
    }

    // Insert transaksi
    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: Number(amount),
      type: type,
      description: description,
    });

    if (insertError) {
      setErrorMsg(insertError.message);
      setLoading(false);
      return;
    }

    // Redirect ke dashboard
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Tambah Transaksi</h1>

      {errorMsg && (
        <p className="bg-red-200 text-red-800 p-2 rounded mb-3">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Nominal */}
        <input
          type="number"
          placeholder="Nominal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {/* Jenis Transaksi */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
          <option value="hutang">Hutang</option>
          <option value="bayar_hutang">Bayar Hutang</option>
        </select>

        {/* Keterangan */}
        <textarea
          placeholder="Keterangan (opsional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded h-24"
        ></textarea>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>

      </form>
    </div>
  );
}
