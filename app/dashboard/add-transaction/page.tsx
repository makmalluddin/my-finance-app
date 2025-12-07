"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { DollarSign, Plus } from "lucide-react";

export default function AddTransactionPage() {
  const router = useRouter();

  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<string>("pemasukan");
  const [description, setDescription] = useState<string>("");

  const [error, setError] = useState<string>("");

  const types = [
    { value: "pemasukan", label: "Pemasukan", color: "emerald" },
    { value: "pengeluaran", label: "Pengeluaran", color: "red" },
    { value: "hutang", label: "Hutang", color: "orange" },
    { value: "bayar_hutang", label: "Bayar Hutang", color: "blue" },
  ];

  const selectedType = types.find((t) => t.value === type);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!amount || !type || !description) {
      setError("Semua field wajib diisi.");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      setError("Anda belum login.");
      return;
    }

    const { error: insertError } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: Number(amount),
      type,
      description,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Tambah Transaksi</h1>
        <p className="text-gray-400 text-lg">Catat transaksi keuangan harian Anda</p>
      </div>

      {/* CARD FORM */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-8">
        <CardHeader>
          {error && (
            <p className="bg-red-500/10 border border-red-500/40 text-red-300 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-3">
              <Label className="text-gray-300">Jumlah *</Label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white pl-12 py-6 text-2xl font-bold placeholder:text-gray-600 focus:border-emerald-500"
                />
              </div>
              <p className="text-gray-500 text-sm">Masukkan nominal dalam Rupiah</p>
            </div>

            {/* Type */}
            <div className="space-y-3">
              <Label className="text-gray-300">Jenis Transaksi *</Label>

              <Select
                value={type}
                onValueChange={(value) => setType(value)}
              >
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white py-6 focus:border-emerald-500">
                  <SelectValue placeholder="Pilih jenis transaksi" />
                </SelectTrigger>

                <SelectContent className="bg-gray-800 border-gray-700">
                  {types.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-${t.color}-400`} />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="text-gray-300">Keterangan *</Label>
              <Textarea
                placeholder="Contoh: Gaji bulan Januari, Belanja bulanan..."
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                className="bg-gray-800/50 border-gray-700 text-white min-h-[120px] resize-none focus:border-emerald-500"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-6 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tambah Transaksi
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {type && (
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Preview Transaksi</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {description || "Keterangan transaksi"}
                </p>
                <p className={`text-sm text-${selectedType?.color}-400`}>
                  {selectedType?.label}
                </p>
              </div>

              <p className={`text-2xl font-bold text-${selectedType?.color}-400`}>
                {type === "pemasukan" || type === "hutang" ? "+" : "-"}
                Rp {amount ? Number(amount).toLocaleString("id-ID") : "0"}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
